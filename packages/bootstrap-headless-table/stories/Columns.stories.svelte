<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { BootstrapHeadlessTable, type HeadlessColumnDef } from '../src/lib';
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
  <BootstrapHeadlessTable {columns} {data} />
</Story>

<Story name="Visibility off">
  <BootstrapHeadlessTable {columns} {data} enableColumnVisibility={false} />
</Story>

<Story name="Reordering">
  <BootstrapHeadlessTable {columns} {data} enableColumnOrdering />
</Story>

<Story name="Resizing">
  <BootstrapHeadlessTable {columns} {data} enableColumnResizing />
</Story>

<Story name="Initially hidden">
  <BootstrapHeadlessTable {columns} {data} initialState={{ hiddenColumns: ['email'] }} />
</Story>
