# shadcn-svelte-headless-table

A shadcn-svelte data table for Svelte 5, built on Svelte Headless Table. Every feature is one of its plugins, and rows are virtualized with Svelte Virtual List.

## Install

```bash
npm install shadcn-svelte-headless-table
```

Needs **Svelte 5** and **Tailwind CSS 4**. Import the stylesheet after Tailwind in your global CSS. It makes Tailwind
scan the library for the classes it uses and defines the shadcn-svelte tokens:

```css
@import 'tailwindcss';
@import 'shadcn-svelte-headless-table/styles.css';
```

Define your own shadcn tokens after that import to theme the table.

## Usage

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

Add `enableVirtualization height={480}` to render only the rows in view.

## Docs

The documentation site is in [`apps/shadcn-headless-table-docs`](https://github.com/adhiravishankar/svelte-tables/tree/main/apps/shadcn-headless-table-docs).
This package is one of four table libraries in the
[svelte-tables](https://github.com/adhiravishankar/svelte-tables) repository.

## License

MIT
