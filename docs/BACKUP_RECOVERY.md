# Backup and recovery — 1.0.0 candidate

Back up three things: a consistent PostgreSQL custom archive, `runtime.env` (especially `ENVSYNC_MASTER_KEY`), and `instance.json`. Treat all three as sensitive; use encrypted offline storage and separate key custody. Losing the master key means encrypted values cannot be recovered. Backups also contain password hashes, hashed credentials, identities and audit data.

## Create

```sh
envsync backup --output /secure/backup/envsync.dump
```

The CLI invokes `pg_dump -Fc --no-owner --no-acl`, uses owner-only permissions on Unix, and refuses to overwrite files. Copy `runtime.env` and `instance.json` into secure backup custody separately. Do not run arbitrary shell commands that print them. An interrupted archive is invalid until verified; the CLI does not silently remove it.

## Restore to a fresh machine or isolated instance

1. Install the matching 1.0.0 CLI and Docker. Obtain the same trusted runtime images. Prefer immutable image digests.
2. Recover `instance.json` and `runtime.env` to a new instance directory, with 0700 directory and 0600 files on Unix (review ACLs on Windows). Preserve all cryptographic material exactly.
3. Use `ENVSYNC_HOME` to select that directory. On the **same Docker host**, assign a new `projectName` matching `envsync-` plus 12 hexadecimal characters, and a free port in `instance.json`. Otherwise the original project name refers to the original volume, and restoration will be refused. Do not edit keys to resolve errors.
4. Run `envsync restore --input /secure/backup/envsync.dump --yes`. Restore starts PostgreSQL only, refuses a nonempty public schema, and uses `pg_restore --single-transaction --exit-on-error`. It never drops or cleans an existing database.
5. Run `envsync start`, then `envsync doctor`. Startup serializes and applies pending migrations.
6. Log in, verify representative project/environment counts, reveal a known synthetic test secret, exercise SDK access, and check audit history. A green database check alone does not prove you have the correct encryption key.

Only trusted EnvSync archives may be restored: PostgreSQL archives can contain executable SQL. Restore into isolated infrastructure first. A database backup is not a master-key rotation mechanism. Never restore newer schema versions into older runtime versions.

## Verification performed

`node scripts/release-integration.js` installed a packed CLI in a temporary prefix, created Personal and Business instances, added an encrypted test secret, backed each up, restored each into an independent empty database, and verified successful login and secret decryption. Re-restoring over the populated database was rejected. Source data remained intact.

This is local Docker Desktop verification, not a clean-machine, Windows, disaster-site or large-dataset recovery benchmark. Test your own backup custody and recovery regularly.
