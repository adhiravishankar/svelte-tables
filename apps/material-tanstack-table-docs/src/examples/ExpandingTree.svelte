<script lang="ts">
  import { MaterialSvelteTable, type MRT_ColumnDef } from 'material-svelte-tanstack-table';
  import { type Person, makeTree } from '../data/makeData';

  const columns: MRT_ColumnDef<Person>[] = [
    { accessorKey: 'firstName', header: 'First Name' },
    { accessorKey: 'lastName', header: 'Last Name' },
    { accessorKey: 'state', header: 'State' },
    { accessorKey: 'salary', header: 'Salary' },
  ];

  // each person can have `subRows`
  const data = makeTree();
</script>

<MaterialSvelteTable
  options={{
    columns,
    data,
    enableExpandAll: true,
    enableExpanding: true,
    getSubRows: (row) => row.subRows,
    initialState: { expanded: true },
  }}
/>
