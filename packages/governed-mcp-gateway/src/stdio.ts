/**
 * Stdio MCP transport for Glama / npx.
 *
 * Writes newline-delimited JSON on stdout (Glama mcp-proxy@6.4.3 and later).
 * Reads both NDJSON and legacy MCP Content-Length framing on stdin.
 * HTTP control-plane remains `src/server.ts` (`npm start` / `npm run gateway`).
 * Process entry is `src/mcp.ts` so this module can be imported by tests.
 * Do not write logs to stdout — stdout is the protocol.
 */
import type { Json } from "@cubiczan/shared";
import { GovernedGateway } from "./gateway.ts";

export function writeMcpMessage(stream: NodeJS.WritableStream, message: unknown): void {
  stream.write(`${JSON.stringify(message)}\n`);
}

export function tryReadMcpMessage(buffer: Buffer): { value: Record<string, Json>; rest: Buffer } | undefined {
  const headerEnd = buffer.indexOf("\r\n\r\n");
  if (headerEnd !== -1) {
    const header = buffer.subarray(0, headerEnd).toString("utf8");
    const match = /Content-Length:\s*(\d+)/i.exec(header);
    if (!match) return undefined;
    const length = Number(match[1]);
    const start = headerEnd + 4;
    if (buffer.length < start + length) return undefined;
    const value = JSON.parse(buffer.subarray(start, start + length).toString("utf8")) as Record<string, Json>;
    return { value, rest: buffer.subarray(start + length) };
  }

  const nl = buffer.indexOf("\n");
  if (nl === -1) return undefined;
  const line = buffer.subarray(0, nl).toString("utf8").trim();
  if (!line.startsWith("{")) return undefined;
  const value = JSON.parse(line) as Record<string, Json>;
  return { value, rest: buffer.subarray(nl + 1) };
}

export function seededGateway(): GovernedGateway {
  const gateway = new GovernedGateway({
    spendPlaneUrl: process.env.SPEND_PLANE_URL,
  });
  gateway.seedDemo();
  return gateway;
}

export async function serveStdio(
  gateway = seededGateway(),
  stdin: NodeJS.ReadableStream = process.stdin,
  stdout: NodeJS.WritableStream = process.stdout,
): Promise<void> {
  const principal = gateway.stdioPrincipal();
  let buffer = Buffer.alloc(0);

  if (stdin === process.stdin) {
    const shutdown = (): void => {
      process.exit(0);
    };
    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
    stdin.on("end", shutdown);
  }

  for await (const chunk of stdin) {
    buffer = Buffer.concat([buffer, chunk as Buffer]);
    while (true) {
      const parsed = tryReadMcpMessage(buffer);
      if (!parsed) break;
      buffer = parsed.rest;
      const response = await gateway.handleJsonRpc(principal, parsed.value);
      if (response) writeMcpMessage(stdout, response);
    }
  }
}
