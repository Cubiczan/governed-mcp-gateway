# Design: Stdio NDJSON for Glama

## Context

Glama wraps the Dockerfile CMD with `mcp-proxy --`. `mcp-proxy@6.4.3` splits child stdout on newlines and `JSON.parse`s each line. A `Content-Length:` header is treated as non-JSON noise; the following body may arrive after the initialize timeout.

The official MCP stdio spec historically used Content-Length (LSP-style). Glama's proxy does not.

## Decisions

1. **Stdout is NDJSON only.** `writeMcpMessage` writes one JSON object plus a newline. No headers.
2. **Stdin stays dual-format.** `tryReadMcpMessage` already accepts Content-Length then newline JSON. Keep that so older clients still work.
3. **Do not compile a `dist/` entry in this change.** Cubiczan/chp-mcp uses `CMD ["node", "dist/index.js"]` because it is a single-package `tsc` project. This workspace is a tsx monorepo with `.ts` imports and no emit pipeline; switching CMD is a separate risk. Framing is the required fix.

## Risks

- A client that *only* reads Content-Length on stdout will break. Glama is the listing path; HTTP `:7474` is unchanged.
- Maintainers must re-run Glama Build & Release after merge (UI, not this PR).
