<script lang="ts">
  import { ShadcnSvelteTable, type MRT_ColumnDef } from 'shadcn-svelte-tanstack-table';
  import { type Person, makeData } from '../data/makeData';

  const columns: MRT_ColumnDef<Person>[] = [
    { accessorKey: 'firstName', header: 'First Name' },
    { accessorKey: 'lastName', header: 'Last Name' },
    { accessorKey: 'city', header: 'City' },
    { accessorKey: 'state', header: 'State' },
  ];

  const data = makeData(8);
</script>

<!-- the same table with every interactive feature turned off -->
<ShadcnSvelteTable
  options={{
    columns,
    data,
    enableBottomToolbar: false,
    enableColumnActions: false,
    enableColumnFilters: false,
    enablePagination: false,
    enableSorting: false,
    enableTopToolbar: false,
    tableBodyRowProps: { style: 'height: 40px' },
  }}
/>
