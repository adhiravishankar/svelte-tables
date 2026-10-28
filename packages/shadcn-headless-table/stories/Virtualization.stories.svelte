<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { ShadcnHeadlessTable, type HeadlessColumnDef } from '../src/lib';
  import { type Person, makeData } from './data';

  const { Story } = defineMeta({ title: 'Features/Virtualization' });

  const columns: HeadlessColumnDef<Person>[] = [
    { accessor: 'firstName', header: 'First Name' },
    { accessor: 'lastName', header: 'Last Name' },
    { accessor: 'email', header: 'Email', width: 260 },
    { accessor: 'city', header: 'City' },
    { accessor: 'salary', header: 'Salary', align: 'end', width: 140 },
  ];

  const data = makeData(10_000);
</script>

<Story name="Ten thousand rows">
  <ShadcnHeadlessTable {columns} {data} enableVirtualization height={420} />
</Story>

<Story name="Taller rows">
  <ShadcnHeadlessTable {columns} {data} enableVirtualization height={420} estimatedRowHeight={56} />
</Story>
