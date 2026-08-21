# Cubiczan Agent Platform

Three SKUs, one workspace. Built from the icohangar-ops stack (agent-conductor, clearance, two-key, meshcfo, lease842, poc-revenue, sbc-ledger) against Stack Overflow demand.

| Package | Port | What it is |
|---|---|---|
| [`packages/governed-mcp-gateway`](packages/governed-mcp-gateway) | 7474 | Principal on every tool call and SSE frame. Vaulted credential rotation. |
| [`packages/spend-mandate-plane`](packages/spend-mandate-plane) | 7475 | Agents propose. Mandates authorize. A human countersigns. Stripe settles; x402 is a rail. |
| [`packages/cfo-agent-mesh`](packages/cfo-agent-mesh) | 7476 | Board claims that do not seal until they have an agent, a CHP lock, and a document. |

## Run

```bash
npm install
npm test
npm run gateway   # :7474
npm run spend     # :7475
npm run cfo       # :7476
```

Demo Bearer keys (override with env):

- Gateway agent: `mcp_agt_payops_demo`
- Spend agent: `spend_agt_payops_demo`
- Spend human: `spend_human_controller_demo`
- CFO human: `cfo_human_controller_demo`

## Specs

OpenSpec change: `openspec/changes/ship-three-sku-platform/`.
