# material-svelte-tanstack-table

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

## Docs

The documentation site is in [`apps/material-tanstack-table-docs`](https://github.com/adhiravishankar/svelte-tables/tree/main/apps/material-tanstack-table-docs).
This package is one of four table libraries in the
[svelte-tables](https://github.com/adhiravishankar/svelte-tables) repository.

## License

MIT
