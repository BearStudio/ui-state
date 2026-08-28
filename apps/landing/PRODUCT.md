# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

TypeScript and React engineers drowning in nested loading / error / empty UI.

## Product Purpose

`@bearstudio/ui-state` is an OSS TypeScript helper. `getUiState` plus `match` plus `exhaustive()` map pending, error, and the statuses a screen already has onto one typed chain. Success is a compile error when a status is unmatched — not a new store.

## Positioning

exhaustive() is a type error until every status is matched. Statuses are inferred from set(), not a fixed enum. React is a peer. There is no store.

## Operating Context

Library landing (Persuade).
Engineers arrive from GitHub, read a short example, and wire getUiState to query flags they already have.

## Capabilities and Constraints

- Surface API: getUiState, set(), match, exhaustive(), when().
- Do not demo is() as a type guard; it does not narrow on current main (PR #5).
- MIT. React peer. No store, no context, no extra runtime.
- Do not invent download counts or testimonials.

## Brand Commitments

Voice: specific, technical, no hype. Anti-references: Relume/v0 indigo bento, fake browser chrome, equal feature cards, Unleash. Identity: cream/ink tokens, IBM Plex Sans and Mono.

## Evidence on Hand

No download counts, testimonials, or case studies. Do not fabricate them. Facts: MIT, React peer, no store, exhaustive() fails the type check until every status is matched.

## Product Principles

1. A missed status is a type error, not a blank screen.
2. Statuses come from the app, not a library enum.
3. No new store; wire to flags the screen already has.
4. Marketing copy stays factual; no hype words.
