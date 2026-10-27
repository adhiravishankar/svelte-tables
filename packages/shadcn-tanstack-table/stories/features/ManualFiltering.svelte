<script lang="ts">
  import {
    ShadcnSvelteTable,
    type MRT_ColumnFiltersState,
  } from '../../src/lib';
  import { employeeColumns, employees } from '../data';

  // With `manualFiltering` the table does not filter: you do, e.g. on a server.
  // Here the "server" is a function over the same data.
  let columnFilters = $state<MRT_ColumnFiltersState>([]);

  const data = $derived(
    employees.filter((row) =>
      columnFilters.every(({ id, value }) =>
        String((row as Record<string, unknown>)[id])
          .toLowerCase()
          .includes(String(value).toLowerCase()),
      ),
    ),
  );
</script>

<p>Filters sent to the "server": <code>{JSON.stringify(columnFilters)}</code> → {data.length} rows</p>
<ShadcnSvelteTable
  options={{
    columns: employeeColumns,
    get data() {
      return data;
    },
    initialState: { showColumnFilters: true },
    manualFiltering: true,
    onColumnFiltersChange: (updater) => {
      columnFilters = typeof updater === 'function' ? updater(columnFilters) : updater;
    },
    state: {
      get columnFilters() {
        return columnFilters;
      },
    },
  }}
/>
