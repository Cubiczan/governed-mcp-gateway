# mcp-gateway Specification

## ADDED Requirements

### Requirement: Glama claim metadata lives at the repository root
The Cubiczan/governed-mcp-gateway repository SHALL include a root `glama.json` that validates against `https://glama.ai/mcp/schemas/server.json` and lists GitHub usernames that may claim the Glama server.

#### Scenario: Claim file is present
- GIVEN the repository root
- WHEN a client reads `glama.json`
- THEN `$schema` is `https://glama.ai/mcp/schemas/server.json`
- AND `maintainers` includes `icohangar-ops`

### Requirement: Stdio MCP transport for directory introspection
The gateway SHALL expose a stdio JSON-RPC MCP transport that answers `initialize` and `tools/list` without an HTTP Bearer header, using the seeded demo principal. Default `tools/list` SHALL omit the oversized estate fixture `docs.mega_schema`.

#### Scenario: Stdio tools/list for Glama
- GIVEN `seedDemo()` has run
- WHEN a stdio client sends `initialize` then `tools/list`
- THEN the server returns protocol capabilities and a tool list
- AND the list includes `echo.ping`, `context.inspect`, and `context.need`
- AND the list does not include `docs.mega_schema`
