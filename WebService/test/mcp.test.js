import test from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import { once } from "node:events";
import { Client } from "@modelcontextprotocol/client";
import { StdioClientTransport } from "@modelcontextprotocol/client/stdio";

test("MCP stdio server negotiates, lists safe tools, and calls the EnvSync API", async (t) => {
  const api = http.createServer((req, res) => {
    res.setHeader("content-type", "application/json");
    if (req.headers.authorization !== "Bearer ea_live_example_testing_only") {
      res.writeHead(401).end(JSON.stringify({ error: { message: "Unauthorized" } }));
      return;
    }
    if (req.url === "/api/v1/agent/self") {
      res.end(JSON.stringify({ success: true, data: { id: "agent", status: "APPROVED", environments: [] } }));
      return;
    }
    res.writeHead(403).end(JSON.stringify({ error: { message: "Not authorized" } }));
  });
  api.listen(0, "127.0.0.1");
  await once(api, "listening");
  t.after(() => api.close());

  const address = api.address();
  const transport = new StdioClientTransport({
    command: process.execPath,
    args: [new URL("../mcp/server.js", import.meta.url).pathname],
    env: { ...process.env, ENVSYNC_URL: `http://127.0.0.1:${address.port}`, ENVSYNC_AGENT_CREDENTIAL: "ea_live_example_testing_only" },
    stderr: "pipe",
  });
  const client = new Client({ name: "envsync-test", version: "1.0.0" });
  await client.connect(transport);

  const { tools } = await client.listTools();
  const names = tools.map((tool) => tool.name);
  assert.ok(names.includes("envsync_whoami"));
  assert.ok(names.includes("envsync_list_projects"));
  assert.ok(names.includes("envsync_get_secret"));
  assert.ok(names.includes("envsync_update_secret"));
  assert.equal(names.some((name) => name.includes("delete")), false);

  const response = await client.callTool({ name: "envsync_whoami", arguments: {} });
  assert.equal(response.isError, undefined);
  assert.equal(response.structuredContent.status, "APPROVED");
  const denied = await client.callTool({ name: "envsync_list_secrets", arguments: { environmentId: "00000000-0000-4000-8000-000000000002" } });
  assert.equal(denied.isError, true);
  assert.match(denied.content[0].text, /Not authorized/);
  await assert.rejects(() => client.callTool({ name: "envsync_missing_tool", arguments: {} }));
  await client.close();

  const reconnectTransport = new StdioClientTransport({
    command: process.execPath,
    args: [new URL("../mcp/server.js", import.meta.url).pathname],
    env: { ...process.env, ENVSYNC_URL: `http://127.0.0.1:${address.port}`, ENVSYNC_AGENT_CREDENTIAL: "ea_live_example_testing_only" },
    stderr: "pipe",
  });
  const reconnectClient = new Client({ name: "envsync-reconnect-test", version: "1.0.0" });
  await reconnectClient.connect(reconnectTransport);
  assert.ok((await reconnectClient.listTools()).tools.length > 0);
  await reconnectClient.close();
});
