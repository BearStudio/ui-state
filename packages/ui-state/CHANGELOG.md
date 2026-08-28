# @bearstudio/ui-state

## 2.0.0

### Major Changes

- Make `getUiState` a discriminated union of `set()` results. `is()` narrows, `match` data is per-status, and `exhaustive()` is a type error to call while statuses remain. Callers of 1.1.0 that read `state` without narrowing will fail typecheck.

### Minor Changes

- Allow `is()` to take an array of statuses, like `when` and `match`. It still narrows the discriminated union to the listed variants.
- Allow `getUiState` to take a status string so `.match().exhaustive()` works without a `set()` callback. A wide `string` is a type error, since it cannot be matched exhaustively.

### Patch Changes

- Upgrade TypeScript to 7.0.2 and replace ESLint/Prettier with oxlint/oxfmt. No public API changes.
- Point published `exports.types` at `./dist/index.d.ts`. `.npmignore` strips `src/`, so the previous `./src/index.ts` path 404'd for consumers under bundler/NodeNext.
- 80aba69: Point published `exports.types` at `./dist/index.d.ts`. `.npmignore` strips `src/`, so the previous `./src/index.ts` path 404'd for consumers under bundler/NodeNext.

## 1.1.0

### Minor Changes

- d632f75: change .when return type from ReactNode to type inference
