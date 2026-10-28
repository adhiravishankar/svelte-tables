<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { MaterialHeadlessTable, type HeadlessColumnDef } from '../src/lib';
  import { type Person, makeData } from './data';

  const { Story } = defineMeta({ title: 'Table/Basic' });

  const columns: HeadlessColumnDef<Person>[] = [
    { accessor: 'firstName', header: 'First Name' },
    { accessor: 'lastName', header: 'Last Name' },
    { accessor: 'email', header: 'Email', width: 260 },
    { accessor: 'state', header: 'State' },
    { accessor: 'age', header: 'Age', width: 100, align: 'end' },
  ];

  const data = makeData(60);
</script>

<Story name="Default">
  <MaterialHeadlessTable {columns} {data} />
</Story>

<Story name="Striped">
  <MaterialHeadlessTable {columns} {data} striped />
</Story>

<Story name="Compact density">
  <MaterialHeadlessTable {columns} {data} initialState={{ density: 'compact' }} />
</Story>

<Story name="No toolbars">
  <MaterialHeadlessTable {columns} {data} enableTopToolbar={false} enableBottomToolbar={false} />
</Story>

<Story name="Loading">
  <MaterialHeadlessTable {columns} data={[]} isLoading />
</Story>

<Story name="Empty">
  <MaterialHeadlessTable {columns} data={[]} />
</Story>

<Story name="Row click">
  <MaterialHeadlessTable {columns} {data} onRowClick={({ row }) => alert(`${row.firstName} ${row.lastName}`)} />
</Story>
