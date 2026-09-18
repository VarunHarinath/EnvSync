# MCP agents and AI clients

EnvSync V2 gives AI clients a separate identity and authorization boundary. An agent credential is not a user session or a V1 application key. It starts in `PENDING`, stores only a SHA-256 digest in PostgreSQL, and has no environment access until an administrator approves it.

## Security model

- Default deny: unknown, pending, rejected, revoked, or expired agents cannot read secrets.
- Explicit scope: every grant names one environment and `READ` or `READ_WRITE`.
- Time bounds: the agent and each assignment may have independent absolute expiry timestamps.
- Immediate revocation: revoking an agent disables its credentials and assignments in one transaction. Every request checks PostgreSQL; there is no authorization cache.
- Shared policy: MCP tools and the Node/Python SDK agent mode call the same REST endpoints and centralized policy service.
- No destructive agent operation: V2 has no MCP or agent API delete-secret endpoint.
- Auditing: enrollment, reads, writes, access requests, approvals, assignment changes, and revocations record actor/resource metadata without plaintext values.
- Human control: only administrators may approve, assign, or revoke. A delegated `mcp_read` user may inspect agent state but cannot grant access.

Treat the one-time `ea_live_` value like any production credential. Do not commit it, paste it into issue trackers, or place it in MCP configuration files that are checked into source control.

## 1. Enroll an agent

Generate a UUID once in your client and reuse it only for that enrollment attempt:

```bash
curl -X POST http://localhost:8080/api/v1/agents/enroll \
  -H 'Content-Type: application/json' \
  --data '{
    "enrollmentId": "00000000-0000-4000-8000-000000000001",
    "clientName": "Local coding assistant",
    "clientVersion": "1.0",
    "transport": "STDIO",
    "machineLabel": "developer workstation"
  }'
```

Use your configured `PUBLIC_URL` instead of `http://localhost:8080` when different. The response shows the `ea_live_` credential once. Save it in the AI client's private environment/credential store. Repeating the same enrollment ID returns a conflict rather than minting another credential.

## 2. Approve it

In the web console, open **MCP Agents**. Select the pending agent, verify its client and machine details, choose an environment, choose **Read** or **Read + write**, select a TTL, and approve it. Additional assignments can be added or revoked in the agent drawer. The environment drawer also lists agents with access.

## 3. Run the MCP STDIO server through Docker

The MCP client launches this command from the repository root:

```bash
ENVSYNC_AGENT_CREDENTIAL='your-one-time-agent-credential' \
docker compose exec -T \
  -e ENVSYNC_AGENT_CREDENTIAL \
  -e ENVSYNC_URL=http://127.0.0.1:8080 \
  api npm run mcp
```

A typical MCP client configuration is:

```json
{
  "mcpServers": {
    "envsync": {
      "command": "docker",
      "args": [
        "compose", "exec", "-T",
        "-e", "ENVSYNC_AGENT_CREDENTIAL",
        "-e", "ENVSYNC_URL=http://127.0.0.1:8080",
        "api", "npm", "run", "mcp"
      ],
      "env": {
        "ENVSYNC_AGENT_CREDENTIAL": "your-one-time-agent-credential"
      }
    }
  }
}
```

Run the client with the EnvSync repository as its working directory, or add Docker Compose's `--project-directory` argument. STDIO protocol messages use stdout; diagnostics use stderr.

## Tools

| Tool | Required access | Purpose |
| --- | --- | --- |
| `envsync_whoami` | Valid credential | Agent state and active assignments |
| `envsync_list_environments` | Approved agent | Authorized environments only |
| `envsync_list_secrets` | `READ` | Names and metadata, never values |
| `envsync_get_secret` | `READ` | One value |
| `envsync_get_secrets` | `READ` | Selected values |
| `envsync_create_secret` | `READ_WRITE` | Create and attach a secret |
| `envsync_update_secret` | `READ_WRITE` | Update an attached secret |
| `envsync_request_access` | Approved agent | Create a human-reviewed temporary-access request |

## Postman / REST testing

Set a Postman environment variable named `base_url` to your public EnvSync URL and `agent_credential` to the one-time credential. Add `Authorization: Bearer {{agent_credential}}`.

- `GET {{base_url}}/api/v1/agent/self`
- `GET {{base_url}}/api/v1/agent/environments`
- `GET {{base_url}}/api/v1/agent/environments/:environmentId/secrets`
- `GET {{base_url}}/api/v1/agent/environments/:environmentId/secrets/:name`
- `POST {{base_url}}/api/v1/agent/environments/:environmentId/secrets` with `{ "name": "EXAMPLE_NAME", "value": "non-secret-example" }`
- `PATCH {{base_url}}/api/v1/agent/environments/:environmentId/secrets/:name` with `{ "value": "updated-non-secret-example" }`
- `POST {{base_url}}/api/v1/agent/access-requests` with `{ "environmentId": "...", "accessLevel": "READ", "durationMinutes": 60, "reason": "Local development task" }`

Expected status codes are `401` for an invalid/revoked credential, `403` for a valid agent without sufficient authorization, and `404` for a missing secret inside an authorized environment.

## SDK agent mode

Node.js:

```js
const envsync = new EnvSync({
  apiKey: process.env.ENVSYNC_AGENT_CREDENTIAL,
  baseUrl: process.env.ENVSYNC_URL,
  environmentId: process.env.ENVSYNC_ENVIRONMENT_ID,
});
```

Python uses the equivalent `environment_id=` argument. Existing `es_live_` application-key behavior remains unchanged.

## Troubleshooting

- **Pending agent / 403:** an administrator has not approved the requested environment.
- **Read works, write fails / 403:** the assignment is `READ`; request `READ_WRITE` and wait for approval.
- **401 after working previously:** the agent, credential, or assignment was revoked or expired. Inspect MCP Agents in the console; do not bypass the decision by minting repeated enrollments.
- **Docker command cannot find the project:** run it from the cloned repository or pass `docker compose --project-directory /absolute/path/to/EnvSync`.
- **No protocol connection:** keep stdout reserved for MCP. Check container logs and the client's captured stderr.
- **API health:** run `docker compose ps`, then `docker compose logs api`. `/ready` also confirms database connectivity.
