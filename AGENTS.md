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
- Keep `package.json` exports, `vite.config.ts` `build.lib.entry`, and emitted `dist/` artifacts in sync. Public subpath exports must have a matching Vite library entry and must emit the referenced JS and type files during `pnpm run build`.

## Consumer Compatibility

- Treat `dist/` as part of the product surface for consuming apps.
- When adding a new public asset or runtime dependency needed by consumers, make sure the published package still includes the required `dist` outputs.
- Keep package exports stable and explicit. Do not add consumer-only local path assumptions.
- Changes must remain compatible with remote package consumption, not only local linked-workspace usage.

## Templates vs components (what lives where)

**Goal:** Dashboard apps (`student`, `college`, `company`, `college-collaborator`) should not each own copies of the same page chrome. Anything that is the *same layout and composition* across those repos should move to `tenurin-ui`.

### Templates (`src/templates/*`, exported as `tenurin-ui/templates/...`)

Use a **template** when you are shipping a **composed page or feature shell** that multiple apps adopt with the same structure, spacing, and roles—while still allowing apps to pass **data, copy, and children** (slots).

Current template families:

- **`templates/auth`** — `AuthShell`, `AuthPanel` for sign-in and related auth flows.
- **`templates/sidebar`** — `AppSidebarTemplate` (logo, nav sections, user menu shell).
- **`templates/messaging`** — Messaging layout, conversation list shell, empty states, section headings.
- **`templates/status-page`**, **`templates/route-error`**, **`templates/access-denied`** — Full-page outcomes and errors.
- **`templates/post-detail`** — Post detail page shell.
- **`templates/dashboard-account`** — Shared Settings page chrome and Profile route outer shell (`DashboardSettingsPageTemplate`, `DashboardProfilePageShell`).
- **`templates/help-request`** — Shared Help modal (`HelpRequestDialogTemplate`) for raising support requests; apps wire `guideUrl` and `onSubmit`.

Templates may import **`components/ui/*`** primitives. They should stay **domain-agnostic** (no app-specific API paths, Zustand stores, or route constants).

### Components (`src/components/ui/*`, exported as `tenurin-ui/button`, `tenurin-ui/input`, …)

Use a **component** for a **reusable control or visual primitive**: buttons, inputs, dialogs, table cells, skeleton rows, `auth-form` class names, etc. Components are building blocks; they do not encode a full dashboard route’s layout.

**Account settings presentation:** `tenurin-ui/settings-account` exports `SettingsAccountRoot`, `SettingsAccountSection`, and shared surface class constants for the dashboard Settings tab. Apps keep `AlternateEmails`, `ResetPasswordDialog`, and `DeleteAccountDialog` (API and navigation); change panel colors or borders in `settings-account.tsx` once to update all dashboards.

Apps compose **templates + components + app hooks/stores** inside `app/src/pages` or `app/src/components`.

### Both (typical pattern)

- **Template** = outer page shell (max width, header row, optional actions slot, main content region).
- **Components** = fields, cards, tables inside the shell.
- **App** = `useQuery`, `fetcher`, validators, and navigation.

### When to add a new template

Add under `src/templates/<name>/`, export from `src/templates/<name>/index.tsx`, then wire **`package.json` `exports`**, **`vite.config.ts` `build.lib.entry`**, and **`scripts/check-tenurin-ui-source.mjs`** expectations so `pnpm run build` emits matching `dist/` artifacts.

### Account / settings / profile (cross-dashboard)

Today, **Settings** page wrappers are duplicated verbatim across apps (`max-w-3xl`, title “Settings”, description). **Profile** pages share the same *outer* pattern (centered column, optional edit header) but use **different** domain panels (`StudentProfilePanel`, `CollegeProfilePanel`, `CompanyProfilePanel`, …).

**Implemented in `templates/dashboard-account`:**

- `DashboardSettingsPageTemplate` — Settings page heading + `children` (used by all four dashboard apps).
- `DashboardProfilePageShell` — outer Profile route layout; apps keep inner `max-w-2xl` / panel markup.

**Optional follow-ups:**

- Share more of Profile inner chrome if `*ProfilePanel` structures converge.
- **Onboarding** (`StudentDetails`, `CompanyDetails`, …) — only lift into a template if the same `AuthShell` + column + title/description pattern repeats; otherwise keep thin page files that compose `templates/auth` + app panels.

## Quality Expectations

- Keep public component APIs explicit and conservative because changes here affect multiple apps.
- Keep component props typed as `Readonly<...>` when the component does not intentionally mutate them.
- When adding React Hook Form integrations, examples, or wrappers around controlled inputs such as selects, comboboxes, date pickers, or custom UI components, prefer `Controller` or `useController` over manual `watch` plus `setValue`. Reserve `watch` and `useWatch` for derived display state or conditional rendering, not for primary field control.
- Prefer direct positive branches over negated conditions when either form would work; avoid `!condition` control flow when the positive path is clearer.
- Do not introduce nested ternaries in feature code. Extract intermediate variables or use plain `if` branches instead.
- Prefer optional chaining over repetitive nullish guard expressions when it keeps the code shorter and clearer.
- Prefer `globalThis` over `window`, `self`, or other browser-global aliases in shared browser-safe code.
- Avoid unnecessary type assertions; narrow types directly or move the assertion to the smallest possible boundary when it is actually needed.
- Keep shared tokens, styles, assets, and exports organized for downstream reuse instead of app-specific shortcuts.
- Before finishing, run the relevant validation commands for this repo. At minimum: `pnpm run lint` and `pnpm run build`.
