<script lang="ts">
  import {
    ShadcnSvelteTable,
    createShadcnSvelteTable,
  } from '../../src/lib';
  import { employees } from '../data';

  // `setGrouping` is on the table instance, so any button can drive the grouping
  const table = createShadcnSvelteTable({
    columns: [
      { accessorKey: 'state', header: 'State' },
      { accessorKey: 'gender', header: 'Gender' },
      { accessorKey: 'firstName', header: 'First Name' },
      { accessorKey: 'lastName', header: 'Last Name' },
    ],
    data: employees.slice(0, 60),
    enableGrouping: true,
  });
</script>

<p style="display: flex; gap: 0.5rem">
  <button onclick={() => table.setGrouping(['state'])}>Group by state</button>
  <button onclick={() => table.setGrouping(['gender', 'state'])}>Group by gender, then state</button>
  <button onclick={() => table.resetGrouping(true)}>Clear</button>
</p>
<ShadcnSvelteTable {table} />
