#!/usr/bin/env node
import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import readline from "node:readline/promises";
import process from "node:process";

const root = path.resolve(
  path.dirname(new URL(import.meta.url).pathname),
  "..",
);
const envPath = path.join(root, ".env");
const args = Object.fromEntries(
  process.argv
    .slice(3)
    .filter((x) => x.startsWith("--"))
    .map((x) => {
      const [k, ...v] = x.slice(2).split("=");
      return [k, v.join("=") || true];
    }),
);
const quote = (value) => JSON.stringify(String(value));
async function exists(file) {
  try {
    await fs.access(file);
    return true;
  } catch {
    return false;
  }
}
function validatePassword(value) {
  return (
    value.length >= 12 &&
    /[a-z]/.test(value) &&
    /[A-Z]/.test(value) &&
    /\d/.test(value)
  );
}

async function setup() {
  const dockerMode = Boolean(args.docker);
  const cyan = "\x1b[36m", green = "\x1b[32m", dim = "\x1b[2m", bold = "\x1b[1m", reset = "\x1b[0m";
  console.log(`\n${cyan}${bold}  Welcome to EnvSync${reset}`);
  console.log(`  ${dim}Your infrastructure is ready. Let's configure the workspace.${reset}\n`);
  if (!dockerMode && (await exists(envPath)) && !args.force) {
    console.error(
      "Setup has already created WebService/.env. No files were changed. Use --force only when intentionally reconfiguring.",
    );
    process.exitCode = 2;
    return;
  }
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const ask = async (label, fallback, validate = Boolean) => {
    while (true) {
      const answer =
        args[label] ||
        (await rl.question(
          `${label.replaceAll("-", " ")}${fallback ? ` [${fallback}]` : ""}: `,
        ));
      const value = String(answer || fallback || "").trim();
      if (validate(value)) return value;
      console.log("Invalid value; please try again.");
    }
  };
  try {
    const organization = await ask("organization", "Acme Corporation");
    const instance = await ask("instance", "EnvSync");
    const adminName = await ask("admin-name", "System Administrator");
    const adminEmail = await ask("admin-email", undefined, (v) =>
      /^\S+@\S+\.\S+$/.test(v),
    );
    const adminPassword = await ask(
      "admin-password",
      undefined,
      validatePassword,
    );
    const databaseUrl = dockerMode ? process.env.DATABASE_URL : await ask("database-url", "postgres://envsync:password@localhost:5432/envsync", (v) => v.startsWith("postgres"));
    const host = dockerMode ? "0.0.0.0" : await ask("host", "0.0.0.0");
    const environment = dockerMode ? "production" : await ask("environment", "production", (v) => ["development", "test", "testing", "staging", "production"].includes(v));
    let publicUrl;
    if (dockerMode) publicUrl = process.env.PUBLIC_URL;
    else {
      const port = await ask("port", "8080", (v) => Number(v) > 0 && Number(v) < 65536);
      const hostname = await ask("hostname", "envsync.local");
      const tls = await ask("tls", "no", (v) => ["yes", "no"].includes(v.toLowerCase()));
      publicUrl = `${tls.toLowerCase() === "yes" ? "https" : "http"}://${hostname}${["80", "443"].includes(port) ? "" : `:${port}`}`;
    }
    const content = [
      `NODE_ENV=${quote(environment === "testing" ? "test" : environment)}`,
      `DATABASE_URL=${quote(databaseUrl)}`,
      `HOST=${quote(host)}`,
      `PORT=${quote("8080")}`,
      `PUBLIC_URL=${quote(publicUrl)}`,
      `CORS_ORIGINS=${quote(publicUrl)}`,
      `JWT_SECRET=${quote(dockerMode ? process.env.JWT_SECRET : crypto.randomBytes(48).toString("base64url"))}`,
      `ENVSYNC_MASTER_KEY=${quote(dockerMode ? process.env.ENVSYNC_MASTER_KEY : crypto.randomBytes(32).toString("base64"))}`,
      `SETUP_ORGANIZATION=${quote(organization)}`,
      `SETUP_INSTANCE=${quote(instance)}`,
      "",
    ].join("\n");
    if (!dockerMode) await fs.writeFile(envPath, content, { mode: 0o600, flag: args.force ? "w" : "wx" });
    process.env.DATABASE_URL = databaseUrl;
    process.env.JWT_SECRET = "setup-temporary-key-at-least-32-chars";
    process.env.ENVSYNC_MASTER_KEY = content.match(
      /ENVSYNC_MASTER_KEY="([^"]+)/,
    )[1];
    const { pool } = await import("../db/pool.js");
    try {
      await pool.query("SELECT 1");
    } catch (error) {
      throw new Error(
        `Database connection failed: ${error.message}. ${dockerMode ? "Run docker compose logs db, then rerun npm run setup from the repository root." : "Fix DATABASE_URL in WebService/.env and rerun npm run setup -- --force."}`,
      );
    }
    const { migrate } = await import("../db/migrate.js");
    const { hashPassword } = await import("../lib/security.js");
    await migrate();
    await pool.query(
      `INSERT INTO instance_settings(id,organization_name,instance_name,public_url) VALUES(true,$1,$2,$3) ON CONFLICT(id) DO UPDATE SET organization_name=excluded.organization_name,instance_name=excluded.instance_name,public_url=excluded.public_url`,
      [organization, instance, publicUrl],
    );
    const count = await pool.query("SELECT count(*)::int count FROM users");
    if (count.rows[0].count > 0 && !args.force)
      throw new Error(
        "A user already exists; refusing to create another bootstrap administrator.",
      );
    if (count.rows[0].count === 0)
      await pool.query(
        "INSERT INTO users(full_name,email,password_hash,role,permissions) VALUES($1,lower($2),$3,'ADMIN',$4)",
        [
          adminName,
          adminEmail,
          await hashPassword(adminPassword),
          { read: true, write: true, can_pull_secrets: true },
        ],
      );
    await pool.end();
    console.log(
      `\n${green}${bold}  ✓ Workspace configured${reset}\n  Organization  ${organization}\n  Administrator ${adminEmail}\n  URL           ${publicUrl}\n`,
    );
  } finally {
    rl.close();
  }
}
if (process.argv[2] !== "setup") {
  console.log("Usage: envsync setup [--organization=...] [--force]");
  process.exitCode = 1;
} else
  setup().catch((e) => {
    console.error(`\nSetup failed: ${e.message}`);
    process.exitCode = 1;
  });
