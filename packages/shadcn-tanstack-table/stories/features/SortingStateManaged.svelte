<script lang="ts">
  import {
    ShadcnSvelteTable,
    type MRT_ColumnDef,
    type MRT_SortingState,
  } from '../../src/lib';
  import type { Person } from '../data';

  let { columns, data }: { columns: MRT_ColumnDef<Person>[]; data: Person[] } = $props();

  // controlled state: you own it, and the table follows it
  let sorting = $state<MRT_SortingState>([]);
</script>

<p>Sorting: <code>{JSON.stringify(sorting)}</code></p>
<ShadcnSvelteTable
  options={{
    columns,
    data,
    onSortingChange: (updater) => {
      sorting = typeof updater === 'function' ? updater(sorting) : updater;
    },
    state: {
      get sorting() {
        return sorting;
      },
    },
  }}
/>
