# AGENTS.md

Guidance for AI coding agents working in this repository. Humans should read [README.md](README.md) and
[CONTRIBUTING.md](CONTRIBUTING.md); this file is the short version with the things an agent gets wrong most often.

## What this repo is

An npm-workspaces monorepo of six Svelte 5 data table libraries and their docs sites. Version `4.0.0-alpha`.

| Library (`packages/`) | Table logic | Components | Docs site (`apps/`) |
| --- | --- | --- | --- |
| `material-tanstack-table` | TanStack Table V9 | Svelte Material UI | `material-tanstack-table-docs` |
| `shadcn-tanstack-table` | TanStack Table V9 | shadcn-svelte, bits-ui, Tailwind 4 | `shadcn-tanstack-table-docs` |
| `bootstrap-tanstack-table` | TanStack Table V9 | Bootstrap 5 (plain markup/classes) | `bootstrap-tanstack-table-docs` |
| `material-headless-table` | `@humanspeak/svelte-headless-table` | Svelte Material UI | `material-headless-table-docs` |
| `shadcn-headless-table` | `@humanspeak/svelte-headless-table` | shadcn-svelte, bits-ui, Tailwind 4 | `shadcn-headless-table-docs` |
| `bootstrap-headless-table` | `@humanspeak/svelte-headless-table` | Bootstrap 5 (plain markup/classes) | `bootstrap-headless-table-docs` |

The TanStack packages are Svelte 5 ports of Material React Table v3 (MIT, Kevin Vandy). Keep API names close to it
unless the port needs a Svelte idiom (snippets instead of `renderX`, getters instead of changing option values).

Workspace (npm) names equal the folder names, plus a `-docs` suffix for sites.

## Commands

Run from the repo root. Tooling is Vite+ (`vp`); formatting and linting use oxfmt and oxlint.

```bash
npm install
npm run test                         # all workspaces (vitest, jsdom)
npm run check                        # builds the Material TanStack lib, then svelte-check and astro check everywhere
npm run lint                         # oxlint via vp
npm run format                       # oxfmt via vp (format:check to verify only)
npm run build -w <workspace>         # build one library or docs site
npm run test  -w <workspace>         # test one library
npm run dev   -w <docs-workspace>    # docs site on :3000
npm run storybook                    # Material TanStack Storybook on :6006
```

The root `build`, `dev`, `lib:*`, `docs:*` and `storybook` scripts target only the Material TanStack package. Use
`-w <workspace>` for the other three.

A docs site imports its built library, so build the library before building the docs (`build:cloudflare` does both).
The Material TanStack docs dev server is the exception and reads `src/lib` directly.

## Layout

Each library has the same shape:

```
packages/<name>/
  src/lib/          # public source; index.ts is the entry point
    components/     # Svelte components
    types/ types.ts # public types
    locales/        # 39 built in locales
    styles.css      # shipped stylesheet (Material: pre-compiled Sass; shadcn: Tailwind scan + tokens; bootstrap: --bs-* bridge)
  stories/          # Storybook stories (TanStack Material has 400+)
```

TanStack packages also have `create<Flavor>SvelteTable.svelte.ts`, `features.ts`, `tableOptions.ts`, `fns/`, `hooks/`.
Headless packages have `createHeadlessTable.svelte.ts`.

Other places: `scripts/` (publish, GitHub Pages build), `.github/workflows/pages.yml`, per docs site `wrangler.jsonc`
and `public/_headers`. Docs API reference pages are generated from library types by
`apps/material-tanstack-table-docs/scripts/generate-api.mjs`; do not hand edit generated output.

## Conventions

- **Svelte 5 only**: runes (`$state`, `$derived`, `$props`, `$effect`) and snippets. No stores, `export let`, `on:` events
  or slots in new code.
- Files using runes outside components need the `.svelte.ts` suffix (see `createHeadlessTable.svelte.ts`).
- TanStack options that change over time are passed as getters (`get data() { return data; }`); columns are defined once
  outside reactive code. Preserve that contract.
- TypeScript, fully typed with generics. No `any` in public types.
- Formatting (oxfmt): single quotes, semicolons, 2 space indent, LF, sorted imports. Run `npm run format` rather than
  styling by hand.
- Material, shadcn and Bootstrap flavors of the same engine should stay feature-equivalent. When you change one, check
  its siblings (`material-tanstack` / `shadcn-tanstack` / `bootstrap-tanstack`, `material-headless` / `shadcn-headless` /
  `bootstrap-headless`).
- Feature set differs by engine on purpose. Headless packages do not have column pinning, in-table editing, fuzzy search,
  facet counts or detail panels, because they are not Svelte Headless Table plugins. Do not add them there.
- Theming: Material uses `--mdc-theme-*` variables; shadcn uses its tokens; Bootstrap bridges the same internal tokens to
  Bootstrap's own `--bs-*` variables. Do not mix them.
- Bootstrap packages use plain Bootstrap 5 markup/classes (no bits-ui, no component wrapper library). Anchored menus and
  popovers (`floatingAnchor.ts`) are hand-rolled with `getBoundingClientRect` rather than Popper/Floating UI.
- Add or update a Storybook story and a test when you add or fix a feature. Keep docs pages in
  `apps/*/src/content/docs` in sync with API changes.
- Do not bump versions or publish. `npm run publish:all` is for the maintainer.

## Before you finish

1. `npm run test` and `npm run check` pass (or the specific `-w` equivalents for the workspace you touched).
2. `npm run format:check` and `npm run lint` are clean.
3. If a public API changed, docs and the package README reflect it.
4. Do not commit unless the user asks.

## Pitfalls

- Windows is a first class dev platform here; scripts use `node` (`.mjs`), not shell-only syntax.
- `.npmrc` and `package-lock.json` are managed deliberately. Do not regenerate the lockfile unprompted.
- Node version is pinned in `.node-version` (22); `engines` requires `>=22.23.4`.
- Do not edit `dist/`, `node_modules/`, or generated API docs.
