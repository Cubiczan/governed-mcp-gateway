# Design: Glama Streamable HTTP remote

## Current state (investigated)

`GovernedGateway.createHttpServer()` already handles:

- `POST /mcp` JSON-RPC (`initialize`, `tools/list`, `tools/call`) with Bearer → Principal
- `GET /mcp/sse` (local/control-plane only)
- `GET /health` `{ ok, service }` without auth

There is no Web-standard handler and no Vercel project files. Branch `cursor/streamable-http-multi-replica-7527` adds sticky/shared `Mcp-Session-Id` stores. That is **not** required for Glama: Fluid Compute instances are not a sticky cluster, and CodeSentinel's public remote is stateless JSON.

## Decisions

1. **Stateless JSON Streamable HTTP.** Each `POST /mcp` authenticates, runs JSON-RPC, and returns `application/json`. No `Mcp-Session-Id`. Clients that need a non-default pack pass `params.pack` / `params.need` on the same `tools/list`. `GET`/`DELETE /mcp` return 405 after auth (no long-lived SSE on the Vercel path).

2. **Shared `handleWebRequest`.** One `Request` → `Response` function is the source of truth for `/health`, `/healthz`, and `/mcp`. The Node listener delegates those routes so local `:7474` and Vercel stay aligned. SSE and `/v1/*` stay on the Node listener only.

3. **CodeSentinel deploy shape, Cubiczan brand.** Root `vercel.json` (`framework: null`, `fluid: true`) rewrites `/mcp`, `/health`, `/healthz` → `/api`. `api/index.mjs` exports `{ fetch }` and calls `handleWebRequest`. Comments use `$VERCEL_URL` / `$VERCEL_PROJECT_PRODUCTION_URL` — never a hostname.

4. **Bearer via existing principals.** `seedDemo()` maps `GATEWAY_AGENT_KEY` / `GATEWAY_HUMAN_KEY` / `GATEWAY_RESEARCH_KEY` (demo defaults). Missing or unknown Bearer on `/mcp` is HTTP 401 with `WWW-Authenticate`. Health does not require auth and must not echo secrets.

5. **Vercel + TypeScript workspaces.** The Fluid entry registers `tsx/esm` and imports the gateway TypeScript graph. `includeFiles` bundles `packages/**` so workspace `@cubiczan/shared` resolves at runtime.

## Non-goals

- Sticky ingress, Redis session stores, or minting `Mcp-Session-Id`.
- Replacing Glama's stdio Dockerfile/CMD path.
- Hardcoding or purchasing a production hostname.
