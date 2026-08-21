# Agent Spend & Mandate Plane

Stripe is the commercial adjacency. x402 is a rail, not the SKU.

Flow: **propose → mandate → countersign → settle**.

- Under the agent cap with a covering mandate: lane `auto`, CHP `LOCKED`, Stripe meter event
- Over cap: lane `approval`. A **human** second key must countersign. The proposing agent cannot countersign itself
- `POST /v1/settle` with `rail: "stripe"` (default) or `rail: "x402"`

```bash
npm start
curl -H "Authorization: Bearer spend_agt_payops_demo" \
  -H "Content-Type: application/json" \
  -d '{"agent":"agt_payops","merchant":{"name":"Stripe","url":"https://stripe.com","country":"US"},"total":"12.00","rationale":"tool meter"}' \
  http://127.0.0.1:7475/v1/proposals
```

Productizes `clearance`, `two-key`, and `countersign`.
