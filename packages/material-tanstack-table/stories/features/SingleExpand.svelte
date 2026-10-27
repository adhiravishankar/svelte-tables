<script lang="ts">
  import type { Snippet } from 'svelte';
  import {
    MaterialSvelteTable,
    type MRT_ColumnDef,
    type MRT_ExpandedState,
    type MRT_Row,
  } from '../../src/lib';
  import type { Employee } from '../data';

  let {
    columns,
    data,
    detailPanel,
  }: {
    columns: MRT_ColumnDef<Employee>[];
    data: Employee[];
    detailPanel: Snippet<[{ row: MRT_Row<Employee> }]>;
  } = $props();

  let expanded = $state<MRT_ExpandedState>({});
</script>

<!-- only one detail panel is open at a time: opening another closes the first -->
<MaterialSvelteTable
  options={{
    columns,
    data,
    detailPanel,
    enableExpandAll: false,
    onExpandedChange: (updater) => {
      const next = typeof updater === 'function' ? updater(expanded) : updater;
      const open = Object.keys(next === true ? {} : next).filter(
        (id) => (next as Record<string, boolean>)[id],
      );
      // keep only the row that was just opened
      const previous = Object.keys(expanded === true ? {} : expanded);
      const added = open.find((id) => !previous.includes(id));
      expanded = added ? { [added]: true } : {};
    },
    state: {
      get expanded() {
        return expanded;
      },
    },
  }}
/>
