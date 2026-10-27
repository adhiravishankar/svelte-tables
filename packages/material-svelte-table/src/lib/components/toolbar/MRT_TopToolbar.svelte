<script lang="ts" generics="TData extends MRT_RowData">
  import type { HTMLAttributes } from 'svelte/elements';
  import type { MRT_RowData, MRT_TableInstance } from '../../types';
  import { attachRef } from '../../utils/refs';
  import { createMediaQuery } from '../../utils/mediaQuery.svelte';
  import { getCommonToolbarStyles, mergeStyles } from '../../utils/style.utils';
  import { parseFromValuesOrFunc } from '../../utils/utils';
  import MRT_GlobalFilterTextField from '../inputs/MRT_GlobalFilterTextField.svelte';
  import MRT_LinearProgressBar from './MRT_LinearProgressBar.svelte';
  import MRT_TablePagination from './MRT_TablePagination.svelte';
  import MRT_ToolbarAlertBanner from './MRT_ToolbarAlertBanner.svelte';
  import MRT_ToolbarInternalButtons from './MRT_ToolbarInternalButtons.svelte';

  let {
    table,
    ...rest
  }: { table: MRT_TableInstance<TData> } & HTMLAttributes<HTMLDivElement> =
    $props();

  const isMobile = createMediaQuery('(max-width: 720px)');
  const isTablet = createMediaQuery('(max-width: 1024px)');

  const toolbarProps = $derived({
    ...parseFromValuesOrFunc(table.options.topToolbarProps, { table }),
    ...rest,
  });

  const o = $derived(table.options);
  const isFullScreen = $derived(table.mrtState.isFullScreen);
  const showGlobalFilter = $derived(table.mrtState.showGlobalFilter);
  const stackAlertBanner = $derived(
    isMobile.current ||
      !!o.topToolbarCustomActions ||
      (showGlobalFilter && isTablet.current),
  );
  const globalFilterStyle = $derived(isTablet.current ? undefined : 'z-index: 2');
</script>

{#snippet globalFilter()}
  <div style={globalFilterStyle}>
    <MRT_GlobalFilterTextField {table} />
  </div>
{/snippet}

<div
  {...toolbarProps}
  {@attach attachRef(table.refs.topToolbarRef)}
  class={['mrt-toolbar', toolbarProps.class]}
  style={mergeStyles(
    getCommonToolbarStyles({ table }),
    {
      position: isFullScreen ? 'sticky' : 'relative',
      top: isFullScreen ? '0' : undefined,
    },
    toolbarProps.style,
  )}
>
  {#if o.positionToolbarAlertBanner === 'top'}
    <MRT_ToolbarAlertBanner {stackAlertBanner} {table} />
  {/if}
  <div class="mrt-toolbar-row" class:mrt-stacked={stackAlertBanner}>
    {#if o.enableGlobalFilter && o.positionGlobalFilter === 'left'}
      {@render globalFilter()}
    {/if}
    {#if o.topToolbarCustomActions}
      {@render o.topToolbarCustomActions({ table })}
    {:else}
      <span></span>
    {/if}
    {#if o.enableToolbarInternalActions}
      <div class="mrt-toolbar-actions">
        {#if o.enableGlobalFilter && o.positionGlobalFilter === 'right'}
          {@render globalFilter()}
        {/if}
        <MRT_ToolbarInternalButtons {table} />
      </div>
    {:else if o.enableGlobalFilter && o.positionGlobalFilter === 'right'}
      {@render globalFilter()}
    {/if}
  </div>
  {#if o.enablePagination && ['both', 'top'].includes(o.positionPagination ?? '')}
    <MRT_TablePagination position="top" {table} />
  {/if}
  <MRT_LinearProgressBar isTopToolbar {table} />
</div>

<style>
  .mrt-toolbar-row {
    align-items: flex-start;
    box-sizing: border-box;
    display: flex;
    gap: 0.5rem;
    justify-content: space-between;
    padding: 0.5rem;
    position: absolute;
    right: 0;
    top: 0;
    width: 100%;
  }
  .mrt-toolbar-row.mrt-stacked {
    position: relative;
  }
  .mrt-toolbar-actions {
    align-items: center;
    display: flex;
    flex-wrap: wrap-reverse;
    gap: 0.5rem;
    justify-content: flex-end;
  }
</style>
