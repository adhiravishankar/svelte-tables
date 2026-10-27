<script lang="ts">
  import {
    ShadcnSvelteTable,
    type MRT_ColumnOrderState,
  } from '../../src/lib';
  import { people, personColumns } from '../data';

  let columnOrder = $state<MRT_ColumnOrderState>([
    'phoneNumber',
    'state',
    'address',
    'lastName',
    'firstName',
  ]);
</script>

<p>
  Order: <code>{columnOrder.join(' → ')}</code>
  <button onclick={() => (columnOrder = [...columnOrder].reverse())}>Reverse</button>
</p>
<ShadcnSvelteTable
  options={{
    columns: personColumns,
    data: people,
    enableColumnOrdering: true,
    onColumnOrderChange: (updater) => {
      columnOrder = typeof updater === 'function' ? updater(columnOrder) : updater;
    },
    state: {
      get columnOrder() {
        return columnOrder;
      },
    },
  }}
/>
