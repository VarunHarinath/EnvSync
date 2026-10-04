# EnvSync CLI — 1.0.0 release candidate

A small installer/operator CLI. No server, SDK, database or frontend dependencies are installed into the npm package.

**PREPARED — REGISTRY RELEASE NOT VERIFIED.** The intended package name is `envsync`; publication and ownership must be verified by the release operator. Runtime image references have not been published. Until then, supply tested images with `--api-image` and `--web-image`.

```sh
envsync setup --api-image REGISTRY/API@sha256:DIGEST --web-image REGISTRY/WEB@sha256:DIGEST
envsync start
envsync doctor
envsync stop
```

Requires Node 20+, Docker Engine/Desktop and Compose v2 with `up --wait`. Setup creates a Personal owner or Business administrator. Personal has no user administration or resource sharing. The console binds **127.0.0.1:8088**, not the public network. Ports 1024–65535 are supported.

Configuration is in `~/.envsync` (`ENVSYNC_HOME` overrides it). `instance.json` contains non-secret settings; `runtime.env` contains encryption, session and database keys. Unix permissions are 700/600; Windows ACLs require operator review. Never lose the master key. Never publish either file.

For automation, `setup --config FILE` reads JSON with `profile`, `instanceName`, `fullName`, `email`, `password`, `port`, `mcpEnabled`, `apiImage`, `webImage` and optional `organizationName`. Restrict the file to the owner (0600 on Unix), then remove it from your secure storage when no longer needed. The CLI does not put the password in argv or its persistent configuration. Interactive passwords are hidden.

Interrupted first setup can resume with `setup --resume`. An existing owner is never overwritten; if bootstrap completed, use `start`. Stop/restart never delete volumes. `update` currently fails safely because no published update channel exists.

## MCP

Transport is **STDIO**, launched on demand by the AI client. It is not an HTTP server. Set `ENVSYNC_AGENT_CREDENTIAL` in the AI client's secure environment and configure command `envsync`, arguments `mcp`, `serve`. Approve and scope agents in the console. Never put credentials in arguments. `mcp status` reports configuration, not successful client interoperability.

## Backup

`envsync backup --output PATH` writes a PostgreSQL custom archive without overwriting files. Securely back up `runtime.env` separately: without the matching encryption key, the database cannot decrypt secrets. An interrupted archive must not be used. See the repository recovery guide for restoration and verification. Backups include sensitive account/audit data even though secret values are encrypted.

`logs` is for trusted local operators and shows the last 100 operational lines. `doctor` checks configuration permissions, free disk space, Docker, database/migration state, API and console. A real AI client connection and Windows installation remain separate release checks.
