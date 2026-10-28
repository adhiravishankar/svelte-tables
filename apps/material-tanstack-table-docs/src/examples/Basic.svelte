<script lang="ts">
  import { MaterialSvelteTable, type MRT_ColumnDef } from 'material-svelte-tanstack-table';
  import { type Person, makeData } from '../data/makeData';

  // Columns and data should be stable, so define them once.
  const columns: MRT_ColumnDef<Person>[] = [
    { accessorKey: 'firstName', header: 'First Name' },
    { accessorKey: 'lastName', header: 'Last Name' },
    { accessorKey: 'email', header: 'Email', size: 260 },
    { accessorKey: 'state', header: 'State' },
    { accessorKey: 'age', header: 'Age', size: 100 },
  ];

  const data = makeData(60);
</script>

<MaterialSvelteTable options={{ columns, data }} />
