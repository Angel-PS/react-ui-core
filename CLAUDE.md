# @angelps/react-ui-core — Contribution Guide

This is a **publishable, framework-agnostic React component library**. Its components were extracted from the BluePOS client so that future projects can reuse the same layouts, tables, filters, and form primitives. **Follow these patterns exactly.** When adding something new, mirror the closest existing component before inventing a new convention.

---

## What this is (and is NOT)

- A self-contained UI kit: design tokens + dark mode + components, shipped as ESM + CJS with type declarations and a single `style.css`.
- **NOT** an app. It has **no** router, **no** i18n runtime, **no** data fetching, **no** app context. The only peer dependencies are `react` and `react-dom` (`>=17`).
- Published to npm as `@angelps/react-ui-core`. Consumers install it, import the styles once, toggle `.dark` on `<html>`, and pass data + callbacks in.

---

## The core rule: decouple, don't depend

Every component is **controlled and presentational**. When porting or adding a component, never reach for app-level machinery — replace it with props:

| Instead of… | Use a prop |
| --- | --- |
| `react-router` (`useNavigate`, `useSearchParams`) | `onNavigate(path)`, controlled `sort`/`onSortChange`, `searchValue`/`onSearchChange`, `onPageChange` |
| `react-i18next` `t(...)` | a `labels` prop (an object/functions) with **English defaults**, shallow/deep-merged over the defaults |
| app context (`useAuth`, settings) | plain value props (e.g. `columnPref` + `onColumnChange`) |
| `import.meta.env` / globals | a required/`default*` prop |

**Never hardcode user-facing strings** in a component — expose them through `labels` with sensible English defaults (see `MaintenanceLayoutLabels`, `TableLabels`, `ColumnManagerLabels`, `FiltersLabels`, `PaginationLabels`). Consumers translate by passing their own `labels`.

`react-router-dom` and `react-i18next` must never appear in `dependencies` or `peerDependencies`.

---

## File & folder layout

One folder per component under `src/components/<Name>/`:

```
src/components/<Name>/
  <Name>.tsx           # the component (named export + default)
  <Name>.types.ts      # prop/types when non-trivial (optional)
  <Name>.stories.tsx   # Storybook stories
  <Name>.test.tsx      # Vitest unit tests
  index.ts             # re-exports the public surface of the folder
```

Shared, non-component code lives in:
- `src/types/` — shared TS types (`Option`, table types, `Metadata`). Barreled in `src/types/index.ts`.
- `src/lib/` — pure helpers: `cn` (clsx + tailwind-merge), `statusStyles`, `applyColumnPrefs`, `format` (dates/decimals/initials). **No React, no component imports.**
- `src/hooks/` — generic hooks (`useClickOutside`).
- `src/styles/index.css` — the theme (tokens + dark mode + custom utilities).

**Every new public component MUST be exported from `src/index.ts`** (organized by category), or consumers can't import it. Inside components, import siblings/lib via **relative paths** (`../Button`, `../../lib/utils`) — do **not** import from the root barrel (`src/index.ts`) to avoid circular dependencies.

---

## Styling & theming

- **Tailwind v4** via `@tailwindcss/vite` (no `tailwind.config`). All tokens live in [`src/styles/index.css`](src/styles/index.css) as CSS variables inside `@theme` / `@theme inline` / `:root` / `.dark`.
- **Brand colors:** primary blue `#4061a8` (7-step ramp `--color-primary-blue-*`), accent amber `#f59e0b` (`--color-accent-amber*`), error `#ef4444`.
- **Dark mode is automatic for token utilities.** Prefer brand/semantic utilities — `bg-primary-blue-*`, `text-primary-blue-*`, `bg-card`, `text-foreground`, `border-border` — they auto-flip in dark mode because the `--color-*` / semantic variables are redefined under `.dark` (Tailwind v4 emits utilities as `var(--color-…)`). **Do not** add a `dark:` variant for these.
- **Raw built-in neutrals need a `dark:` variant.** When you use `bg-white`, `text-gray-*`, `border-gray-*`, light status tints (`bg-red-50`), keep the light class and append the dark counterpart (additive, so light mode never regresses):

| Light (keep) | Add | Light (keep) | Add |
|---|---|---|---|
| `bg-white` | `dark:bg-slate-900` | `text-gray-900/800` | `dark:text-slate-100` |
| `bg-gray-50/100` | `dark:bg-slate-800` | `text-gray-700/600` | `dark:text-slate-300` |
| `bg-gray-200` | `dark:bg-slate-700` | `text-gray-500` | `dark:text-slate-400` |
| `border-gray-100/200` | `dark:border-slate-800` | `border-gray-300` | `dark:border-slate-700` |
| `bg-{red,amber,emerald,blue}-50` | `dark:bg-{color}-950/40` | `text-{color}-700/800` | `dark:text-{color}-300` |

- **Custom utility classes are load-bearing** and only exist because `style.css` is imported: `base-input`, `input`, `error-input`, `panel-container`, `primary-button`, `secondary-button`, `.round` (checkbox), `.skeleton`, `bp-fadein`. Use them rather than re-deriving colors/borders.
- **The library does not own the theme toggle.** It only ships the `.dark` token definitions; the consumer toggles `.dark` on `<html>`. Storybook's preview imports `src/styles/index.css`, so stories render themed automatically (wrap a story in a `.dark` container to preview dark mode).
- **Icons:** FontAwesome only (`@fortawesome/*`). Do not add a second icon library (e.g. lucide).
- **Class merging:** use `cn` from `src/lib/utils`.

---

## Consuming the library (document this in the README, keep it true)

```ts
import { MaintenanceLayout, Button } from "@angelps/react-ui-core";
import "@angelps/react-ui-core/styles"; // once, at the app entry
```
Toggle dark mode by adding/removing `dark` on `<html>`. All text can be localized via each component's `labels` prop.

---

## Build, test, publish

- **Build:** `npm run build` = `tsc --noEmit && vite build`. This is the real gate — it typechecks **all** of `src` (including stories and tests) and emits `dist/ui-core.es.js`, `dist/ui-core.cjs.js`, `dist/style.css`, and `dist/index.d.ts`. **It must pass before anything ships.**
- **Vite library mode:** only `react`, `react-dom`, `react/jsx-runtime` are externalized; everything else (clsx, tailwind-merge, FontAwesome, @react-input/mask) is bundled so the package works out of the box. `@fontsource-variable/geist` and `tw-animate-css` are compiled into the emitted `style.css`.
- **Tests:** `npm test` = `vitest run --project=unit` (jsdom). Add a `*.test.tsx` for every component; favor pure-logic tests (`applyColumnPrefs`, `serialize`, `helpers`, `format`) plus behavior tests. The CI `build` job runs `npm test`, so tests must stay green.
- **Storybook:** `npm run storybook`. Add a `*.stories.tsx` per public component.
- **Publishing is tag-driven and maintainer-owned** (mirrors `core-prisma-query-builder`). To release: bump `version` in `package.json`, commit, then push a `v*` git tag. [`.github/workflows/npm-publish.yml`](.github/workflows/npm-publish.yml) runs build + test, then `npm publish` to npmjs.org using the `npm_token` repo secret (`prepublishOnly` rebuilds). Do not run `npm publish` by hand.
- **Versioning (SemVer):** new component / backward-compatible feature → minor; fix → patch; breaking prop/API change → major.

---

## Conventions summary

- **Decouple via props** — no router, no i18n runtime, no app context, no env. English-default `labels` for all text.
- **react/react-dom are the only peers.** Don't add `react-router-dom` / `react-i18next` as deps or peers.
- **Folder-per-component + `index.ts`; export every public component from `src/index.ts`.** Import siblings via relative paths, never the root barrel.
- **Dark mode:** prefer auto-flipping brand/semantic utilities; pair raw neutrals with `dark:`. Verify in both themes.
- **FontAwesome only; merge classes with `cn`.**
- **`src/lib` is pure** (no React/component imports).
- **`npm run build` must pass** (it typechecks stories + tests too) and **`npm test` must be green** before reporting work done.
- **Releases:** bump version → push `v*` tag → workflow publishes. Maintainer-owned.

---

## When unsure

Find the closest existing component and mirror it:
- Controlled list view with table + filters + delete confirm → [`MaintenanceLayout`](src/components/MaintenanceLayout/MaintenanceLayout.tsx).
- Data table with sort/status/avatar/expand → [`Table`](src/components/Table/Table.tsx).
- Declarative, controlled filters → [`Filters`](src/components/Filters/) + [`useFilterController`](src/components/Filters/useFilterController.ts).
- Overlay with ESC + scroll-lock → [`Modal`](src/components/Modal/Modal.tsx); confirmation → [`ConfirmDialog`](src/components/ConfirmDialog/ConfirmDialog.tsx).
- Form primitive → [`Input`](src/components/Input/Input.tsx), [`Select`](src/components/Select/Select.tsx).
