<script lang="ts">
  import {
    MaterialSvelteTable,
    type MRT_GroupingState,
  } from '../../src/lib';
  import { employees } from '../data';

  let grouping = $state<MRT_GroupingState>(['state']);
</script>

<p>
  Grouped by: <code>{grouping.join(', ') || '(nothing)'}</code>
  <button onclick={() => (grouping = ['gender', 'state'])}>Group by gender, then state</button>
  <button onclick={() => (grouping = [])}>Ungroup</button>
</p>
<MaterialSvelteTable
  options={{
    columns: [
      { accessorKey: 'state', header: 'State' },
      { accessorKey: 'gender', header: 'Gender' },
      { accessorKey: 'firstName', header: 'First Name' },
      { accessorKey: 'lastName', header: 'Last Name' },
    ],
    data: employees,
    enableGrouping: true,
    onGroupingChange: (updater) => {
      grouping = typeof updater === 'function' ? updater(grouping) : updater;
    },
    state: {
      get grouping() {
        return grouping;
      },
    },
  }}
/>
