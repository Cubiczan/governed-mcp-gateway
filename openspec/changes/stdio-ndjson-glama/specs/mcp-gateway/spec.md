# mcp-gateway Specification

## ADDED Requirements

### Requirement: Stdio stdout is NDJSON for Glama mcp-proxy
The stdio transport SHALL write each JSON-RPC response as a single line of JSON followed by a newline. It SHALL NOT emit `Content-Length` headers on stdout. The reader SHALL continue to accept both Content-Length framed messages and newline-delimited JSON on stdin.

#### Scenario: initialize reply is NDJSON
- GIVEN a stdio client that sends `initialize`
- WHEN the server writes the JSON-RPC result
- THEN stdout is one JSON object followed by a newline
- AND stdout does not contain `Content-Length`

#### Scenario: Content-Length stdin still works
- GIVEN a client that writes a Content-Length framed `initialize`
- WHEN the server reads stdin
- THEN it parses the request
- AND it replies with NDJSON on stdout
