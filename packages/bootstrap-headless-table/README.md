# bootstrap-svelte-headless-table

[![npm](https://img.shields.io/npm/v/bootstrap-svelte-headless-table)](https://www.npmjs.com/package/bootstrap-svelte-headless-table)
[![Docs](https://img.shields.io/badge/docs-bootstrap--headless--table.pages.dev-blue)](https://bootstrap-headless-table.pages.dev/)
[![Storybook](https://img.shields.io/badge/storybook-bootstrap--svelte--headless--storybook.pages.dev-ff4785)](https://bootstrap-svelte-headless-storybook.pages.dev/)

A Bootstrap 5 data table for Svelte 5, built on Svelte Headless Table. Every feature is one of its plugins, and rows are virtualized with Svelte Virtual List.

## Install

```bash
npm install bootstrap-svelte-headless-table
```

Needs **Svelte 5** and **Bootstrap 5**. Import the stylesheet after Bootstrap in your global CSS. It bridges the
library's tokens to Bootstrap's own CSS variables, so the table follows whatever theme/colors and color mode
(`data-bs-theme`) your app already has:

```css
@import 'bootstrap/dist/css/bootstrap.css';
@import 'bootstrap-svelte-headless-table/styles.css';
```

## Usage

```svelte
<script lang="ts">
  import { BootstrapHeadlessTable, type HeadlessColumnDef } from 'bootstrap-svelte-headless-table';

  type Person = { name: string; age: number; city: string };

  const columns: HeadlessColumnDef<Person>[] = [
    { accessor: 'name', header: 'Name' },
    { accessor: 'age', header: 'Age', align: 'end', width: 100 },
    { accessor: 'city', header: 'City', filterVariant: 'select' },
  ];

  let data = $state<Person[]>([]);
</script>

<BootstrapHeadlessTable {columns} {data} enableRowSelection enableColumnFilters enableGrouping />
```

Add `enableVirtualization height={480}` to render only the rows in view.

## Docs

The documentation site is in [`apps/bootstrap-headless-table-docs`](https://github.com/adhiravishankar/svelte-tables/tree/main/apps/bootstrap-headless-table-docs),
live at [bootstrap-headless-table.pages.dev](https://bootstrap-headless-table.pages.dev/), with a
[Storybook](https://bootstrap-svelte-headless-storybook.pages.dev/) alongside it.
This package is one of six table libraries in the
[svelte-tables](https://github.com/adhiravishankar/svelte-tables) repository.

## License

MIT
