<script lang="ts">
  import { MaterialHeadlessTable, type HeadlessColumnDef } from 'material-svelte-headless-table';
  import { type Person, makeData } from '../data/makeData';

  // Columns and data should be stable, so define them once.
  const columns: HeadlessColumnDef<Person>[] = [
    { accessor: 'firstName', header: 'First Name' },
    { accessor: 'lastName', header: 'Last Name' },
    { accessor: 'email', header: 'Email', width: 260 },
    { accessor: 'state', header: 'State' },
    { accessor: 'age', header: 'Age', width: 100, align: 'end' },
  ];

  const data = makeData(60);
</script>

<MaterialHeadlessTable {columns} {data} />
