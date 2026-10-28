<script lang="ts">
  import { ShadcnHeadlessTable, type HeadlessColumnDef } from 'shadcn-svelte-headless-table';
  import { type Person, makeData } from '../data/makeData';

  const columns: HeadlessColumnDef<Person>[] = [
    { accessor: 'firstName', header: 'First Name' },
    { accessor: 'lastName', header: 'Last Name' },
    { accessor: 'state', header: 'State' },
    { accessor: 'age', header: 'Age', width: 100, align: 'end' },
  ];

  const data = makeData(40);
</script>

<ShadcnHeadlessTable
  {columns}
  {data}
  enableRowSelection
  initialState={{ pageSize: 5 }}
  pageSizes={[5, 10, 25]}
/>
