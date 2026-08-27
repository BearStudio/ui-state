---
"@bearstudio/ui-state": minor
---

Allow `getUiState` to take a status string so `.match().exhaustive()` works without a `set()` callback. A wide `string` is a type error, since it cannot be matched exhaustively.
