# Svelte Tables

### _Data tables for Svelte 5 in four flavors_

Four table libraries live in this monorepo. They share a goal (a full featured data table with a Svelte 5 API of runes
and snippets) and differ in two choices: where the table logic comes from, and which components draw it.

|                                                 | **TanStack Table V9** logic                        | **Svelte Headless Table** logic                         |
| ----------------------------------------------- | -------------------------------------------------- | ------------------------------------------------------- |
| **Material** ([Svelte Material UI](https://sveltematerialui.com)) | [`material-svelte-table`](packages/material-tanstack-table) | [`material-svelte-headless-table`](packages/material-headless-table) |
| **shadcn** ([shadcn-svelte](https://shadcn-svelte.com), bits-ui and Tailwind CSS 4) | [`shadcn-svelte-tanstack-table`](packages/shadcn-tanstack-table) | [`shadcn-svelte-headless-table`](packages/shadcn-headless-table) |

The TanStack packages are Svelte 5 ports of [Material React Table](https://github.com/KevinVandy/material-react-table)
by Kevin Vandy, which they are based on (MIT licensed). The headless packages are smaller: they use only what
[`@humanspeak/svelte-headless-table`](https://table.svelte.page) offers as plugins, and render rows with
[`@humanspeak/svelte-virtual-list`](https://virtuallist.svelte.page) when virtualized.

> **Status:** `4.0.0-alpha`. The TanStack packages match Material React Table v3 apart from the exceptions listed in
> [Migrating from React](apps/material-tanstack-table-docs/src/content/docs/getting-started/migrating-from-react.mdx).

## Packages and docs

Each library has a documentation site (Astro + Starlight, with live Svelte examples).

| Library | Docs site |
| ------- | --------- |
| [`packages/material-tanstack-table`](packages/material-tanstack-table), with Storybook (400+ stories) and tests | [`apps/material-tanstack-table-docs`](apps/material-tanstack-table-docs) |
| [`packages/shadcn-tanstack-table`](packages/shadcn-tanstack-table), with Storybook and tests | [`apps/shadcn-tanstack-table-docs`](apps/shadcn-tanstack-table-docs) |
| [`packages/material-headless-table`](packages/material-headless-table), with tests | [`apps/material-headless-table-docs`](apps/material-headless-table-docs) |
| [`packages/shadcn-headless-table`](packages/shadcn-headless-table), with tests | [`apps/shadcn-headless-table-docs`](apps/shadcn-headless-table-docs) |

## Which one?

- **Pick a TanStack package** for the full feature set and the TanStack table instance underneath.
- **Pick a headless package** for a smaller table whose features are all Svelte Headless Table plugins.
- **Pick Material** if your app uses Svelte Material UI and `--mdc-theme-*` variables, **shadcn** if it uses
  shadcn-svelte and Tailwind.

## Features

### TanStack packages

_All features can be enabled or disabled_

- [x] Aggregation and grouping (sum, average, count, ...)
- [x] Cell actions (right click context menu)
- [x] Click to copy cell values
- [x] Column action dropdown menu
- [x] Column hiding
- [x] Column ordering via drag and drop
- [x] Column pinning (frozen columns)
- [x] Column resizing
- [x] Customizable icons and component props
- [x] Data editing and creating (modal, row, cell and table edit modes)
- [x] Density toggle
- [x] Detail panels
- [x] Faceted values for filter options
- [x] Filtering (client-side and server-side), with text, select, range, slider, checkbox, autocomplete and date variants
- [x] Filter match highlighting
- [x] Full screen mode
- [x] Global filtering (search all columns, rank by best match)
- [x] Header groups and footers
- [x] Localization (i18n), with 39 built in locales
- [x] Manage your own state, or let the table manage it
- [x] Pagination (client-side and server-side)
- [x] Row actions
- [x] Row numbers
- [x] Row ordering via drag and drop
- [x] Row pinning
- [x] Row selection
- [x] Sorting (client-side and server-side)
- [x] Theming (Material `--mdc-theme-*` variables, or shadcn tokens), including dark mode
- [x] Toolbars with your own action buttons
- [x] Tree data and expanding sub rows
- [x] Row and column virtualization (`@tanstack/virtual-core`)
- [x] Fully typed with TypeScript generics

### Headless packages

Each one is a Svelte Headless Table plugin:

- [x] Sorting, with multi sort (`addSortBy`)
- [x] Column filters: text, select, range and checkbox (`addColumnFilters`)
- [x] Global search (`addTableFilter`)
- [x] Pagination (`addPagination`)
- [x] Row selection (`addSelectedRows`)
- [x] Column hiding (`addHiddenColumns`)
- [x] Column ordering via drag and drop (`addColumnOrder`)
- [x] Column resizing (`addResizedColumns`)
- [x] Grouping with aggregation, and expandable groups (`addGroupBy`, `addExpandedRows`)
- [x] Row virtualization (`@humanspeak/svelte-virtual-list`)
- [x] Density toggle, striped rows, loading bar, footers and 39 built in locales

Not included, because they are not plugins: column pinning, in-table editing, fuzzy search modes, facet counts and
detail panels.

## Getting started

All packages need **Svelte 5**. The shadcn packages also need **Tailwind CSS 4**.

### TanStack, Material

```bash
npm install material-svelte-table
```

Import the stylesheet once (SMUI only publishes Sass, so the library ships its styles pre-compiled):

```ts
import 'material-svelte-table/styles.css';
```

```svelte
<script lang="ts">
  import { MaterialSvelteTable, type MRT_ColumnDef } from 'material-svelte-table';

  type Person = { name: string; age: number };

  // define columns once, outside of any reactive code
  const columns: MRT_ColumnDef<Person>[] = [
    { accessorKey: 'name', header: 'Name' },
    { accessorFn: (row) => row.age, id: 'age', header: 'Age' },
  ];

  let data = $state<Person[]>([
    { name: 'John', age: 30 },
    { name: 'Sara', age: 25 },
  ]);
</script>

<MaterialSvelteTable
  options={{
    columns,
    // options that change over time are passed as getters
    get data() {
      return data;
    },
    enableColumnOrdering: true, // enable some features
    enableRowSelection: true,
    enablePagination: false, // disable a default one
  }}
/>
```

### TanStack, shadcn

```bash
npm install shadcn-svelte-tanstack-table
```

Import the stylesheet after Tailwind in your global CSS. It makes Tailwind scan the library and defines the
shadcn-svelte tokens:

```css
@import 'tailwindcss';
@import 'shadcn-svelte-tanstack-table/styles.css';
```

The component and the options are the same as above, with `ShadcnSvelteTable` and `createShadcnSvelteTable`.

### Headless

```bash
npm install material-svelte-headless-table   # or shadcn-svelte-headless-table
```

Import the same stylesheet as above for the flavor you chose, then pass `columns` and `data`. Every feature is a prop:

```svelte
<script lang="ts">
  import { ShadcnHeadlessTable, type HeadlessColumnDef } from 'shadcn-svelte-headless-table';

  type Person = { name: string; age: number; city: string };

  const columns: HeadlessColumnDef<Person>[] = [
    { accessor: 'name', header: 'Name' },
    { accessor: 'age', header: 'Age', align: 'end', width: 100 },
    { accessor: 'city', header: 'City', filterVariant: 'select' },
  ];

  let data = $state<Person[]>([]);
</script>

<ShadcnHeadlessTable {columns} {data} enableRowSelection enableColumnFilters enableGrouping />
```

Use `MaterialHeadlessTable` from `material-svelte-headless-table` for the Material flavor. Add
`enableVirtualization height={480}` to render only the rows in view.

Customization uses snippets where Material React Table used `renderX` options, for example `detailPanel`,
`rowActions` and `topToolbarCustomActions` in the TanStack packages, and `cell` on a column in all of them.

## Run it locally

This repository uses npm workspaces and Vite+.

```bash
npm install
npm run docs:dev        # Material TanStack docs on :3000 (uses the library source directly)
npm run storybook       # Material TanStack Storybook on :6006
npm run test            # unit and component tests
npm run check           # svelte-check and astro check
npm run build           # build the library, then the docs
```

The root scripts target the Material TanStack package. Run the others by workspace name:

```bash
npm run build -w shadcn-svelte-headless-table        # build a library
npm run test  -w shadcn-svelte-headless-table        # test a library
npm run dev   -w shadcn-svelte-headless-table-docs   # a docs site on :3000
npm run build -w shadcn-svelte-headless-table-docs   # build a docs site (build the library first)
```

The workspace names are `material-svelte-table`, `shadcn-svelte-tanstack-table`, `material-svelte-headless-table` and
`shadcn-svelte-headless-table`, each with a `-docs` site.

## Contributing

PRs are welcome. For large changes please open an issue first. See the [Contributing Guide](CONTRIBUTING.md) for how to
run the project.

## License

MIT. The TanStack packages are based on [Material React Table](https://github.com/KevinVandy/material-react-table),
Copyright (c) 2022 Kevin Vandy.
