<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { ShadcnHeadlessTable, type HeadlessColumnDef } from '../src/lib';
  import { type Person, makeData } from './data';

  const { Story } = defineMeta({ title: 'Features/Pagination' });

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

<Story name="Small pages">
  <ShadcnHeadlessTable {columns} {data} initialState={{ pageSize: 5 }} pageSizes={[5, 10, 25]} />
</Story>

<Story name="Off">
  <ShadcnHeadlessTable {columns} {data} enablePagination={false} />
</Story>
