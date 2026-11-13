<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { BootstrapHeadlessTable, type HeadlessColumnDef } from '../src/lib';
  import { type Person, makeData } from './data';

  const { Story } = defineMeta({ title: 'Features/Sorting' });

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
  <BootstrapHeadlessTable {columns} {data} />
</Story>

<Story name="Multi sort">
  <BootstrapHeadlessTable {columns} {data} enableMultiSort />
</Story>

<Story name="Sorted at start">
  <BootstrapHeadlessTable {columns} {data} initialState={{ sorting: [{ id: 'age', desc: true }] }} />
</Story>

<Story name="Disabled">
  <BootstrapHeadlessTable {columns} {data} enableSorting={false} />
</Story>
