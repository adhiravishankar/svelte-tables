<script lang="ts">
  import { ShadcnHeadlessTable, type HeadlessColumnDef } from 'shadcn-svelte-headless-table';
  import { type Person, makeData } from '../data/makeData';

  const columns: HeadlessColumnDef<Person>[] = [
    { accessor: 'firstName', header: 'First Name' },
    { accessor: 'lastName', header: 'Last Name' },
    { accessor: 'email', header: 'Email', width: 260 },
    { accessor: 'city', header: 'City' },
    { accessor: 'salary', header: 'Salary', align: 'end', width: 140 },
  ];

  // 10,000 rows, of which only the ones in view are in the DOM.
  const data = makeData(10_000);
</script>

<ShadcnHeadlessTable {columns} {data} enableVirtualization height={420} />
