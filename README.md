# Material Svelte Table

### _Quickly create Svelte data tables with Material Design_

**Built with [Svelte 5](https://svelte.dev), [Svelte Material UI](https://sveltematerialui.com) and [TanStack Table <sup>V9</sup>](https://tanstack.com/table)**

Material Svelte Table is a Svelte 5 port of [Material React Table](https://github.com/KevinVandy/material-react-table)
by Kevin Vandy, which it is based on (MIT licensed). The table logic comes from TanStack Table, the components from
SMUI, and the API is written for runes and snippets: no hooks, no `renderX` callbacks.

> **Status:** `4.0.0-alpha`. The feature set matches Material React Table v3 apart from the exceptions listed in
> [Migrating from React](apps/material-svelte-table-docs/src/content/docs/getting-started/migrating-from-react.mdx).

## Packages

| Path | What it is |
| ---- | ---------- |
| [`packages/material-svelte-table`](packages/material-svelte-table) | The library (`material-svelte-table`), plus its Storybook (400+ stories) and tests |
| [`apps/material-svelte-table-docs`](apps/material-svelte-table-docs) | The documentation site: Astro + Starlight, with live Svelte examples |

## Features

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
- [x] Theming from your Material (`--mdc-theme-*`) variables, including dark mode
- [x] Toolbars with your own action buttons
- [x] Tree data and expanding sub rows
- [x] Row and column virtualization (`@tanstack/virtual-core`)
- [x] Fully typed with TypeScript generics

## Getting started

Requires **Svelte 5**.

```bash
npm install material-svelte-table
```

Import the stylesheet once (SMUI only publishes Sass, so the library ships its styles pre-compiled):

```ts
import 'material-svelte-table/styles.css';
```

### Usage

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
  let rowSelection = $state({});
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
    onRowSelectionChange: (updater) => {
      rowSelection = typeof updater === 'function' ? updater(rowSelection) : updater;
    },
    state: {
      get rowSelection() {
        return rowSelection;
      },
    },
  }}
/>
```

Need the table instance, for example to start creating a row from your own button? Create it yourself and pass it in:

```svelte
<script lang="ts">
  import { MaterialSvelteTable, createMaterialSvelteTable } from 'material-svelte-table';

  const table = createMaterialSvelteTable({ columns, data });
</script>

<button onclick={() => table.setCreatingRow(true)}>Add person</button>
<MaterialSvelteTable {table} />
```

Customization uses snippets where Material React Table used `renderX` options, for example `detailPanel`,
`rowActions`, `topToolbarCustomActions` and `emptyRowsFallback`, and `Cell`, `Header`, `Footer` and `Edit` on columns.

## Run it locally

This repository uses npm workspaces and Turborepo.

```bash
npm install
npm run docs:dev        # documentation site on :3000 (uses the library source directly)
npm run storybook       # Storybook on :6006
npm run test            # unit and component tests
npm run check           # svelte-check and astro check
npm run build         # build the library, then the docs
```

## Contributing

PRs are welcome. For large changes please open an issue first. See the [Contributing Guide](CONTRIBUTING.md) for how to
run the project.

## License

MIT. Based on [Material React Table](https://github.com/KevinVandy/material-react-table), Copyright (c) 2022 Kevin Vandy.
