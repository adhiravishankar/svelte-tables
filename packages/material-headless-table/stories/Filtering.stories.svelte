<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { MaterialHeadlessTable, type HeadlessColumnDef } from '../src/lib';
  import { type Person, makeData } from './data';

  const { Story } = defineMeta({ title: 'Features/Filtering' });

  const columns: HeadlessColumnDef<Person>[] = [
    { accessor: 'firstName', header: 'First Name' },
    { accessor: 'state', header: 'State', filterVariant: 'select' },
    { accessor: 'age', header: 'Age', filterVariant: 'range', width: 160 },
    { accessor: 'isActive', header: 'Active', filterVariant: 'checkbox', width: 120 },
  ];

  const data = makeData(80);
</script>

<Story name="Column filters">
  <MaterialHeadlessTable {columns} {data} enableColumnFilters initialState={{ pageSize: 5 }} pageSizes={[5, 10]} />
</Story>

<Story name="Global search only">
  <MaterialHeadlessTable {columns} {data} />
</Story>

<Story name="Global search off">
  <MaterialHeadlessTable {columns} {data} enableGlobalFilter={false} />
</Story>

<Story name="Initial search">
  <MaterialHeadlessTable {columns} {data} initialState={{ globalFilter: 'a' }} />
</Story>
