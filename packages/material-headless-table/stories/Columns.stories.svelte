<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { MaterialHeadlessTable, type HeadlessColumnDef } from '../src/lib';
  import { type Person, makeData } from './data';

  const { Story } = defineMeta({ title: 'Features/Columns' });

  const columns: HeadlessColumnDef<Person>[] = [
    { accessor: 'firstName', header: 'First Name' },
    { accessor: 'lastName', header: 'Last Name' },
    { accessor: 'email', header: 'Email', width: 260 },
    { accessor: 'state', header: 'State' },
    { accessor: 'age', header: 'Age', width: 100, align: 'end' },
  ];

  const data = makeData(60);
</script>

<Story name="Hide and show">
  <MaterialHeadlessTable {columns} {data} />
</Story>

<Story name="Visibility off">
  <MaterialHeadlessTable {columns} {data} enableColumnVisibility={false} />
</Story>

<Story name="Reordering">
  <MaterialHeadlessTable {columns} {data} enableColumnOrdering />
</Story>

<Story name="Resizing">
  <MaterialHeadlessTable {columns} {data} enableColumnResizing />
</Story>

<Story name="Initially hidden">
  <MaterialHeadlessTable {columns} {data} initialState={{ hiddenColumns: ['email'] }} />
</Story>
