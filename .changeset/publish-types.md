---
"@bearstudio/ui-state": patch
---

Point published `exports.types` at `./dist/index.d.ts`. `.npmignore` strips `src/`, so the previous `./src/index.ts` path 404'd for consumers under bundler/NodeNext.
