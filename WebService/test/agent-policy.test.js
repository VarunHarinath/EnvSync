import test from "node:test";
import assert from "node:assert/strict";
import { authorizeAgentEnvironment, listAuthorizedEnvironments, requireMcpPermission } from "../Services/agentPolicy.js";

const dbWith = (rows) => ({ query: async () => ({ rows }) });
const grant = (overrides = {}) => ({
  agent_id: "agent", status: "APPROVED", agent_expires_at: null,
  assignment_id: "assignment", access_level: "READ", assignment_expires_at: null,
  environment_id: "environment", project_id: "project", environment_name: "Development",
  ...overrides,
});

test("agent environment policy is default deny", async () => {
  await assert.rejects(() => authorizeAgentEnvironment("unknown", "environment", "READ", dbWith([])), { status: 403 });
  await assert.rejects(() => authorizeAgentEnvironment("agent", "environment", "READ", dbWith([grant({ status: "PENDING" })])), { status: 403 });
  await assert.rejects(() => authorizeAgentEnvironment("agent", "environment", "READ", dbWith([grant({ status: "REVOKED" })])), { status: 403 });
});

test("agent policy enforces access level and both expiry boundaries", async () => {
  assert.equal((await authorizeAgentEnvironment("agent", "environment", "READ", dbWith([grant()]))).access_level, "READ");
  await assert.rejects(() => authorizeAgentEnvironment("agent", "environment", "READ_WRITE", dbWith([grant()])), { status: 403 });
  await assert.rejects(() => authorizeAgentEnvironment("agent", "environment", "READ", dbWith([grant({ agent_expires_at: new Date(0) })])), { status: 403 });
  await assert.rejects(() => authorizeAgentEnvironment("agent", "environment", "READ", dbWith([grant({ assignment_expires_at: new Date(0) })])), { status: 403 });
  assert.equal((await authorizeAgentEnvironment("agent", "environment", "READ_WRITE", dbWith([grant({ access_level: "READ_WRITE" })]))).access_level, "READ_WRITE");
});

test("authorized environment listing delegates expiry filtering to SQL", async () => {
  const rows = [{ id: "environment", access_level: "READ" }];
  assert.deepEqual(await listAuthorizedEnvironments("agent", dbWith(rows)), rows);
});

test("only administrators may mutate agent authorization", async () => {
  const run = (permission, user) => new Promise((resolve) => requireMcpPermission(permission)({ user }, null, resolve));
  assert.equal(await run("mcp_read", { role: "USER", permissions: { mcp_read: true } }), undefined);
  assert.equal((await run("mcp_write", { role: "USER", permissions: { mcp_write: true } })).status, 403);
  assert.equal(await run("mcp_write", { role: "ADMIN", permissions: {} }), undefined);
});
