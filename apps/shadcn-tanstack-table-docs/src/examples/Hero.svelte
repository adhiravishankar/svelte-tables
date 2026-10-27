<script lang="ts">
  import { ShadcnSvelteTable, type MRT_ColumnDef } from 'shadcn-svelte-tanstack-table';
  import { type Person, makeData } from '../data/makeData';

  const columns: MRT_ColumnDef<Person>[] = [
    { accessorKey: 'firstName', header: 'First Name' },
    { accessorKey: 'lastName', header: 'Last Name' },
    { accessorKey: 'state', header: 'State' },
    { accessorKey: 'age', header: 'Age', size: 100 },
  ];

  const data = makeData(40);
</script>

<ShadcnSvelteTable
  options={{
    columns,
    data,
    enableColumnOrdering: true,
    enableRowSelection: true,
    initialState: { pagination: { pageIndex: 0, pageSize: 5 } },
  }}
/>
