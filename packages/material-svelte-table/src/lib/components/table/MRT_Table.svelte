<script lang="ts" generics="TData extends MRT_RowData">
  import type { HTMLAttributes } from 'svelte/elements';
  import type { MRT_RowData, MRT_TableInstance } from '../../types';
  import {
    isGridLayout,
    mergeStyles,
    parseCSSVarId,
  } from '../../utils/style.utils';
  import { parseFromValuesOrFunc } from '../../utils/utils';
  import MRT_TableBody from '../body/MRT_TableBody.svelte';
  import MRT_TableFooter from '../footer/MRT_TableFooter.svelte';
  import MRT_TableHead from '../head/MRT_TableHead.svelte';

  let {
    table,
    ...rest
  }: { table: MRT_TableInstance<TData> } & HTMLAttributes<HTMLTableElement> =
    $props();

  const tableProps = $derived({
    ...parseFromValuesOrFunc(table.options.tableProps, { table }),
    ...rest,
  });

  // Column widths are CSS variables so resizing never re-renders cells.
  const columnSizeVars = $derived.by(() => {
    const vars: Record<string, number> = {};
    for (const header of table.getFlatHeaders()) {
      const size = header.getSize();
      vars[`--header-${parseCSSVarId(header.id)}-size`] = size;
      vars[`--col-${parseCSSVarId(header.column.id)}-size`] = size;
    }
    return vars;
  });

  const stickyHeader = $derived(
    table.options.enableStickyHeader || table.mrtState.isFullScreen,
  );
  const caption = $derived(table.options.caption);
</script>

<table
  {...tableProps}
  class={[
    'mrt-table',
    stickyHeader && 'mrt-table-sticky-header',
    tableProps.class,
  ]}
  style={mergeStyles(
    columnSizeVars,
    { display: isGridLayout(table.options.layoutMode) ? 'grid' : undefined },
    tableProps.style,
  )}
>
  {#if caption}
    <caption>{@render caption({ table })}</caption>
  {/if}
  {#if table.options.enableTableHead}
    <MRT_TableHead {table} />
  {/if}
  <MRT_TableBody {table} />
  {#if table.options.enableTableFooter}
    <MRT_TableFooter {table} />
  {/if}
</table>

<style>
  .mrt-table {
    border-collapse: separate;
    border-spacing: 0;
    font-family: var(--mdc-typography-body2-font-family, Roboto, sans-serif);
    font-size: 0.875rem;
    line-height: 1.43;
    position: relative;
    width: 100%;
  }
</style>
