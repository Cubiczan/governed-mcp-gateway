import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { PassThrough } from "node:stream";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { GovernedGateway } from "../src/gateway.ts";
import { serveStdio, tryReadMcpMessage, writeMcpMessage } from "../src/stdio.ts";

function repoRoot(): string {
  return join(dirname(fileURLToPath(import.meta.url)), "../../..");
}

function readAllFramed(buffer: Buffer): Array<Record<string, unknown>> {
  let rest = buffer;
  const messages: Array<Record<string, unknown>> = [];
  while (true) {
    const parsed = tryReadMcpMessage(rest);
    if (!parsed) break;
    rest = parsed.rest;
    messages.push(parsed.value);
  }
  return messages;
}

test("glama.json matches the claim schema and lists icohangar-ops", () => {
  const raw = readFileSync(join(repoRoot(), "glama.json"), "utf8");
  const json = JSON.parse(raw) as { $schema?: string; maintainers?: string[] };
  assert.equal(json.$schema, "https://glama.ai/mcp/schemas/server.json");
  assert.ok(Array.isArray(json.maintainers));
  assert.ok(json.maintainers?.includes("icohangar-ops"));
  assert.equal(Object.keys(json).sort().join(","), "$schema,maintainers");
});

test("stdio JSON-RPC initialize then tools/list omits the mega fixture", async () => {
  const gateway = new GovernedGateway();
  gateway.seedDemo();
  const principal = gateway.stdioPrincipal();
  assert.equal(principal.id, "agt_payops");

  const init = await gateway.handleJsonRpc(principal, {
    jsonrpc: "2.0",
    id: 1,
    method: "initialize",
    params: {},
  });
  assert.ok(init?.result);
  const info = (init?.result as { serverInfo: { name: string }; instructions: string }).serverInfo;
  assert.equal(info.name, "governed-mcp-gateway");

  const listed = await gateway.handleJsonRpc(principal, {
    jsonrpc: "2.0",
    id: 2,
    method: "tools/list",
  });
  const tools = (listed?.result as { tools: Array<{ name: string; description: string }> }).tools;
  const names = tools.map((t) => t.name).sort();
  assert.deepEqual(names, ["context.inspect", "context.need", "echo.ping"]);
  assert.ok(!names.includes("docs.mega_schema"));
  assert.ok(!names.includes("stripe.charge"));
  for (const tool of tools) {
    assert.ok(tool.description.length > 80, `${tool.name} description too short for Glama TDQS`);
  }
});

test("stdio Content-Length framing round-trips initialize and tools/list", async () => {
  const gateway = new GovernedGateway();
  gateway.seedDemo();
  const stdin = new PassThrough();
  const stdout = new PassThrough();
  const chunks: Buffer[] = [];
  stdout.on("data", (chunk: Buffer) => chunks.push(chunk));
  const running = serveStdio(gateway, stdin, stdout);

  writeMcpMessage(stdin, { jsonrpc: "2.0", id: 1, method: "initialize", params: { protocolVersion: "2025-03-26", capabilities: {}, clientInfo: { name: "test", version: "0" } } });
  writeMcpMessage(stdin, { jsonrpc: "2.0", method: "notifications/initialized" });
  writeMcpMessage(stdin, { jsonrpc: "2.0", id: 2, method: "tools/list" });
  writeMcpMessage(stdin, { jsonrpc: "2.0", id: 3, method: "resources/list" });
  writeMcpMessage(stdin, { jsonrpc: "2.0", id: 4, method: "prompts/list" });
  stdin.end();

  await running;
  const messages = readAllFramed(Buffer.concat(chunks));
  assert.equal(messages.length, 4);
  assert.equal((messages[0]?.result as { serverInfo: { name: string } }).serverInfo.name, "governed-mcp-gateway");
  const tools = (messages[1]?.result as { tools: Array<{ name: string }> }).tools.map((t) => t.name);
  assert.ok(tools.includes("echo.ping"));
  assert.ok(!tools.includes("docs.mega_schema"));
  assert.deepEqual(messages[2]?.result, { resources: [] });
  assert.deepEqual(messages[3]?.result, { prompts: [] });
});
