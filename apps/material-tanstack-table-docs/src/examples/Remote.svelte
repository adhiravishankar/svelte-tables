<script lang="ts">
  import {
    MaterialSvelteTable,
    type MRT_ColumnDef,
    type MRT_ColumnFiltersState,
    type MRT_PaginationState,
    type MRT_SortingState,
  } from 'material-svelte-tanstack-table';
  import { fetchPeople } from '../data/fakeApi';
  import type { Person } from '../data/makeData';

  const columns: MRT_ColumnDef<Person>[] = [
    { accessorKey: 'firstName', header: 'First Name' },
    { accessorKey: 'lastName', header: 'Last Name' },
    { accessorKey: 'email', header: 'Email', size: 260 },
    { accessorKey: 'state', header: 'State' },
    { accessorKey: 'age', header: 'Age', size: 100 },
  ];

  // The table does not page, sort or filter: the "server" does. The table
  // reports what the user asked for, and shows what comes back.
  let data = $state<Person[]>([]);
  let rowCount = $state(0);
  let isLoading = $state(true);
  let isRefetching = $state(false);
  let isError = $state(false);

  let columnFilters = $state<MRT_ColumnFiltersState>([]);
  let globalFilter = $state('');
  let sorting = $state<MRT_SortingState>([]);
  let pagination = $state<MRT_PaginationState>({ pageIndex: 0, pageSize: 10 });

  // runs again whenever any of the state read inside it changes
  $effect(() => {
    const query = {
      filters: $state.snapshot(columnFilters),
      globalFilter,
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
      sorting: $state.snapshot(sorting),
    };
    let stale = false;
    isRefetching = true;
    isError = false;
    fetchPeople(query)
      .then((result) => {
        if (stale) return; // a newer request replaced this one
        data = result.rows;
        rowCount = result.rowCount;
      })
      .catch(() => !stale && (isError = true))
      .finally(() => {
        if (stale) return;
        isLoading = false;
        isRefetching = false;
      });
    return () => (stale = true);
  });

  const apply =
    <T,>(get: () => T, set: (value: T) => void) =>
    (updater: T | ((old: T) => T)) =>
      set(typeof updater === 'function' ? (updater as (old: T) => T)(get()) : updater);
</script>

{#if isError}
  <p role="alert" style="color: tomato">Could not load the data. Change a filter to try again.</p>
{/if}
<MaterialSvelteTable
  options={{
    columns,
    get data() {
      return data;
    },
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
    onColumnFiltersChange: apply(() => columnFilters, (v) => (columnFilters = v)),
    onGlobalFilterChange: apply(() => globalFilter, (v) => (globalFilter = v)),
    onPaginationChange: apply(() => pagination, (v) => (pagination = v)),
    onSortingChange: apply(() => sorting, (v) => (sorting = v)),
    get rowCount() {
      return rowCount;
    },
    state: {
      get columnFilters() {
        return columnFilters;
      },
      get globalFilter() {
        return globalFilter;
      },
      get isLoading() {
        return isLoading;
      },
      get pagination() {
        return pagination;
      },
      get showProgressBars() {
        return isRefetching;
      },
      get sorting() {
        return sorting;
      },
    },
  }}
/>
