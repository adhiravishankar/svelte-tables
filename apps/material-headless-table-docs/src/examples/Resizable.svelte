<script lang="ts">
  import { MaterialHeadlessTable, type HeadlessColumnDef } from 'material-svelte-headless-table';
  import { type Person, makeData } from '../data/makeData';

  const columns: HeadlessColumnDef<Person>[] = [
    { accessor: 'firstName', header: 'First Name', width: 160, minWidth: 80 },
    { accessor: 'lastName', header: 'Last Name', width: 160, minWidth: 80 },
    { accessor: 'email', header: 'Email', width: 280, minWidth: 120 },
    { accessor: 'city', header: 'City', width: 160, minWidth: 80 },
  ];

  const data = makeData(30);
</script>

<MaterialHeadlessTable {columns} {data} enableColumnResizing striped initialState={{ pageSize: 5 }} pageSizes={[5, 10]} />
