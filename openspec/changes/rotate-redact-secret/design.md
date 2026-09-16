# Design: rotate redacts; HTTP must not re-attach plaintext

## Decision

`rotateCredential` already returns `putCredential`, which stripped `secret` with `undefined`. `JSON.stringify` omits `undefined`, so the leak is not the vault helper — it is the Node HTTP handler:

```
sendJson(res, 200, { ...this.rotateCredential(name, secret), secret });
```

That spread copies the operator-supplied (or auto-generated) plaintext back onto the redacted record.

## Response shape

Public credential JSON is exactly:

| Field | Meaning |
|---|---|
| `name` | Stable input id (`github_token`) |
| `version` | Incremented |
| `hash` | SHA-256 of the new secret |
| `preview` | Existing `prefix…suffix` redaction |

No `secret` key. Operators who need the new value already sent it in the request body (or generate it client-side). Auto-generated `newId("tok")` when the body omits `secret` is also not echoed.

## Vault record

Do not store plaintext on the in-memory credential. Verify continues to compare `hash(secret)`. Serializing the stored record cannot leak a field that is not there.

## Non-goals

SOC2, OAuth, live network rails, changing VS Code input ids.
