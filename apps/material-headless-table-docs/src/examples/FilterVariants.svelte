<script lang="ts">
  import { MaterialHeadlessTable, type CellContext, type HeadlessColumnDef } from 'material-svelte-headless-table';
  import { type Person, makeData } from '../data/makeData';

  const columns: HeadlessColumnDef<Person>[] = [
    { accessor: 'firstName', header: 'First Name' },
    { accessor: 'state', header: 'State', filterVariant: 'select' },
    { accessor: 'age', header: 'Age', filterVariant: 'range', width: 160 },
    {
      accessor: 'isActive',
      header: 'Active',
      filterVariant: 'checkbox',
      cell: active,
      width: 120,
    },
  ];

  const data = makeData(80);
</script>

{#snippet active({ value }: CellContext<Person, boolean>)}
  {value ? 'Yes' : 'No'}
{/snippet}

<MaterialHeadlessTable {columns} {data} enableColumnFilters initialState={{ pageSize: 5 }} pageSizes={[5, 10]} />
