<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { ShadcnHeadlessTable, type HeadlessColumnDef } from '../src/lib';
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
  <ShadcnHeadlessTable {columns} {data} />
</Story>

<Story name="Striped">
  <ShadcnHeadlessTable {columns} {data} striped />
</Story>

<Story name="Compact density">
  <ShadcnHeadlessTable {columns} {data} initialState={{ density: 'compact' }} />
</Story>

<Story name="No toolbars">
  <ShadcnHeadlessTable {columns} {data} enableTopToolbar={false} enableBottomToolbar={false} />
</Story>

<Story name="Loading">
  <ShadcnHeadlessTable {columns} data={[]} isLoading />
</Story>

<Story name="Empty">
  <ShadcnHeadlessTable {columns} data={[]} />
</Story>

<Story name="Row click">
  <ShadcnHeadlessTable {columns} {data} onRowClick={({ row }) => alert(`${row.firstName} ${row.lastName}`)} />
</Story>
