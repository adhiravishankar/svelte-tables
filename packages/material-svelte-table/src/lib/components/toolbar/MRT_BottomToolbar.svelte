<script lang="ts" generics="TData extends MRT_RowData">
  import type { HTMLAttributes } from 'svelte/elements';
  import type { MRT_RowData, MRT_TableInstance } from '../../types';
  import { attachRef } from '../../utils/refs';
  import { createMediaQuery } from '../../utils/mediaQuery.svelte';
  import { getCommonToolbarStyles, mergeStyles } from '../../utils/style.utils';
  import { parseFromValuesOrFunc } from '../../utils/utils';
  import MRT_LinearProgressBar from './MRT_LinearProgressBar.svelte';
  import MRT_TablePagination from './MRT_TablePagination.svelte';
  import MRT_ToolbarDropZone from './MRT_ToolbarDropZone.svelte';
  import MRT_ToolbarAlertBanner from './MRT_ToolbarAlertBanner.svelte';

  let {
    table,
    ...rest
  }: { table: MRT_TableInstance<TData> } & HTMLAttributes<HTMLDivElement> =
    $props();

  const isMobile = createMediaQuery('(max-width: 720px)');

  const toolbarProps = $derived({
    ...parseFromValuesOrFunc(table.options.bottomToolbarProps, { table }),
    ...rest,
  });

  const o = $derived(table.options);
  const isFullScreen = $derived(table.mrtState.isFullScreen);
  const stackAlertBanner = $derived(
    isMobile.current || !!o.bottomToolbarCustomActions,
  );
</script>

<div
  {...toolbarProps}
  {@attach attachRef(table.refs.bottomToolbarRef)}
  class={['mrt-toolbar mrt-bottom-toolbar', toolbarProps.class]}
  style={mergeStyles(
    getCommonToolbarStyles({ table }),
    {
      bottom: isFullScreen ? '0' : undefined,
      boxShadow: '0 1px 2px -1px rgba(97, 97, 97, 0.5) inset',
      left: 0,
      position: isFullScreen ? 'fixed' : 'relative',
      right: 0,
    },
    toolbarProps.style,
  )}
>
  <MRT_LinearProgressBar isTopToolbar={false} {table} />
  {#if o.positionToolbarAlertBanner === 'bottom'}
    <MRT_ToolbarAlertBanner {stackAlertBanner} {table} />
  {/if}
  {#if ['both', 'bottom'].includes(o.positionToolbarDropZone ?? '')}
    <MRT_ToolbarDropZone {table} />
  {/if}
  <div class="mrt-toolbar-row">
    {#if o.bottomToolbarCustomActions}
      {@render o.bottomToolbarCustomActions({ table })}
    {:else}
      <span></span>
    {/if}
    <div class="mrt-bottom-pagination" class:mrt-stacked={stackAlertBanner}>
      {#if o.enablePagination && ['both', 'bottom'].includes(o.positionPagination ?? '')}
        <MRT_TablePagination position="bottom" {table} />
      {/if}
    </div>
  </div>
</div>

<style>
  .mrt-toolbar-row {
    align-items: center;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    padding: 0.5rem;
    width: 100%;
  }
  .mrt-bottom-pagination {
    display: flex;
    justify-content: flex-end;
    position: absolute;
    right: 0;
    top: 0;
  }
  .mrt-bottom-pagination.mrt-stacked {
    position: relative;
  }
</style>
