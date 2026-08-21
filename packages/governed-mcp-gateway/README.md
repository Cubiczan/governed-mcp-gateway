# Governed MCP Gateway

Production MCP is stuck on auth. This is a control plane, not a server catalog.

It:

- Resolves a Bearer credential to a **Principal**
- Injects that principal into `params._meta.cubiczan.principal` on every `tools/call`
- Repeats the principal on **every SSE event** so identity cannot drop with the handshake
- Rotates vaulted MCP inputs in place (`github_token` stays `github_token`; the old secret dies)
- Enforces per-principal tool allowlists
- Optionally hooks the spend-mandate plane before a priced tool runs

```bash
npm start
curl -H "Authorization: Bearer mcp_agt_payops_demo" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"echo.ping","arguments":{}}}' \
  http://127.0.0.1:7474/mcp
```

Productizes ideas from `agent-conductor`, `sovereign-mesh`, and `shieldgate`.
