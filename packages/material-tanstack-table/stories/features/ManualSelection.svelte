<script lang="ts">
  import {
    MaterialSvelteTable,
    type MRT_RowSelectionState,
  } from '../../src/lib';
  import { people, personColumns } from '../data';

  // you own the selection; the table follows it
  let rowSelection = $state<MRT_RowSelectionState>({ '1': true, '3': true });
</script>

<p>
  Selected row ids: <code>{Object.keys(rowSelection).filter((id) => rowSelection[id]).join(', ') || '(none)'}</code>
  <button onclick={() => (rowSelection = {})}>Clear</button>
</p>
<MaterialSvelteTable
  options={{
    columns: personColumns,
    data: people,
    enableRowSelection: true,
    onRowSelectionChange: (updater) => {
      rowSelection = typeof updater === 'function' ? updater(rowSelection) : updater;
    },
    state: {
      get rowSelection() {
        return rowSelection;
      },
    },
  }}
/>
