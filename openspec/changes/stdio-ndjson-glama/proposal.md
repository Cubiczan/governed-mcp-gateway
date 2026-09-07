# Change: Stdio NDJSON stdout for Glama mcp-proxy

## Why

Glama Build & Release for Cubiczan/governed-mcp-gateway fails against `mcp-proxy@6.4.3`. The proxy expects newline-delimited JSON on the child stdout. The gateway wrote MCP Content-Length framing instead.

Exact failure:

```
[mcp-proxy] ignoring non-JSON output [ 'Content-Length: 808\r' ]
... Request timed out ...
transport event { chunk: '{"jsonrpc":"2.0","id":0,"result":{...}}', type: 'data' }
```

The server answers `initialize` correctly, but too late / with the wrong framing: mcp-proxy discarded the header line and never parsed the body in time.

## What Changes

- `writeMcpMessage` emits `JSON.stringify(message) + "\n"` (NDJSON). No Content-Length headers on stdout.
- `tryReadMcpMessage` still accepts both Content-Length and newline JSON on stdin.
- Docs note that Glama mcp-proxy uses NDJSON stdout; Content-Length is legacy input only.

## Capabilities

- `mcp-gateway`: stdio transport framing for directory introspection.

## Impact

- `packages/governed-mcp-gateway/src/stdio.ts` and its unit tests.
- `docs/glama-release.md` (and the gateway README stdio line).
- Non-goals: compiled Docker CMD (monorepo still runs via `tsx`), icohangar-ops repos, live Stripe/x402, Glama UI actions (Sam re-runs Build & Release after merge).
