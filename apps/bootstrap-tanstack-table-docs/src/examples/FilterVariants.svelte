<script lang="ts">
  import { BootstrapSvelteTable, type MRT_ColumnDef } from 'bootstrap-svelte-tanstack-table';
  import { type Person, makeData, states } from '../data/makeData';

  const columns: MRT_ColumnDef<Person>[] = [
    { accessorKey: 'firstName', header: 'First Name' }, // text (default)
    {
      accessorKey: 'state',
      filterSelectOptions: states,
      filterVariant: 'select',
      header: 'State',
    },
    { accessorKey: 'age', filterVariant: 'range', header: 'Age (range)', size: 200 },
    { accessorKey: 'salary', filterVariant: 'range-slider', header: 'Salary (slider)', size: 220 },
    {
      accessorFn: (row) => String(row.isActive),
      filterVariant: 'checkbox',
      header: 'Active',
      id: 'isActive',
      size: 140,
    },
  ];

  const data = makeData(80);
</script>

<BootstrapSvelteTable
  options={{
    columns,
    data,
    enableColumnFilterModes: true,
    enableFacetedValues: true,
    initialState: { showColumnFilters: true },
  }}
/>
