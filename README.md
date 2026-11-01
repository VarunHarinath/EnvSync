<div align="center">
<img src="Client/public/envsync-mark.svg" width="80" height="80" alt="EnvSync Logo" />

EnvSync

Your infrastructure. Your secrets. Your control.

A self-hosted secrets management platform for developers, applications, and AI agents.

Manage environment variables, control access, and securely deliver secrets across your development workflow.

Website · Documentation · Report an Issue · GitHub

</div>

⸻

The Problem

.env files work.

Until your project grows.

Secrets get copied across local machines, servers, deployment pipelines, and development environments.

Eventually, keeping track of who has access to what becomes more complicated than it should be.

EnvSync replaces scattered configuration files with centralized, controlled access to secrets.

One platform. Multiple environments. Explicit permissions.

⸻

What You Can Do With EnvSync

Capability	Description
🔐 Secrets Management	Store and manage encrypted application secrets.
🌍 Multiple Environments	Organize configuration across Development, Testing, Staging, and Production.
👥 Access Control	Manage ownership, permissions, and resource sharing.
🔑 Scoped API Keys	Give applications access only to approved projects and environments.
📦 Developer SDKs	Integrate secrets into Node.js and Python applications.
🤖 AI Agent Access	Manage approved agent access with environment-specific permissions and expiration.
🐳 Self-Hosted Deployment	Run EnvSync on infrastructure you control using Docker.
📋 Audit History	Maintain records of supported security-relevant operations.

⸻

Built for Developers, Applications, and AI Agents

EnvSync brings three types of consumers into one secrets-management platform.

                 ┌──────────────────┐
                 │      EnvSync     │
                 │  Secrets Manager │
                 └────────┬─────────┘
                          │
             ┌────────────┼────────────┐
             │            │            │
        Developers    Applications   AI Agents
             │            │            │
             └────────────┼────────────┘
                          │
                   Access Control
                          │
              ┌───────────┴───────────┐
              │                       │
          Projects               Environments
                                      │
                          ┌───────────┼───────────┐
                          │           │           │
                         DEV         TEST        PROD

The principle is simple:

Give every identity access to what it needs, not everything available.

⸻

Getting Started

Requirements

* Node.js 20+
* Docker with Compose v2
* A supported local environment

Installation Status

[!IMPORTANT]
EnvSync 1.0.0 is currently a release candidate.

The CLI package has not been publicly published or declared production-ready.

The commands below describe the intended installation experience after publication.

npm install -g envsync
envsync setup
envsync start

Try the Current Release Candidate

Clone the repository:

git clone https://github.com/VarunHarinath/EnvSync.git
cd EnvSync

Build the application images:

docker build -t envsync-release-api:1.0.0 WebService
docker build -t envsync-release-web:1.0.0 Client

Package and install the CLI:

cd cli
npm pack
npm install -g ./envsync-1.0.0.tgz

Run the setup:

envsync setup \
  --api-image envsync-release-api:1.0.0 \
  --web-image envsync-release-web:1.0.0

Choose your deployment profile and create your owner account.

Once started, open:

http://localhost:8088

The installed instance is accessible through the local loopback interface by default.

⸻

Choose Your Deployment Profile

EnvSync supports two deployment profiles.

Personal

For individual developers managing their own applications and infrastructure.

Includes:

* Project and environment management
* Encrypted secrets
* Scoped application keys
* Node.js and Python SDKs
* Agent access and approvals
* Expiration and revocation
* Audit history

Business

For teams that need shared access and administration.

Includes everything in Personal, plus:

* Local user administration
* Resource sharing
* Read/write permission ceilings
* Administrator-controlled SDK access
* Agent governance

Both profiles run on infrastructure you control.

Team administration and resource-sharing operations are unavailable in Personal mode, including at the backend level.

⸻

Integrate EnvSync Into Your Applications

EnvSync provides separate SDKs for Node.js and Python.

Node.js

Package source: sdk/node

import { EnvSync } from "@envsync/node";
const envsync = new EnvSync({
  apiKey: process.env.ENVSYNC_API_KEY,
  baseUrl: process.env.ENVSYNC_URL
});
const databaseUrl = await envsync.get("DATABASE_URL");

Python

Package source: sdk/python

The Python SDK provides corresponding secret-retrieval functionality with type hints.

[!NOTE]
SDK source code is included in this repository. Public package publication is managed separately.

Applications retrieve secrets using scoped credentials. The SDK packages are not bundled with the EnvSync installer.

⸻

AI Agents, With Boundaries

AI agents are becoming part of modern development workflows.

But connecting an agent to your infrastructure shouldn’t automatically grant access to every secret.

EnvSync introduces an approval-based access model for AI agents.

Environment	Example Permission
Development	Read + Write
Testing	Read
Staging	Denied
Production	Denied

Agent access supports:

* Human approval
* Environment-specific permissions
* Read and read/write grants
* Time-limited access
* Credential and grant revocation
* Server-side authorization checks

MCP Integration

EnvSync supports a local MCP STDIO bridge.

envsync mcp serve

Clients must securely provide ENVSYNC_AGENT_CREDENTIAL.

MCP can be disabled during setup.

[!WARNING]
MCP interoperability with specific external clients has not yet been fully validated.

Protocol tests do not establish compatibility with every AI coding assistant. Review the MCP documentation before use.

⸻

Security by Design

EnvSync implements several security controls:

Encryption

AES-256-GCM encryption protects stored secret values.

Authentication

Passwords are hashed using bcrypt. Sessions use signed access tokens and rotating, hashed refresh tokens.

Authorization

Ownership, resource sharing, and scoped application credentials determine access.

Credential Management

Application keys are stored hashed, revealed once, and can be revoked.

Agent Permissions

Agent operations are checked against approval status, environment assignments, permission levels, and expiration.

Audit History

Supported security-relevant operations are recorded for review.

[!CAUTION]
Self-hosting does not automatically guarantee secure operation.

Operators remain responsible for TLS, network configuration, backups, master-key protection, and infrastructure security.

EnvSync 1.0.0 has not been declared production-ready or independently security-audited.

Read the Security Documentation before deploying.

⸻

CLI Reference

Common operations:

envsync start
envsync stop
envsync restart
envsync status
envsync doctor
envsync logs

Create a database backup:

envsync backup --output /your/secure/location/envsync.dump

View available commands:

envsync --help

Persistent volumes are preserved during normal stop and restart operations.

⸻

Architecture

EnvSync uses a containerized architecture.

                 Developer / Application
                           │
                           ▼
                    EnvSync Console
                           │
                           ▼
                      Node.js API
                           │
                  ┌────────┴────────┐
                  │                 │
             PostgreSQL       Authorization
                  │                 │
             Encrypted         Scoped Access
              Secrets          & Agent Policy

Technology Stack

Layer	Technology
Frontend	React
Backend	Node.js
Database	PostgreSQL
Containerization	Docker / Docker Compose
SDKs	Node.js, Python
Agent Integration	MCP (STDIO)
Secret Encryption	AES-256-GCM

The default CLI-managed deployment binds to loopback only.

Remote access and TLS require additional reviewed configuration.

⸻

Development

Install dependencies:

npm ci

Run verification:

npm run check
npm --prefix cli test
node scripts/scan-secrets.js
node scripts/release-integration.js

Integration testing requires locally built release-test images.

Tests create isolated instances and retain their test volumes for investigation.

They do not modify the live application.

⸻

Documentation

Document	Purpose
Security	Security controls and considerations
Backup & Recovery	Backup and recovery procedures
MCP Agents	Agent configuration and authorization
1.0 Release Report	Release readiness and known limitations

⸻

Project Status

EnvSync 1.0.0 Release Candidate

The core platform, deployment tooling, SDK source code, and agent authorization components have been implemented.

Current priorities include:

* Controlled package publication
* Container artifact publication
* Security hardening
* External MCP client interoperability testing
* Installation and recovery validation
* Production-readiness assessment

For deployment decisions, consult the 1.0 Release Report.

⸻

Feedback & Collaboration

EnvSync is being developed with a focus on practical developer experience, secure access, and infrastructure ownership.

Feedback, technical discussions, and contributions are welcome.

Website: https://envsync.me

GitHub: https://github.com/VarunHarinath/EnvSync

Email: varunharinath@envsync.me

⸻

<div align="center">

Secrets should go where they’re needed. Not everywhere.

EnvSync

Built for developers who want control over their infrastructure.

Explore EnvSync · View Source

</div>
