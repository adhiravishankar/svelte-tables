# material-svelte-headless-table

[Documentation and live examples](https://material-headless-table-docs.pages.dev/) · [Storybook](https://material-svelte-headless-storybook.pages.dev/)

A Svelte Material UI data table for Svelte 5, built on Svelte Headless Table. Every feature is one of its plugins, and rows are virtualized with Svelte Virtual List.

## Install

```bash
npm install material-svelte-headless-table
```

Needs **Svelte 5**. Import the stylesheet once (SMUI only publishes Sass, so the package ships its styles
pre-compiled):

```ts
import 'material-svelte-headless-table/styles.css';
```

Theme the table with the Material `--mdc-theme-*` CSS variables.

## Usage

```svelte
<script lang="ts">
  import { MaterialHeadlessTable, type HeadlessColumnDef } from 'material-svelte-headless-table';

  type Person = { name: string; age: number; city: string };

  const columns: HeadlessColumnDef<Person>[] = [
    { accessor: 'name', header: 'Name' },
    { accessor: 'age', header: 'Age', align: 'end', width: 100 },
    { accessor: 'city', header: 'City', filterVariant: 'select' },
  ];

  let data = $state<Person[]>([]);
</script>

<MaterialHeadlessTable {columns} {data} enableRowSelection enableColumnFilters enableGrouping />
```

Add `enableVirtualization height={480}` to render only the rows in view.

## Docs

The documentation site is in [`apps/material-headless-table-docs`](https://github.com/adhiravishankar/svelte-tables/tree/main/apps/material-headless-table-docs).
This package is one of four table libraries in the
[svelte-tables](https://github.com/adhiravishankar/svelte-tables) repository.

## License

MIT
