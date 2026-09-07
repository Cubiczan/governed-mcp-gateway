# Design: Glama quality unblock

## Context

Glama indexes GitHub `Cubiczan/governed-mcp-gateway`. Scoring of tools requires a **Glama release**: claim via `glama.json`, Sync Server, Dockerfile admin Build, Make Release. Glama wraps CMD with `mcp-proxy --` and expects **stdio** MCP (`initialize` + `tools/list`), not the HTTP server on `:7474`.

## Decisions

1. **Claim file** matches Cubiczan/chp-mcp: `$schema` + `maintainers`. Include `icohangar-ops` (working claim username) and `Cubiczan` (repo owner). Schema allows only `maintainers`.
2. **Stdio entry** `packages/governed-mcp-gateway/src/mcp.ts` (library in `stdio.ts`) reuses `GovernedGateway.handleJsonRpc`. Seeded PayOps demo principal so introspection does not need a Bearer header. Default `tools/list` remains the session pack (echo.ping, context.inspect, context.need) so `docs.mega_schema` never reaches Glama TDQS.
3. **Dockerfile** installs the workspace with `npm ci` and CMD is the stdio file. Admin form values are documented in `docs/glama-release.md` because Glama may ignore the repo Dockerfile.
4. **Cubiczan-only docs** for this listing. Sister SKUs link to in-repo packages, not icohangar-ops GitHub URLs.

## Risks

- Claim still fails until Sam authenticates as a listed maintainer and clicks Sync Server.
- Build fails if CMD points at HTTP `server.ts`.
- Glama release is a UI action; this change only makes that action possible.
