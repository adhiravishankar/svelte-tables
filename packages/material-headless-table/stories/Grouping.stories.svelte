<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { MaterialHeadlessTable, type HeadlessColumnDef } from '../src/lib';
  import { type Person, makeData } from './data';

  const { Story } = defineMeta({ title: 'Features/Grouping' });

  const columns: HeadlessColumnDef<Person>[] = [
    { accessor: 'state', header: 'State' },
    { accessor: 'firstName', header: 'First Name' },
    { accessor: 'age', header: 'Average age', aggregate: 'mean', aggregateFormat: (value) => value.toFixed(1) },
    { accessor: 'salary', header: 'Total salary', aggregate: 'sum', align: 'end' },
  ];

  const data = makeData(40);
</script>

<Story name="Grouped by state">
  <MaterialHeadlessTable {columns} {data} enableGrouping enablePagination={false} initialState={{ grouping: ['state'] }} />
</Story>

<Story name="Grouping on, none active">
  <MaterialHeadlessTable {columns} {data} enableGrouping enablePagination={false} />
</Story>
