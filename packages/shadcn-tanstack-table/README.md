# shadcn-svelte-tanstack-table

[![npm](https://img.shields.io/npm/v/shadcn-svelte-tanstack-table)](https://www.npmjs.com/package/shadcn-svelte-tanstack-table)
[![Docs](https://img.shields.io/badge/docs-shadcn--tanstack--table.pages.dev-blue)](https://shadcn-tanstack-table.pages.dev/)
[![Storybook](https://img.shields.io/badge/storybook-shadcn--svelte--tanstack--storybook.pages.dev-ff4785)](https://shadcn-svelte-tanstack-storybook.pages.dev/)

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

## Icons

Every icon the table renders can be replaced with the `icons` option. Pass only the ones you want to change; the rest
keep their defaults. An icon is a Svelte component that takes optional `class` and `style` props.

```svelte
<script lang="ts">
  import { ShadcnSvelteTable, MRT_Default_Icons } from 'shadcn-svelte-tanstack-table';
  import MyFilterIcon from './MyFilterIcon.svelte';
</script>

<ShadcnSvelteTable options={{ columns, data, icons: { FilterAltIcon: MyFilterIcon } }} />
```

`MRT_Default_Icons` also exports the built-in icons, so you can use them in your own snippets next to custom markup, for
example in a `Header`, `Cell`, `Footer`, `rowActions` or `topToolbarCustomActions` snippet:

```svelte
{#snippet nameHeader()}
  <span><MRT_Default_Icons.EditIcon /> <strong>First Name</strong></span>
{/snippet}
```

See the **Features / Icons With Custom HTML** stories in [Storybook](https://shadcn-svelte-tanstack-storybook.pages.dev/) for headers, cells, footers, row actions and
toolbar examples.

## Dependencies

Matching text in cells is highlighted by a small built-in helper. The table doesn't depend on `highlight-words` or any
other highlighting package.

## Docs

The documentation site is in [`apps/shadcn-tanstack-table-docs`](https://github.com/adhiravishankar/svelte-tables/tree/main/apps/shadcn-tanstack-table-docs),
live at [shadcn-tanstack-table.pages.dev](https://shadcn-tanstack-table.pages.dev/), with a
[Storybook](https://shadcn-svelte-tanstack-storybook.pages.dev/) alongside it.
This package is one of four table libraries in the
[svelte-tables](https://github.com/adhiravishankar/svelte-tables) repository.

## License

MIT
