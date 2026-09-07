# Tasks

## 1. Spec and handler

- [x] 1.1 OpenSpec proposal, design, and mcp-gateway spec deltas
- [x] 1.2 `handleWebRequest` (stateless JSON Streamable HTTP)
- [x] 1.3 `GET /health` and `GET /healthz` unauthenticated 200
- [x] 1.4 Bearer fail-closed on `/mcp` using existing principal resolution

## 2. Vercel Fluid Compute

- [x] 2.1 Root `vercel.json` rewrites `/mcp` `/health` `/healthz` → `/api`, `fluid: true`
- [x] 2.2 `api/index.mjs` Fluid `fetch` handler (no hardcoded hostname)
- [x] 2.3 Node `:7474` listener delegates health + `/mcp` to the same handler

## 3. Proof and docs

- [x] 3.1 Tests: health, 401, initialize / tools/list / tools/call, no `Mcp-Session-Id`
- [x] 3.2 README “Glama remote connector” + env + Vercel Root Directory notes
- [x] 3.3 Local smoke script / documented curl
