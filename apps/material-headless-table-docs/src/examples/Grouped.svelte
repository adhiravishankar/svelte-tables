<script lang="ts">
  import { MaterialHeadlessTable, type HeadlessColumnDef } from 'material-svelte-headless-table';
  import { type Person, makeData } from '../data/makeData';

  const columns: HeadlessColumnDef<Person>[] = [
    { accessor: 'state', header: 'State' },
    { accessor: 'firstName', header: 'First Name' },
    { accessor: 'age', header: 'Average age', aggregate: 'mean', aggregateFormat: (value) => value.toFixed(1) },
    { accessor: 'salary', header: 'Total salary', aggregate: 'sum', align: 'end' },
  ];

  const data = makeData(40);
</script>

<MaterialHeadlessTable
  {columns}
  {data}
  enableColumnOrdering
  enableGrouping
  enablePagination={false}
  initialState={{ grouping: ['state'] }}
/>
