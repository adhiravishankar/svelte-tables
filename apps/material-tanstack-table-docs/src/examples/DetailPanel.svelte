<script lang="ts">
  import { MaterialSvelteTable, type MRT_ColumnDef, type MRT_Row } from 'material-svelte-tanstack-table';
  import { type Person, makeData } from '../data/makeData';

  const columns: MRT_ColumnDef<Person>[] = [
    { accessorKey: 'firstName', header: 'First Name' },
    { accessorKey: 'lastName', header: 'Last Name' },
    { accessorKey: 'state', header: 'State' },
    { accessorKey: 'age', header: 'Age', size: 100 },
  ];

  const data = makeData(20);
</script>

<!-- a snippet receives the row, and renders under it when it is expanded -->
{#snippet detailPanel({ row }: { row: MRT_Row<Person> })}
  <div style="display: grid; gap: 0.25rem">
    <strong>{row.original.firstName} {row.original.lastName}</strong>
    <a href="mailto:{row.original.email}">{row.original.email}</a>
    <span>{row.original.city}, {row.original.state}</span>
    <span>Salary: ${row.original.salary.toLocaleString()}</span>
  </div>
{/snippet}

<MaterialSvelteTable options={{ columns, data, detailPanel }} />
