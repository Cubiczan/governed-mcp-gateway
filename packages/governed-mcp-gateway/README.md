# Governed MCP Gateway

Port **7474**. Principal on every `tools/call` and every SSE frame.

Production MCP is stuck on auth. `SecurityContextHolder` / ThreadLocal dies when the tool runs on an SSE worker. VS Code secrets are keyed by `inputs[].id`, so rotating a token by renaming the input leaves the old secret alive. This SKU is a **control plane**, not a server catalog.

![Platform: gateway sits in front of spend and CFO mesh](docs/screenshots/architecture.png)

It:

- Resolves a Bearer credential to a **Principal**
- Injects that principal into `params._meta.cubiczan.principal` on every `tools/call`
- Repeats the principal on **every SSE event** so identity cannot drop with the handshake
- Rotates vaulted MCP inputs in place (`github_token` stays `github_token`; the old hash stops verifying)
- Enforces per-principal tool allowlists
- Optionally hooks the spend-mandate plane before a priced tool runs

## Live behavior

![Principal injected before the tool runs](docs/screenshots/gateway-principal.png)

![SSE repeats identity on each frame](docs/screenshots/gateway-sse.png)

![Rotate the vault, keep the input id](docs/screenshots/gateway-rotate.png)

## Run

From the platform root:

```bash
npm install
npm test -w @cubiczan/governed-mcp-gateway
npm run gateway
```

Or in this package:

```bash
npm start
```

```bash
curl -sS -H "Authorization: Bearer mcp_agt_payops_demo" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"echo.ping","arguments":{"hello":"world"}}}' \
  http://127.0.0.1:7474/mcp
```

SSE (closes after one frame when `once=1`):

```bash
curl -sS -H "Authorization: Bearer mcp_agt_payops_demo" \
  "http://127.0.0.1:7474/mcp/sse?once=1"
```

Rotate without minting a new VS Code input id (human key required):

```bash
curl -sS -H "Authorization: Bearer mcp_human_controller_demo" \
  -H "Content-Type: application/json" \
  -d '{"secret":"ghp_new_secret_bbbb"}' \
  http://127.0.0.1:7474/v1/credentials/github_token/rotate
```

## API

| Method | Path | Auth | What |
|---|---|---|---|
| `GET` | `/health` | — | `{ ok, service }` |
| `POST` | `/mcp` | Bearer agent or human | JSON-RPC `initialize`, `tools/list`, `tools/call` |
| `GET` | `/mcp/sse` | Bearer | `notifications/message` with principal on `_meta` |
| `POST` | `/v1/credentials` | Human | Put a named secret |
| `POST` | `/v1/credentials/:name/rotate` | Human | New hash, same name, version++ |
| `POST` | `/v1/credentials/verify` | — | `{ ok: boolean }` |
| `POST` | `/v1/locks` | Human | CHP approve / reject |

Demo keys: `mcp_agt_payops_demo` (PayOps: `echo.ping`, `stripe.charge`), `mcp_agt_research_demo` (no charge tool), `mcp_human_controller_demo` (vault + locks).

Disallowed tools return JSON-RPC `-32001` — they do not run.

## Layout

```
packages/governed-mcp-gateway/src/gateway.ts   HTTP + JSON-RPC + SSE + vault
packages/shared                                CHP gate, HMAC ledger, SSE helper
```

Sister SKUs: [spend-mandate-plane](https://github.com/icohangar-ops/spend-mandate-plane) (`:7475`), [cfo-agent-mesh](https://github.com/icohangar-ops/cfo-agent-mesh) (`:7476`).

## License

MIT
