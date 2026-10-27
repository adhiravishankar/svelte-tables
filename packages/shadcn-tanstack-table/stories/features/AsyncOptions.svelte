<script lang="ts">
  import { onMount } from 'svelte';
  import {
    MRT_ActionMenuItem,
    ShadcnSvelteTable,
    type MRT_ColumnDef,
    type MRT_Row,
    type MRT_TableInstance,
  } from '../../src/lib';
  import { type Employee, employees } from '../data';

  // Options that arrive after the table is already rendered. Each mode used to
  // leave the table with stale values, so these double as regression scenarios.
  let {
    mode,
  }: {
    mode:
      | 'delayedFacets'
      | 'editOptions'
      | 'filterModes'
      | 'filterOptions'
      | 'outOfBounds'
      | 'rowActionMenu'
      | 'rowActions';
  } = $props();

  let data = $state<Employee[]>([]);
  let genders = $state<string[]>([]);
  let filterModes = $state<string[]>([]);

  onMount(() => {
    const timer = setTimeout(() => {
      data = mode === 'outOfBounds' ? employees.slice(0, 12) : employees.slice(0, 30);
      genders = ['Female', 'Male'];
      filterModes = ['contains', 'startsWith', 'equals'];
    }, 800);
    return () => clearTimeout(timer);
  });

  const columns = $derived<MRT_ColumnDef<Employee>[]>([
    { accessorKey: 'firstName', header: 'First Name' },
    {
      accessorKey: 'gender',
      columnFilterModeOptions: mode === 'filterModes' ? filterModes : undefined,
      editSelectOptions: mode === 'editOptions' ? genders : undefined,
      editVariant: mode === 'editOptions' ? 'select' : 'text',
      enableColumnFilterModes: mode === 'filterModes',
      filterSelectOptions: mode === 'filterOptions' ? genders : undefined,
      filterVariant: mode === 'filterOptions' ? 'select' : 'text',
      header: 'Gender',
    },
    { accessorKey: 'state', header: 'State' },
  ]);
</script>

{#snippet rowActions(ctx: { row: MRT_Row<Employee> })}
  <button onclick={() => alert(ctx.row.original.firstName)}>Hi</button>
{/snippet}

{#snippet rowActionMenuItems(ctx: {
  closeMenu: () => void;
  row: MRT_Row<Employee>;
  table: MRT_TableInstance<Employee>;
})}
  {#each genders as gender (gender)}
    <MRT_ActionMenuItem label={gender} onclick={ctx.closeMenu} table={ctx.table} />
  {/each}
{/snippet}

<ShadcnSvelteTable
  options={{
    get columns() {
      return columns;
    },
    get data() {
      return data;
    },
    editDisplayMode: 'table',
    enableEditing: mode === 'editOptions',
    enableFacetedValues: mode === 'delayedFacets',
    enableRowActions: mode === 'rowActions' || mode === 'rowActionMenu',
    initialState: {
      pagination: { pageIndex: mode === 'outOfBounds' ? 1 : 0, pageSize: 10 },
      showColumnFilters: mode === 'filterOptions' || mode === 'delayedFacets' || mode === 'filterModes',
    },
    rowActionMenuItems: mode === 'rowActionMenu' ? rowActionMenuItems : undefined,
    rowActions: mode === 'rowActions' ? rowActions : undefined,
    state: {
      get isLoading() {
        return data.length === 0;
      },
    },
  }}
/>
