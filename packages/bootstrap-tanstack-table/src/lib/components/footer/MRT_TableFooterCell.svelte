<script lang="ts" generics="TData extends MRT_RowData">
  import type { HTMLTdAttributes } from 'svelte/elements';
  import type { MRT_Header, MRT_RowData, MRT_TableInstance } from '../../types';
  import { cellKeyboardShortcuts } from '../../utils/cell.utils';
  import {
    getCellPadding,
    getCommonMRTCellStyles,
    getPinnedEdge,
    mergeStyles,
  } from '../../utils/style.utils';
  import { parseFromValuesOrFunc } from '../../utils/utils';

  let {
    footer,
    staticColumnIndex,
    table,
    ...rest
  }: {
    footer: MRT_Header<TData>;
    staticColumnIndex?: number;
    table: MRT_TableInstance<TData>;
  } & HTMLTdAttributes = $props();

  const column = $derived(footer.column);
  const columnDef = $derived(column.columnDef);
  const columnDefType = $derived(columnDef.columnDefType);

  const cellProps = $derived.by(() => {
    const args = { column, table };
    return {
      ...parseFromValuesOrFunc(table.options.tableFooterCellProps, args),
      ...parseFromValuesOrFunc(columnDef.tableFooterCellProps, args),
      ...rest,
    };
  });

  const isColumnPinned = $derived(
    table.options.enableColumnPinning &&
      columnDefType !== 'group' &&
      column.getIsPinned(),
  );
  const align = $derived(columnDefType === 'group' ? 'center' : 'start');

  function onkeydown(event: KeyboardEvent & { currentTarget: HTMLTableCellElement }) {
    cellProps.onkeydown?.(event as any);
    cellKeyboardShortcuts({ cellValue: columnDef.footer, event, table });
  }
</script>

<td
  colspan={footer.colSpan}
  data-index={staticColumnIndex}
  data-pinned={!!isColumnPinned || undefined}
  data-pinned-edge={isColumnPinned ? getPinnedEdge(column) : undefined}
  tabindex={table.options.enableKeyboardShortcuts ? 0 : undefined}
  {...cellProps}
  {onkeydown}
  class={['mrt-footer-cell', cellProps.class]}
  style={mergeStyles(
    {
      fontWeight: 'bold',
      padding: getCellPadding({
        columnDefType,
        density: table.mrtState.density,
        kind: 'footer',
      }),
      textAlign: align,
      verticalAlign: 'top',
    },
    getCommonMRTCellStyles({ align, column, header: footer, table }),
    cellProps.style,
  )}
>
  {#if !footer.isPlaceholder}
    {#if columnDef.Footer}
      {@render columnDef.Footer({ column, footer, table })}
    {:else}
      {columnDef.footer ?? ''}
    {/if}
  {/if}
</td>

<style>
  .mrt-footer-cell {
    border-bottom: 1px solid var(--mrt-divider);
    box-sizing: border-box;
    color: var(--foreground);
  }
  .mrt-footer-cell:focus-visible {
    outline: 2px solid var(--primary);
    outline-offset: -2px;
  }
</style>
