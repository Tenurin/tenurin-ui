# AGENTS.md

## Scope

- Applies to the `tenurin-ui` repository.
- Repository-specific instructions here override the global defaults when they conflict.

## Repo Overview

- This repo is the shared Tenurin UI library consumed by app repos such as `student` and `college`.
- It publishes shared UI primitives, templates, stylesheets, theme tokens, brand assets, fonts, and Tailwind scan targets from `dist/`.
- The package is built with Vite and TypeScript and exported through the package `exports` map in `package.json`.

## Package Manager And Commands

- Use `pnpm` for all package management and scripts in this repo.
- Install dependencies with `pnpm install`.
- Start the local preview/dev environment with `pnpm run dev` when needed.
- Build distributable output with `pnpm run build`.
- Build declaration output with `pnpm run build:types`.
- Use `pnpm run build:watch` for iterative local development when consumer repos need fresh `dist/` output.
- This repo does not currently use an ESLint config. The active repo checks are `pnpm run lint` and `pnpm run lint:fix`, which run the source-shape scripts in `scripts/check-tenurin-ui-source.mjs` and `scripts/fix-tenurin-ui-source.mjs`.

## Consumer Compatibility

- Treat `dist/` as part of the product surface for consuming apps.
- When adding a new public asset or runtime dependency needed by consumers, make sure the published package still includes the required `dist` outputs.
- Keep package exports stable and explicit. Do not add consumer-only local path assumptions.
- Changes must remain compatible with remote package consumption, not only local linked-workspace usage.

## Quality Expectations

- Keep public component APIs explicit and conservative because changes here affect multiple apps.
- Keep component props typed as `Readonly<...>` when the component does not intentionally mutate them.
- Prefer direct positive branches over negated conditions when either form would work; avoid `!condition` control flow when the positive path is clearer.
- Do not introduce nested ternaries in feature code. Extract intermediate variables or use plain `if` branches instead.
- Prefer optional chaining over repetitive nullish guard expressions when it keeps the code shorter and clearer.
- Prefer `globalThis` over `window`, `self`, or other browser-global aliases in shared browser-safe code.
- Avoid unnecessary type assertions; narrow types directly or move the assertion to the smallest possible boundary when it is actually needed.
- Keep shared tokens, styles, assets, and exports organized for downstream reuse instead of app-specific shortcuts.
- Before finishing, run the relevant validation commands for this repo. At minimum: `pnpm run lint` and `pnpm run build`.
