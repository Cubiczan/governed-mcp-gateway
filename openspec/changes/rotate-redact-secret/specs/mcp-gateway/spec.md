# mcp-gateway Specification

## MODIFIED Requirements

### Requirement: Credential rotation without rewriting client config
The gateway SHALL allow a vaulted input (for example a VS Code MCP `inputs` token) to be rotated in place. The old secret SHALL be rejected after rotation. The input name SHALL stay stable. The rotate HTTP response SHALL be a redacted vault preview (`name`, `version`, `hash`, `preview`) and SHALL NOT include a `secret` field or any plaintext secret value.

#### Scenario: Rotate a named MCP input
- GIVEN credential input `github_token` with secret A
- WHEN an operator calls rotate on `github_token` with secret B
- THEN secret A is rejected on the next request
- AND secret B is accepted
- AND the input name remains `github_token`

#### Scenario: Rotate response does not echo plaintext
- GIVEN credential input `github_token`
- WHEN an operator POSTs `/v1/credentials/github_token/rotate` with a new secret
- THEN the JSON body has no `secret` field
- AND the JSON body does not contain the new secret as plaintext
- AND the JSON body includes `name`, `version`, `hash`, and `preview`
