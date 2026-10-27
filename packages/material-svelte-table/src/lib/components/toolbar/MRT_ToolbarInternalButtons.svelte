<script lang="ts" generics="TData extends MRT_RowData">
  import type { HTMLAttributes } from 'svelte/elements';
  import type { MRT_RowData, MRT_TableInstance } from '../../types';
  import MRT_ToggleDensePaddingButton from '../buttons/MRT_ToggleDensePaddingButton.svelte';
  import MRT_ToggleFiltersButton from '../buttons/MRT_ToggleFiltersButton.svelte';
  import MRT_ToggleFullScreenButton from '../buttons/MRT_ToggleFullScreenButton.svelte';
  import MRT_ToggleGlobalFilterButton from '../buttons/MRT_ToggleGlobalFilterButton.svelte';

  let {
    table,
    ...rest
  }: { table: MRT_TableInstance<TData> } & HTMLAttributes<HTMLDivElement> =
    $props();

  const o = $derived(table.options);
</script>

<div class="mrt-internal-buttons" {...rest}>
  {#if o.toolbarInternalActions}
    {@render o.toolbarInternalActions({ table })}
  {:else}
    {#if o.enableFilters && o.enableGlobalFilter && !o.initialState?.showGlobalFilter}
      <MRT_ToggleGlobalFilterButton {table} />
    {/if}
    {#if o.enableFilters && o.enableColumnFilters && o.columnFilterDisplayMode !== 'popover'}
      <MRT_ToggleFiltersButton {table} />
    {/if}
    {#if o.enableDensityToggle}
      <MRT_ToggleDensePaddingButton {table} />
    {/if}
    {#if o.enableFullScreenToggle}
      <MRT_ToggleFullScreenButton {table} />
    {/if}
  {/if}
</div>

<style>
  .mrt-internal-buttons {
    align-items: center;
    display: flex;
    z-index: 3;
  }
</style>
