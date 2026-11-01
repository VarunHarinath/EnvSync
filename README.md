<div align="center">

<img src="Client/public/envsync-mark.svg" width="80" height="80" alt="EnvSync logo" />

# EnvSync

### Your infrastructure. Your secrets. Your control.

**Self-hosted secrets management for developers, applications, and AI agents.**

Manage environment variables across projects, grant scoped access, and keep your secrets on infrastructure you control.

[Website](https://envsync.me) · [Documentation](docs/) · [Report an Issue](https://github.com/VarunHarinath/EnvSync/issues) · [Contact](mailto:varunharinath@envsync.me)

![Release](https://img.shields.io/badge/release-1.0.0%20RC-orange?style=flat-square) ![Deployment](https://img.shields.io/badge/deployment-self--hosted-6f42c1?style=flat-square) ![Docker](https://img.shields.io/badge/Docker-required-2496ED?style=flat-square) ![MCP](https://img.shields.io/badge/MCP-STDIO%20%7C%20testing-purple?style=flat-square)

</div>

> [!IMPORTANT]
> **EnvSync 1.0.0 is a release candidate, not a production-ready release.** The CLI and SDK packages have not been confirmed published to public registries, and container release artifacts are not yet configured. Use the checkout-based evaluation instructions below rather than assuming `npm install -g envsync` works.

## Why EnvSync?

`.env` files work. Until a project grows.

Credentials spread across laptops, servers, CI pipelines, and agent workflows. Copies drift, access is hard to track, and revoking access becomes complicated.

**EnvSync provides one place to organize secrets by project and environment, with explicit permissions for people, applications, and approved AI agents.**

## Features

| Capability | What it does |
| --- | --- |
| 🔐 Encrypted secrets | Stores secret values using AES-256-GCM encryption at rest. |
| 🌍 Environments | Organizes projects across development, testing, staging, and production. |
| 👥 Controlled sharing | Supports ownership and explicit resource sharing in Business mode. |
| 🔑 Scoped application keys | Restricts application access to a project or environment, with pull permissions. |
| 📦 Node.js and Python SDKs | Includes source for application integrations; registry publication is separate. |
| 🤖 Agent access | Supports approvals, environment grants, read/read-write permissions, expiration, and revocation. |
| 🐳 Self-hosting | Runs with Docker Compose, a Node.js API, frontend, and PostgreSQL. |
| 📋 Audit history | Records supported security-relevant activity. |

## How it works

```text
People (console)     Applications (SDK)     AI agents (MCP / STDIO)
        \                    |                     /
         \                   |                    /
          +------------------+-------------------+
                             |
                       EnvSync API
                             |
                    Identity + authorization
                             |
                    Projects / environments
                             |
                       Encrypted secrets
                             |
                         PostgreSQL
```

**Access is requested and checked, not assumed.** A connection alone does not grant permission to retrieve a secret.

## Getting started

### Prerequisites

- Node.js 20 or newer
- Docker with Compose v2
- A local machine where you can run Docker

### Evaluate the current release candidate

Clone the repository:

```bash
git clone https://github.com/VarunHarinath/EnvSync.git
cd EnvSync
```

Build the local release images:

```bash
docker build -t envsync-release-api:1.0.0 WebService
docker build -t envsync-release-web:1.0.0 Client
```

Package and install the CLI from the checkout:

```bash
cd cli
npm pack
npm install -g ./envsync-1.0.0.tgz
```

Start setup using those locally built images:

```bash
envsync setup \
  --api-image envsync-release-api:1.0.0 \
  --web-image envsync-release-web:1.0.0
```

Choose **Personal** or **Business**, then create your owner account. Start the instance if needed:

```bash
envsync start
```

Open **http://localhost:8088**. The default CLI-managed installation publishes only to loopback. It does not automatically configure public HTTPS access.

### Planned public installation

Once packages and container images are published and verified, the intended workflow is:

```bash
npm install -g envsync
envsync setup
envsync start
```

**These commands are not yet a verified public installation path.**

## Personal vs. Business

| | Personal | Business |
| --- | --- | --- |
| Projects, environments, encrypted secrets | ✅ | ✅ |
| Application keys and SDK access | ✅ | ✅ |
| Approved agents, expiry, revocation, audit | ✅ | ✅ |
| Local user administration | — | ✅ |
| Explicit team resource sharing | — | ✅ |
| Administrator-controlled SDK access | — | ✅ |
| Agent governance | Owner-managed | Admin-managed |

Personal mode rejects team administration and resource-sharing operations at the backend, not just in the navigation. Existing deployments migrate to Business without changing users or volumes; there is no automatic profile conversion.

## Application SDKs

EnvSync includes SDK source for **Node.js** (`sdk/node`, package `@envsync/node`) and **Python** (`sdk/python`, package `envsync`). Publication to public package registries is a separate release step.

### Node.js example

```javascript
import { EnvSync } from "@envsync/node";

const envsync = new EnvSync({
  apiKey: process.env.ENVSYNC_API_KEY,
  baseUrl: process.env.ENVSYNC_URL,
});

const databaseUrl = await envsync.get("DATABASE_URL");
```

Application keys are hashed in storage, revealed once, and scoped by project with an optional environment restriction. Non-admin application keys begin with pull access disabled until an administrator enables it.

## AI agents and MCP

AI agents should receive **only the access required for a specific task**, not unrestricted access to a vault.

| Example environment | Example agent access |
| --- | --- |
| Development | Read + write |
| Testing | Read |
| Staging | Denied |
| Production | Denied |

The agent workflow supports administrator approval, per-environment grants, expiration times, and revocation. Requests are checked server-side for identity, approval, environment, permission, and expiry. The example above is illustrative, not a default policy.

EnvSync's MCP adapter uses **local STDIO**, not a hosted HTTP MCP endpoint:

```bash
envsync mcp serve
```

Clients must provide `ENVSYNC_AGENT_CREDENTIAL` securely. MCP can be disabled at setup; no delete tool is exposed.

> [!WARNING]
> MCP functionality is still undergoing interoperability testing and production hardening. Protocol tests do not establish compatibility with every Claude, Codex, or Cursor client. See the [MCP guide](docs/MCP_AGENTS.md).

## Security and operational boundaries

- Secret values are encrypted at rest with **AES-256-GCM**. The master key must be kept separately from the database and backed up securely.
- Passwords use **bcrypt**; refresh tokens and API keys are stored as digests. Active access tokens are bearer credentials.
- Ownership and explicit sharing determine human resource access; global permissions alone do not expose every project.
- **TLS is required for production**. The default local installation is loopback-only; remote access requires a reviewed reverse-proxy and public-URL configuration.
- Administrators and host/Docker operators are trusted. Self-hosting does not automatically make a deployment secure.
- Environment cloning copies **secret attachments**, not independent secret values. A secret shared between environments remains one underlying value.

> [!CAUTION]
> EnvSync has not been declared production-ready or independently security-audited. Review [SECURITY.md](SECURITY.md), [backup and recovery](docs/BACKUP_RECOVERY.md), and the [1.0 release report](docs/ENVSYNC_1.0_RELEASE_REPORT.md) before using sensitive production credentials.

## Everyday CLI commands

```bash
envsync start
envsync status
envsync doctor
envsync logs
envsync stop
envsync restart
envsync backup --output /your/secure/location/envsync.dump
envsync --help
```

Stop and restart preserve persistent volumes. Setup refuses to overwrite an existing owner/configuration. Interrupted first-time setup can use `envsync setup --resume`. Updates are not configured until a published update source exists.

The CLI-managed instance is separate from a legacy root Docker Compose deployment; it does not automatically adopt that deployment's `envsync-data-v2` volume.

## Technology

| Layer | Stack |
| --- | --- |
| Web console | React |
| API | Node.js |
| Data store | PostgreSQL |
| Deployment | Docker / Docker Compose |
| SDKs | Node.js and Python |
| Agent integration | MCP via STDIO |
| Encryption at rest | AES-256-GCM |

## Development and verification

From the repository root:

```bash
npm ci
npm run check
npm --prefix cli test
node scripts/scan-secrets.js
node scripts/release-integration.js
```

Integration testing requires locally built release-test images, creates isolated instances on ports `18880–18891`, and retains test volumes and owner-only configuration for investigation. It does not touch the live application.

## Documentation

| Guide | Purpose |
| --- | --- |
| [Security policy](SECURITY.md) | Security model, trust boundaries, and reporting |
| [Backup and recovery](docs/BACKUP_RECOVERY.md) | Data and master-key recovery considerations |
| [MCP agents](docs/MCP_AGENTS.md) | Agent setup, permissions, and authorization |
| [1.0 release report](docs/ENVSYNC_1.0_RELEASE_REPORT.md) | Release readiness, limitations, and validation |

## Project status

**EnvSync 1.0.0 — Release Candidate**

The core console, API, encrypted secret management, scoped keys, SDK source, CLI setup, and agent access workflow are implemented. Current priorities are package and container publication, security hardening, real-client MCP interoperability, and release/recovery validation.

Feedback and contributions are welcome. For security issues, please report privately as described in [SECURITY.md](SECURITY.md), without including real secrets or database dumps.

---

<div align="center">

### Secrets should go where they're needed. Not everywhere.

**EnvSync** · Built for developers who want control over their infrastructure.

[Explore EnvSync](https://envsync.me) · [View Source](https://github.com/VarunHarinath/EnvSync) · [Report an Issue](https://github.com/VarunHarinath/EnvSync/issues)

**Have feedback, an idea, or a collaboration proposal?**

[**varunharinath@envsync.me**](mailto:varunharinath@envsync.me)

</div>
