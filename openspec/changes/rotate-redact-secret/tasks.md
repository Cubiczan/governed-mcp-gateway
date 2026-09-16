# Tasks

## 1. Spec

- [x] 1.1 OpenSpec proposal, design, and mcp-gateway spec delta (no plaintext on rotate)

## 2. Gateway

- [x] 2.1 Stop storing plaintext on the vaulted credential
- [x] 2.2 Rotate (and put) HTTP JSON uses the public preview only — do not re-attach `secret`

## 3. Proof

- [x] 3.1 Tests: rotate JSON has no `secret` key and does not contain the new plaintext; old secret fails verify
- [x] 3.2 README API line notes redacted rotate response
