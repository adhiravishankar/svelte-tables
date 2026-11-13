# bootstrap-svelte-tanstack-table

[![npm](https://img.shields.io/npm/v/bootstrap-svelte-tanstack-table)](https://www.npmjs.com/package/bootstrap-svelte-tanstack-table)
[![Docs](https://img.shields.io/badge/docs-bootstrap--tanstack--table.pages.dev-blue)](https://bootstrap-tanstack-table.pages.dev/)
[![Storybook](https://img.shields.io/badge/storybook-bootstrap--svelte--tanstack--storybook.pages.dev-ff4785)](https://bootstrap-svelte-tanstack-storybook.pages.dev/)

A fully featured Bootstrap 5 data table for Svelte 5, built on TanStack Table v9. A port of Material React Table with a runes and snippets API.

## Install

```bash
npm install bootstrap-svelte-tanstack-table
```

Needs **Svelte 5** and **Bootstrap 5**. Import the stylesheet after Bootstrap in your global CSS. It bridges the
library's tokens to Bootstrap's own CSS variables, so the table follows whatever theme/colors and color mode
(`data-bs-theme`) your app already has:

```css
@import 'bootstrap/dist/css/bootstrap.css';
@import 'bootstrap-svelte-tanstack-table/styles.css';
```

## Usage

```svelte
<script lang="ts">
  import { BootstrapSvelteTable, type MRT_ColumnDef } from 'bootstrap-svelte-tanstack-table';

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

<BootstrapSvelteTable
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

## Docs

The documentation site is in [`apps/bootstrap-tanstack-table-docs`](https://github.com/adhiravishankar/svelte-tables/tree/main/apps/bootstrap-tanstack-table-docs),
live at [bootstrap-tanstack-table.pages.dev](https://bootstrap-tanstack-table.pages.dev/), with a
[Storybook](https://bootstrap-svelte-tanstack-storybook.pages.dev/) alongside it.
This package is one of six table libraries in the
[svelte-tables](https://github.com/adhiravishankar/svelte-tables) repository.

## License

MIT
