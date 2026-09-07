# mcp-gateway Specification

## ADDED Requirements

### Requirement: Stateless Streamable HTTP for remote connectors
The gateway SHALL expose a Web-standard `handleWebRequest` that answers Streamable HTTP JSON-RPC `initialize`, `tools/list`, and `tools/call` as request/response JSON. It SHALL NOT mint or require `Mcp-Session-Id`. `GET` and `DELETE` on the MCP path SHALL NOT open a session SSE stream.

#### Scenario: Authenticated initialize is stateless JSON
- GIVEN a valid Bearer principal
- WHEN the client `POST`s JSON-RPC `initialize` to `/mcp`
- THEN the response is HTTP 200 with `application/json`
- AND the response does not include an `Mcp-Session-Id` header

#### Scenario: GET /mcp does not start SSE
- GIVEN a valid Bearer principal
- WHEN the client sends `GET /mcp`
- THEN the response is HTTP 405

### Requirement: Bearer principal is required on /mcp
`POST /mcp` SHALL resolve `Authorization: Bearer` with the existing principal map. Missing or unknown credentials SHALL return HTTP 401 and SHALL NOT run a tool.

#### Scenario: Missing Bearer on initialize
- GIVEN no Authorization header
- WHEN the client sends JSON-RPC `initialize`
- THEN the gateway returns HTTP 401
- AND `WWW-Authenticate` starts with `Bearer`

### Requirement: Liveness does not require auth
`GET /health` and `GET /healthz` SHALL return HTTP 200 when the process is up, without Authorization. The body SHALL include `ok: true` and SHALL NOT include secrets or API keys.

#### Scenario: Health probe
- GIVEN the process is running
- WHEN a client calls `GET /health` with no Authorization
- THEN the response is HTTP 200
- AND the JSON body has `ok` true

### Requirement: Vercel Fluid Compute entry is importable
The repository root SHALL include `vercel.json` that enables Fluid Compute and rewrites `/mcp`, `/health`, and `/healthz` to `/api`, plus an `api/` fetch handler that calls `handleWebRequest`. The repository SHALL NOT hardcode a Vercel hostname.

#### Scenario: Rewrites target the Fluid handler
- GIVEN the repository root
- WHEN a client reads `vercel.json`
- THEN `fluid` is true
- AND `/mcp` and `/health` rewrite to `/api`
