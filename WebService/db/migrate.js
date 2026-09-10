import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pool } from "./pool.js";

export async function migrate() {
  const directory = path.join(path.dirname(fileURLToPath(import.meta.url)), "migrations");
  await pool.query("CREATE TABLE IF NOT EXISTS schema_migrations (version text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())");
  for (const file of (await fs.readdir(directory)).filter((x) => x.endsWith(".sql")).sort()) {
    const applied = await pool.query("SELECT 1 FROM schema_migrations WHERE version=$1", [file]); if (applied.rowCount) continue;
    const client = await pool.connect(); try { await client.query("BEGIN"); await client.query(await fs.readFile(path.join(directory, file), "utf8")); await client.query("INSERT INTO schema_migrations(version) VALUES($1) ON CONFLICT DO NOTHING", [file]); await client.query("COMMIT"); }
    catch (error) { await client.query("ROLLBACK"); throw error; } finally { client.release(); }
    console.log(`Applied migration ${file}`);
  }
}
if (process.argv[1] === fileURLToPath(import.meta.url)) migrate().then(() => pool.end()).catch((e) => { console.error(e.message); process.exitCode = 1; });
