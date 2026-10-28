# shadcn-svelte-tanstack-table

A fully featured shadcn-svelte data table for Svelte 5, built on TanStack Table v9. A port of Material React Table with a runes and snippets API.

## Install

```bash
npm install shadcn-svelte-tanstack-table
```

Needs **Svelte 5** and **Tailwind CSS 4**. Import the stylesheet after Tailwind in your global CSS. It makes Tailwind
scan the library for the classes it uses and defines the shadcn-svelte tokens:

```css
@import 'tailwindcss';
@import 'shadcn-svelte-tanstack-table/styles.css';
```

Define your own shadcn tokens after that import to theme the table.

## Usage

```svelte
<script lang="ts">
  import { ShadcnSvelteTable, type MRT_ColumnDef } from 'shadcn-svelte-tanstack-table';

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

<ShadcnSvelteTable
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

The documentation site is in [`apps/shadcn-tanstack-table-docs`](https://github.com/adhiravishankar/svelte-tables/tree/main/apps/shadcn-tanstack-table-docs).
This package is one of four table libraries in the
[svelte-tables](https://github.com/adhiravishankar/svelte-tables) repository.

## License

MIT
