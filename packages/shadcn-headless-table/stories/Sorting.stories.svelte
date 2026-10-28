<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { ShadcnHeadlessTable, type HeadlessColumnDef } from '../src/lib';
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
  <ShadcnHeadlessTable {columns} {data} />
</Story>

<Story name="Multi sort">
  <ShadcnHeadlessTable {columns} {data} enableMultiSort />
</Story>

<Story name="Sorted at start">
  <ShadcnHeadlessTable {columns} {data} initialState={{ sorting: [{ id: 'age', desc: true }] }} />
</Story>

<Story name="Disabled">
  <ShadcnHeadlessTable {columns} {data} enableSorting={false} />
</Story>
