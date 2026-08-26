---
"@bearstudio/ui-state": minor
---

Make `getUiState` a discriminated union of `set()` results. `is()` narrows, `match` data is per-status, and `exhaustive()` is a type error to call while statuses remain.
