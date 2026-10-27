<script lang="ts">
  import {
    MaterialSvelteTable,
    type MRT_ColumnOrderState,
  } from '../../src/lib';
  import { people, personColumns } from '../data';

  // The order is yours. This version keeps one column pinned in first place, no
  // matter where the user drags the others.
  const fixedFirst = 'firstName';
  let columnOrder = $state<MRT_ColumnOrderState>([
    fixedFirst,
    'lastName',
    'address',
    'state',
    'phoneNumber',
  ]);
</script>

<p>Order: <code>{columnOrder.join(' → ')}</code> (first name always stays first)</p>
<MaterialSvelteTable
  options={{
    columns: personColumns,
    data: people.slice(0, 20),
    enableColumnOrdering: true,
    onColumnOrderChange: (updater) => {
      const next = typeof updater === 'function' ? updater(columnOrder) : updater;
      columnOrder = [fixedFirst, ...next.filter((id) => id !== fixedFirst)];
    },
    state: {
      get columnOrder() {
        return columnOrder;
      },
    },
  }}
/>
