<p align="center"><img src="Client/public/envsync-mark.svg" width="64" height="64" alt="EnvSync" /></p>

# EnvSync

Self-hosted secrets for developers, applications and AI agents. One product; Personal and Business deployment profiles.

## Install

**1.0.0 release candidate — not yet published or declared production-ready.** The intended installation after controlled publication is:

```sh
npm install -g envsync
envsync setup
envsync start
```

The npm name returned no published package during this audit; registry ownership/publication is still unverified. Container release references have not been configured. Do not assume the public install command works today.

To evaluate the prepared installer from this checkout (Node 20+, Docker with Compose v2):

```sh
docker build -t envsync-release-api:1.0.0 WebService
docker build -t envsync-release-web:1.0.0 Client
cd cli
npm pack
npm install -g ./envsync-1.0.0.tgz
envsync setup --api-image envsync-release-api:1.0.0 --web-image envsync-release-web:1.0.0
```

Choose Personal or Business and create your owner account. No host PostgreSQL or separate frontend/backend dependency installation is required. The packaged CLI itself contains only the installer and runtime manifest. Published container artifacts will remove the checkout/build requirement for end users.

Default console: [localhost:8088](http://localhost:8088). Only loopback is published; no hosts-file changes. The CLI-managed instance is separate from an existing root Docker Compose deployment.

## Everyday commands

```sh
envsync start
envsync status
envsync doctor
envsync logs
envsync stop
envsync restart
envsync backup --output /your/secure/location/envsync.dump
envsync --help
```

Stop/restart preserve persistent volumes. Setup refuses to overwrite an existing owner/configuration. Interrupted first bootstrap can use `setup --resume`; if bootstrap already completed, use `start`. Update currently reports that no published update source is configured and changes nothing.

## Personal / Business

**Personal:** one owner, projects, environments, encrypted secrets, application keys, SDKs, approved agents, expiry, revocation and audit. Team administration and resource sharing are absent from navigation and rejected by the backend.

**Business:** the same core plus local user administration, read/write ceilings, explicit resource sharing, administrator-controlled SDK access and agent governance. SMTP/invitations are not implemented or required.

Backend capabilities drive UI navigation. Existing deployments migrate to Business without changing users or volumes. There is no automatic profile conversion.

## Access and secret handling

Passwords use bcrypt cost 12 (maximum 72 UTF-8 bytes). Session-bound signed access tokens and hashed, rotating HttpOnly refresh tokens support revocation; deploying this candidate requires users to sign in again. Cookies are Secure on HTTPS public URLs; HTTP loopback is supported.

Ownership or explicit sharing grants resource access; global read/write permissions alone no longer expose all projects. Read-only environment shares cannot modify secrets. A shared secret is one value across its attachments: **cloning an environment copies links, not independent secret values**. Agent writes require write access to every attached environment.

API keys are stored hashed, revealed once and scoped by project/optional environment. Non-admin keys begin with pull disabled until an administrator enables them. Human reveal also retains the existing pull-permission requirement. SDK endpoints require application keys; agent SDK credentials use the separate agent routes.

AES-256-GCM encrypts secret values at rest. Never lose the matching master key. See [backup and recovery](docs/BACKUP_RECOVERY.md) and [security](SECURITY.md).

## SDKs

SDKs are separate from the installer:

- Node: `sdk/node`, package `@envsync/node`, TypeScript declarations, no runtime dependencies.
- Python: `sdk/python`, package `envsync`, type hints, no runtime dependencies.

Package publication is a separate controlled release. Application keys retrieve only their approved scope. Both SDKs support agent credentials with an explicit environment.

## MCP

MCP uses **STDIO**, not an HTTP MCP endpoint. Clients launch `envsync mcp serve` with `ENVSYNC_AGENT_CREDENTIAL` configured securely in their environment. The owner/administrator approves environments, independent READ/READ_WRITE grants, TTL and revocation in the console. No delete tool is exposed. MCP can be disabled at setup.

See [MCP guide](docs/MCP_AGENTS.md). Real Claude/Codex/Cursor client interoperability is not inferred from protocol tests.

## Configuration and operations

Configuration lives in `~/.envsync` or `ENVSYNC_HOME`. Non-secret settings are in `instance.json`; sensitive runtime keys are in `runtime.env`. Unix modes are 0700/0600. Windows ACLs need verification. Do not commit generated files or copy them into tickets.

Installed runtime is loopback-only. Remote/TLS deployment requires a reviewed reverse-proxy/public-URL configuration; it is not an automatic CLI feature yet. Docker access grants powerful local access: treat the machine's Docker administrators as trusted operators.

## Development and verification

```sh
npm ci
npm run check
npm --prefix cli test
node scripts/scan-secrets.js
node scripts/release-integration.js
```

Integration tests require locally built release-test images, create isolated instances on ports 18880–18891, test installed-package setup and recovery, then stop them. They retain test volumes and owner-only configuration for investigation; they do not touch the live application.

The legacy checkout setup (`npm run setup`) remains for existing Business deployments; the CLI does not automatically adopt its `envsync-data-v2` volume.

Read the honest [1.0 release report](docs/ENVSYNC_1.0_RELEASE_REPORT.md) before any production rollout.
