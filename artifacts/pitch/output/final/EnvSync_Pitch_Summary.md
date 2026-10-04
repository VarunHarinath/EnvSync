# EnvSync

**Environment variables, without the .env chaos.**

## One-line pitch
EnvSync is an open-source, self-hosted secrets platform for people, applications, and AI agents, organized around projects, environments, and explicit access.

## Problem
Configuration starts in a `.env` file, then spreads across laptops, servers, CI, and agent context. Copies drift, access becomes implicit, and revocation becomes difficult.

## Solution
Manage secrets centrally and attach them to Development, Testing, Staging, and Production. Let identities request what they need instead of distributing the whole vault. Secret records may be shared across environments; cloning copies attachments, not independent values.

## Humans
Local accounts, administrator controls, project and environment management, resource sharing, encrypted secrets, and audit history are implemented. Human access combines global permissions with resource sharing.

## Applications
Node.js (`@envsync/node`) and Python (`envsync`) clients retrieve named secrets from a configured EnvSync deployment. Application API keys can be scoped to a project or environment, with explicit secret-pull permission, expiration, and revocation. Credentials are not embedded in examples.

## AI Agents — Preview
The repository implements a local stdio MCP adapter, enrollment and administrator approval, independent environment grants, Read or Read + Write permissions, expiration, revocation, and activity auditing. A connection is not authorization: the backend checks credentials, approval, assignment, permissions, and expiry. Delete operations are not exposed to agents. Real-client compatibility and production security validation remain priorities.

## Self-hosted
After cloning, `npm run setup` guides deployment of the Dockerized frontend, Node API, and PostgreSQL. The launcher requires Node.js 20+ and Docker. There is no mandatory external secrets SaaS. Operators remain responsible for secure deployment, TLS, backups, and encryption-key handling.

## Current status
Substantial implementation exists across identity, secrets, access, SDKs, the web console, agent workflows, auditing, and Docker setup. AES-256-GCM encrypts stored secret values. This is not a claim of independent audit, certification, or production readiness.

## Current priorities
Validate real MCP clients and security boundaries; verify deployment and release workflows; improve developer experience and compatibility. SMTP invitations are future work. Already retrieved secret values cannot be retracted by revoking access.

## Vision
**Secrets should go where they’re needed. Not everywhere.** One access platform for humans, applications, and agents—on infrastructure you control.

[Website](https://envsync.me) · [Repository and documentation](https://github.com/VarunHarinath/EnvSync)

*Based on repository review on 22 September 2026. Proposed priorities are not delivery commitments. No traction, customer, certification, or fundraising claims are made.*
