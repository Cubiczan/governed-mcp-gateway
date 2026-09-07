# Change: Public Streamable HTTP remote for Glama connectors

## Why

Glama remote connectors health-check an HTTPS Streamable HTTP endpoint at `https://$VERCEL_URL/mcp` with Bearer auth. This workspace already speaks JSON-RPC over `POST /mcp` on `:7474`, but there is no Vercel Fluid Compute entry, no Web `Request`/`Response` handler, and no documented remote-connector deploy. Stdio remains the Glama Docker/CMD path; this change is the hosted HTTPS path.

## What Changes

- Add a **stateless** Streamable HTTP Web handler (`Request` → `Response`) for `initialize`, `tools/list`, and `tools/call`.
- Add a Vercel Fluid Compute entry (`vercel.json` rewrites + `api/index.mjs` `fetch` handler) following the Cubiczan CodeSentinel shape — not the CodeSentinel brand.
- Keep Bearer principal resolution fail-closed on `/mcp`. `GET /health` and `GET /healthz` stay unauthenticated liveness probes.
- Do **not** mint `Mcp-Session-Id` or require sticky sessions. The multi-replica session-store branch stays optional and unused here.
- Document env vars and local curl smoke. Never hardcode a Vercel hostname.

## Capabilities

- `mcp-gateway`: stateless Streamable HTTP + Vercel Fluid Compute remote for Glama connectors.

## Impact

- New `handleWebRequest` on the gateway; thin `api/` + `vercel.json` at the repo root.
- Existing Node `:7474` control plane (`/mcp/sse`, vault, context inspector) stays.
- Non-goals: live Stripe/x402, sticky/shared session stores, inventing a public hostname, changing spend-plane or CFO mesh.
