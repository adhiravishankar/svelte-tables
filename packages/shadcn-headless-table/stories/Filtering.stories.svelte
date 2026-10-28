<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { ShadcnHeadlessTable, type HeadlessColumnDef } from '../src/lib';
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
  <ShadcnHeadlessTable {columns} {data} enableColumnFilters initialState={{ pageSize: 5 }} pageSizes={[5, 10]} />
</Story>

<Story name="Global search only">
  <ShadcnHeadlessTable {columns} {data} />
</Story>

<Story name="Global search off">
  <ShadcnHeadlessTable {columns} {data} enableGlobalFilter={false} />
</Story>

<Story name="Initial search">
  <ShadcnHeadlessTable {columns} {data} initialState={{ globalFilter: 'a' }} />
</Story>
