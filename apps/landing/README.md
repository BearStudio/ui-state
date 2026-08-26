# landing

Marketing site for `@bearstudio/ui-state`. Unpublished; no changeset.

## Run

From the repo root (Node 24, pnpm 10.34.5):

```bash
pnpm install
pnpm --filter landing dev
```

Root `pnpm dev` / `pnpm build` / `pnpm check-types` / `pnpm lint` also
include this app via turbo. `dev` depends on `^build` so the library
dist exists before the Astro island imports it.

## Stack

- Astro 6 SSG + one React island (`client:visible`)
- Tailwind 4 via `@tailwindcss/vite` (not `@astrojs/tailwind`)
- Tokens in `@theme inline`
- `@bearstudio/ui-state` as `workspace:*`
- Fonts: Astro 6 Fonts API, Fontsource, latin + latin-ext, self-hosted

## Typecheck split

Library stays NodeNext (`react-library.json`). This app does **not**
extend `react-library.json`. It extends
`@bearstudio/typescript-config/astro.json` (`moduleResolution: Bundler`).

`check-types` is `tsc --noEmit` on `src/**/*.ts(x)` (the island).
`astro check` is not the source of truth on TypeScript 7 (no compiler API).

Lint: oxlint. Format: oxfmt.
