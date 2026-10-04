import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pool } from "./pool.js";
import { createHash } from "node:crypto";

export async function migrate() {
  const directory = path.join(path.dirname(fileURLToPath(import.meta.url)), "migrations");
  const client = await pool.connect();
  try {
  await client.query("SELECT pg_advisory_lock(1701737326)");
  await client.query("CREATE TABLE IF NOT EXISTS schema_migrations (version text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())");
  await client.query("ALTER TABLE schema_migrations ADD COLUMN IF NOT EXISTS checksum text");
  const files=(await fs.readdir(directory)).filter(x=>x.endsWith(".sql")).sort();
  const versions=(await client.query("SELECT version FROM schema_migrations")).rows;
  if(versions.some(row=>!files.includes(row.version)))throw new Error("Database contains migrations unknown to this runtime; downgrade refused");
  for (const file of files) {
    const sql=await fs.readFile(path.join(directory,file),"utf8");
    const checksum=createHash("sha256").update(sql).digest("hex");
    const applied = await client.query("SELECT checksum FROM schema_migrations WHERE version=$1", [file]);
    if (applied.rowCount) {
      if(applied.rows[0].checksum&&applied.rows[0].checksum!==checksum)throw new Error(`Migration changed after application: ${file}`);
      // Older versions had no checksums. Adopt once, then enforce immutability.
      await client.query("UPDATE schema_migrations SET checksum=$1 WHERE version=$2 AND checksum IS NULL",[checksum,file]);
      continue;
    }
    try { await client.query("BEGIN"); await client.query(sql); await client.query("INSERT INTO schema_migrations(version,checksum) VALUES($1,$2)", [file,checksum]); await client.query("COMMIT"); }
    catch (error) { await client.query("ROLLBACK"); throw error; }
    console.log(`Applied migration ${file}`);
  }
  } finally { try { await client.query("SELECT pg_advisory_unlock(1701737326)"); } finally { client.release(); } }
}
if (process.argv[1] === fileURLToPath(import.meta.url)) migrate().then(() => pool.end()).catch(() => { console.error("Migration failed. Check database availability and migration integrity."); process.exitCode = 1; return pool.end(); });
