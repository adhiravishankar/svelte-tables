<script lang="ts">
  import { MaterialHeadlessTable, type CellContext, type HeadlessColumnDef } from 'material-svelte-headless-table';
  import { type Person, makeData } from '../data/makeData';

  const columns: HeadlessColumnDef<Person>[] = [
    { accessor: 'firstName', header: 'First Name' },
    { accessor: 'lastName', header: 'Last Name' },
    { accessor: 'state', header: 'State' },
  ];

  const data = makeData(20);
</script>

{#snippet detail({ row }: CellContext<Person>)}
  <p><strong>{row.firstName} {row.lastName}</strong> lives in {row.city}, {row.state}.</p>
  <p>Email: {row.email}</p>
{/snippet}

<MaterialHeadlessTable {columns} {data} renderDetailPanel={detail} initialState={{ pageSize: 5 }} pageSizes={[5, 10]} />
