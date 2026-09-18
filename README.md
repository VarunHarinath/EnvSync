<p align="center">
  <img src="Client/public/envsync-mark.svg" width="72" height="72" alt="EnvSync symbol" />
</p>

<h1 align="center">EnvSync</h1>

<p align="center">Self-hosted secrets for development teams.</p>

EnvSync is a self-hosted secrets platform with local accounts, centralized permissions, AES-256-GCM encryption, scoped application keys, audit history, and Node.js and Python clients. It has no mandatory external identity or SaaS dependency.

## One-command setup after cloning

Requirements: Node.js 20+ and Docker Desktop or Docker Engine. EnvSync does not use a host PostgreSQL installation.

```bash
git clone https://github.com/VarunHarinath/EnvSync.git
cd EnvSync
npm run setup
```

That single root command generates a local mode-0600 `.env`, starts PostgreSQL in Docker, builds the API and web images, launches the interactive organization/administrator wizard, applies every migration, and starts the complete stack. Database data is retained in the `envsync-data-v2` Docker volume.

After setup, manage the complete stack from the repository root:

```bash
docker compose up -d --wait
docker compose logs -f
docker compose down
```

Other root commands are `npm test`, `npm run lint`, `npm run build`, and `npm run check`.

## Docker

Use `npm run setup`; it is the supported Docker-native first-run path. PostgreSQL is isolated on an internal network; only the web proxy is published. The API applies versioned migrations on startup and exposes `/health` and `/ready`.

## Authentication, authorization, and storage

Administrators have full access. User permissions are centralized as `read`, `write`, and `can_pull_secrets`; only administrators can alter users or API-key pull permission. Non-admin-created keys always start with pull disabled. Raw `es_live_` keys appear once, while only SHA-256 digests remain in PostgreSQL.

Access tokens expire after 15 minutes by default. Random refresh tokens are hashed, carried in HttpOnly SameSite=Strict cookies, and rotated. Passwords use bcrypt cost 12; five failed logins cause a 15-minute lock. Secret lists never contain plaintext. Reveal and SDK endpoints authorize, decrypt in memory, and write audit metadata without secret values.

Protect and separately back up `ENVSYNC_MASTER_KEY`: losing it makes stored values unrecoverable. Database backups alone are intentionally insufficient.

## Internal hostname and TLS

Point an internal DNS record such as `envsync.acme.internal` at the host and set `PUBLIC_URL`. `.local` can work through mDNS on small networks, but managed DNS is more reliable. Put Caddy or Nginx in front for TLS, forward `Host`, `X-Real-IP`, and `X-Forwarded-Proto`, and set `TRUST_PROXY=true`. An internal CA or Caddy's internal CA works for private names after its root is installed on clients.

## SDKs

`sdk/node` exports `EnvSync`, `get`, `getMany`, `getAll`, `health`, `reload`, TypeScript types, typed errors, timeouts, and optional millisecond TTL caching. `sdk/python` provides equivalent `get`, `get_many`, `get_all`, `health`, and `reload` behavior with type hints and no runtime dependency.

V2 also supports approved `ea_live_` agent credentials. Agent SDK clients must provide an explicit `environmentId`/`environment_id`; the backend applies the same status, environment, access-level, expiry, and revocation policy used by MCP.

## MCP agents (V2)

Agents enroll as pending and cannot read a secret until an administrator approves an explicit environment assignment. Assignments can be read-only or read/write, may expire, and can be revoked immediately. EnvSync's STDIO server exposes discovery, read, write, and access-request tools; it intentionally exposes no delete tool.

See [MCP agents and AI clients](docs/MCP_AGENTS.md) for enrollment, Docker configuration, Postman endpoints, threat model, and troubleshooting.

## Operations

- Back up with `pg_dump -Fc`; store the master key separately.
- Restore with `pg_restore`, configure the same key, and start the API to apply later migrations.
- Upgrade only after a backup, rebuild, and verify `/ready`.
- SMTP invitations are not enabled; administrators create accounts and convey temporary passwords through an existing secure channel.
- Audit records include actor, action, resource, result, IP, user agent, and time—never decrypted values.

## Verification

```bash
cd WebService && npm test && npm run check
cd Client && npm run lint && npm run build
cd sdk/node && npm test
cd sdk/python && PYTHONPATH=src python3 -m unittest discover -s tests -v
docker compose config
```

See [SECURITY.md](SECURITY.md). Contributions should include tests, never log credentials or secret values, and enforce authorization on the backend.
