# material-svelte-tanstack-table

[![npm](https://img.shields.io/npm/v/material-svelte-tanstack-table)](https://www.npmjs.com/package/material-svelte-tanstack-table)
[![Docs](https://img.shields.io/badge/docs-material--tanstack--svelte--table.pages.dev-blue)](https://material-tanstack-svelte-table.pages.dev/)
[![Storybook](https://img.shields.io/badge/storybook-material--svelte--tanstack--storybook.pages.dev-ff4785)](https://material-svelte-tanstack-storybook.pages.dev/)

A fully featured Svelte Material UI data table for Svelte 5, built on TanStack Table v9. A port of Material React Table with a runes and snippets API.

## Install

```bash
npm install material-svelte-tanstack-table
```

Needs **Svelte 5**. Import the stylesheet once (SMUI only publishes Sass, so the package ships its styles
pre-compiled):

```ts
import 'material-svelte-tanstack-table/styles.css';
```

Theme the table with the Material `--mdc-theme-*` CSS variables.

## Usage

```svelte
<script lang="ts">
  import { MaterialSvelteTable, type MRT_ColumnDef } from 'material-svelte-tanstack-table';

  type Person = { name: string; age: number };

  // define columns once, outside of any reactive code
  const columns: MRT_ColumnDef<Person>[] = [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'age', header: 'Age' },
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
    enableRowSelection: true,
  }}
/>
```

## Icons

Every icon the table renders can be replaced with the `icons` option. Pass only the ones you want to change; the rest
keep their defaults. An icon is a Svelte component that takes optional `class` and `style` props.

```svelte
<script lang="ts">
  import { MaterialSvelteTable, MRT_Default_Icons } from 'material-svelte-tanstack-table';
  import MyFilterIcon from './MyFilterIcon.svelte';
</script>

<MaterialSvelteTable options={{ columns, data, icons: { FilterAltIcon: MyFilterIcon } }} />
```

`MRT_Default_Icons` also exports the built-in icons, so you can use them in your own snippets next to custom markup, for
example in a `Header`, `Cell`, `Footer`, `rowActions` or `topToolbarCustomActions` snippet:

```svelte
{#snippet nameHeader()}
  <span><MRT_Default_Icons.EditIcon /> <strong>First Name</strong></span>
{/snippet}
```

See the **Features / Icons With Custom HTML** stories in [Storybook](https://material-svelte-tanstack-storybook.pages.dev/) for headers, cells, footers, row actions and
toolbar examples.

## Dependencies

Matching text in cells is highlighted by a small built-in helper. The table doesn't depend on `highlight-words` or any
other highlighting package.

## Docs

The documentation site is in [`apps/material-tanstack-table-docs`](https://github.com/adhiravishankar/svelte-tables/tree/main/apps/material-tanstack-table-docs),
live at [material-tanstack-svelte-table.pages.dev](https://material-tanstack-svelte-table.pages.dev/), with a
[Storybook](https://material-svelte-tanstack-storybook.pages.dev/) alongside it.
This package is one of four table libraries in the
[svelte-tables](https://github.com/adhiravishankar/svelte-tables) repository.

## License

MIT
