# Change: Rotate responses never include plaintext secrets

## Why

`POST /v1/credentials/:name/rotate` vaults the new hash and preview, then the HTTP handler spreads the redacted record and re-attaches the incoming `secret`. Demo and Product Hunt launch copy the rotate JSON; echoing plaintext defeats vault redaction. Name stays `github_token`; only hash/preview/version belong in the response.

## What Changes

- Rotate (and put) HTTP JSON returns a public vault preview: `name`, `version`, `hash`, `preview`. No `secret` field.
- Vault storage keeps hash + preview only; plaintext is not copied onto the stored record after redaction.
- Tests fail if rotate JSON includes a `secret` key or the supplied plaintext.

## Capabilities

- `mcp-gateway`: vaulted named credential rotation (redacted response).

## Impact

- `packages/governed-mcp-gateway` behavior change on rotate (and put) JSON.
- OpenSpec delta under this change.
- Non-goals: SOC2/OAuth claims, live Stripe/x402, changing verify, minting a new input id.
