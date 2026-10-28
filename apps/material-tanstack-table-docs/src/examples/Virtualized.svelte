<script lang="ts">
  import { MaterialSvelteTable, type MRT_ColumnDef } from 'material-svelte-tanstack-table';
  import { type Person, makeData } from '../data/makeData';

  const columns: MRT_ColumnDef<Person>[] = [
    { accessorKey: 'firstName', header: 'First Name' },
    { accessorKey: 'lastName', header: 'Last Name' },
    { accessorKey: 'email', header: 'Email', size: 260 },
    { accessorKey: 'city', header: 'City' },
    { accessorKey: 'state', header: 'State' },
  ];

  // 10,000 rows, but only the ones in view are in the DOM
  const data = makeData(10_000);
</script>

<MaterialSvelteTable
  options={{
    columns,
    data,
    enablePagination: false,
    enableRowNumbers: true,
    enableRowVirtualization: true,
    tableContainerProps: { style: 'max-height: 480px' },
  }}
/>
