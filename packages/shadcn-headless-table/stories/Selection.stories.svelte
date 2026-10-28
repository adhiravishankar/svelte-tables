<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { ShadcnHeadlessTable, type HeadlessColumnDef } from '../src/lib';
  import { type Person, makeData } from './data';

  const { Story } = defineMeta({ title: 'Features/Row selection' });

  const columns: HeadlessColumnDef<Person>[] = [
    { accessor: 'firstName', header: 'First Name' },
    { accessor: 'lastName', header: 'Last Name' },
    { accessor: 'email', header: 'Email', width: 260 },
    { accessor: 'state', header: 'State' },
    { accessor: 'age', header: 'Age', width: 100, align: 'end' },
  ];

  const data = makeData(60);

  let selected = $state(0);
</script>

<Story name="Multiple">
  <ShadcnHeadlessTable {columns} {data} enableRowSelection />
</Story>

<Story name="Single">
  <ShadcnHeadlessTable {columns} {data} enableRowSelection enableMultiRowSelection={false} />
</Story>

<Story name="With callback">
  <p>Selected rows: {selected}</p>
  <ShadcnHeadlessTable {columns} {data} enableRowSelection onSelectionChange={(rows) => (selected = rows.length)} />
</Story>
