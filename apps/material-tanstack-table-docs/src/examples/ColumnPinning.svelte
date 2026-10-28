<script lang="ts">
  import { MaterialSvelteTable, type MRT_ColumnDef } from 'material-svelte-tanstack-table';
  import { type Person, makeData } from '../data/makeData';

  const columns: MRT_ColumnDef<Person>[] = [
    { accessorKey: 'firstName', header: 'First Name', size: 150 },
    { accessorKey: 'lastName', header: 'Last Name', size: 150 },
    { accessorKey: 'email', header: 'Email', size: 280 },
    { accessorKey: 'city', header: 'City', size: 200 },
    { accessorKey: 'state', header: 'State', size: 200 },
    { accessorKey: 'age', header: 'Age', size: 120 },
    { accessorKey: 'salary', header: 'Salary', size: 160 },
  ];

  const data = makeData(30);
</script>

<!-- pin from the column menu, or start with some columns already pinned -->
<MaterialSvelteTable
  options={{
    columns,
    data,
    enableColumnPinning: true,
    enableRowSelection: true,
    initialState: {
      columnPinning: { end: ['salary'], start: ['mrt-row-select', 'firstName'] },
    },
  }}
/>
