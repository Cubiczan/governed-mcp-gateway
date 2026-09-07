# Change: Unblock Glama quality score for Cubiczan/governed-mcp-gateway

## Why

https://glama.ai/mcp/servers/Cubiczan/governed-mcp-gateway/score is stuck at 17% profile completion: no `glama.json`, author not verified, no Glama release. Tool Definition Quality and Server Coherence are not scored until a Glama release exists. punkpeye/awesome-mcp-servers#13878 needs that evaluation.

Cubiczan/chp-mcp is the working reference (`glama.json` maintainers, Dockerfile, Glama release, score B/A).

## What Changes

- Add root `glama.json` (`https://glama.ai/mcp/schemas/server.json`, maintainers `icohangar-ops` and `Cubiczan`).
- Point package `repository` at `https://github.com/Cubiczan/governed-mcp-gateway`.
- Add a stdio MCP entry plus Dockerfile/CMD that Glama can Build then Make Release.
- Document Cubiczan-only claim / Sync Server / Dockerfile Build / Make Release steps.

## Capabilities

- `mcp-gateway`: Glama listing, stdio transport for directory introspection, claim metadata.

## Impact

- New root `glama.json`, `Dockerfile`, `docs/glama-release.md`.
- Gateway package: stdio JSON-RPC, richer tool descriptions for TDQS, repository metadata.
- README sister-SKU links on this listing use Cubiczan / in-repo paths only (no icohangar-ops GitHub URLs).
- Non-goals: live Stripe/x402, publishing npm, changing icohangar-ops repos, Glama UI actions (maintainer must claim/build/release).
