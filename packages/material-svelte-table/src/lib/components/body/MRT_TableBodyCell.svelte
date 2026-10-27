<script lang="ts" generics="TData extends MRT_RowData">
  import { untrack } from 'svelte';
  import type { HTMLTdAttributes } from 'svelte/elements';
  import type { MRT_Cell, MRT_RowData, MRT_TableInstance } from '../../types';
  import {
    cellKeyboardShortcuts,
    isCellEditable,
    openEditingCell,
  } from '../../utils/cell.utils';
  import {
    getCellPadding,
    getCommonMRTCellStyles,
    getPinnedEdge,
    isGridLayout,
    mergeStyles,
  } from '../../utils/style.utils';
  import { parseFromValuesOrFunc } from '../../utils/utils';
  import MRT_TableBodyCellValue from './MRT_TableBodyCellValue.svelte';

  let {
    cell,
    staticColumnIndex,
    staticRowIndex,
    table,
    ...rest
  }: {
    cell: MRT_Cell<TData>;
    staticColumnIndex?: number;
    staticRowIndex: number;
    table: MRT_TableInstance<TData>;
  } & HTMLTdAttributes = $props();

  const column = $derived(cell.column);
  const row = $derived(cell.row);
  const columnDef = $derived(column.columnDef);
  const columnDefType = $derived(columnDef.columnDefType);

  const cellProps = $derived.by(() => {
    const args = { cell, column, row, table };
    return {
      ...parseFromValuesOrFunc(table.options.tableBodyCellProps, args),
      ...parseFromValuesOrFunc(columnDef.tableBodyCellProps, args),
      ...rest,
    };
  });

  const grid = $derived(isGridLayout(table.options.layoutMode));
  const density = $derived(table.mrtState.density);
  const isLoading = $derived(table.mrtState.isLoading);
  const showSkeletons = $derived(table.mrtState.showSkeletons);
  const showSkeleton = $derived(
    showSkeletons !== false && (isLoading || showSkeletons),
  );
  const isColumnPinned = $derived(
    table.options.enableColumnPinning &&
      columnDefType !== 'group' &&
      column.getIsPinned(),
  );
  const isRightClickable = $derived(
    parseFromValuesOrFunc(table.options.enableCellActions, cell),
  );
  const isEditable = $derived(isCellEditable({ cell, table }));
  const isActionCell = $derived(table.mrtState.actionCell?.id === cell.id);

  // random skeleton width, fixed for the lifetime of the cell
  const skeletonWidth = untrack(() => {
    const size = column.getSize();
    return columnDefType === 'display'
      ? size / 2
      : Math.round(Math.random() * (size - size / 3) + size / 3);
  });

  const rowNumber = $derived.by(() => {
    const { pageIndex, pageSize } = table.atoms.pagination.get();
    return (
      (table.options.rowNumberDisplayMode === 'static'
        ? (staticRowIndex || 0) + (pageSize || 0) * (pageIndex || 0)
        : row.index) + 1
    );
  });

  function onkeydown(event: KeyboardEvent & { currentTarget: HTMLTableCellElement }) {
    cellProps.onkeydown?.(event as any);
    cellKeyboardShortcuts({
      cell,
      cellValue: cell.getValue<string>(),
      event,
      table,
    });
  }

  function ondblclick(event: MouseEvent & { currentTarget: HTMLTableCellElement }) {
    cellProps.ondblclick?.(event as any);
    openEditingCell({ cell, table });
  }

  function oncontextmenu(event: MouseEvent & { currentTarget: HTMLTableCellElement }) {
    cellProps.oncontextmenu?.(event as any);
    if (isRightClickable) {
      event.preventDefault();
      table.setActionCell(cell);
      table.refs.actionCellRef.current = event.currentTarget;
    }
  }
</script>

<td
  data-index={staticColumnIndex}
  data-pinned={!!isColumnPinned || undefined}
  data-pinned-edge={isColumnPinned ? getPinnedEdge(column) : undefined}
  tabindex={table.options.enableKeyboardShortcuts ? 0 : undefined}
  {...cellProps}
  {onkeydown}
  {ondblclick}
  {oncontextmenu}
  class={['mrt-body-cell', isActionCell && 'mrt-action-cell', cellProps.class]}
  style={mergeStyles(
    {
      alignItems: grid ? 'center' : undefined,
      cursor: isRightClickable
        ? 'context-menu'
        : isEditable && table.options.editDisplayMode === 'cell'
          ? 'pointer'
          : 'inherit',
      overflow: 'hidden',
      padding: getCellPadding({ columnDefType, density, kind: 'body' }),
      textAlign: 'start',
      textOverflow: columnDefType !== 'display' ? 'ellipsis' : undefined,
      whiteSpace: row.getIsPinned() || density === 'compact' ? 'nowrap' : 'normal',
    },
    getCommonMRTCellStyles({ column, table }),
    cellProps.style,
  )}
>
  {#if cell.getIsPlaceholder()}
    {#if columnDef.PlaceholderCell}
      {@render columnDef.PlaceholderCell({ cell, column, row, table })}
    {/if}
  {:else if showSkeleton}
    <span class="mrt-skeleton" style:width="{skeletonWidth}px"></span>
  {:else if columnDefType === 'display' && (['mrt-row-expand', 'mrt-row-numbers', 'mrt-row-select'].includes(column.id) || !row.getIsGrouped())}
    {#if columnDef.Cell}
      {@render columnDef.Cell({
        cell,
        column,
        renderedCellValue: cell.renderValue(),
        row,
        staticColumnIndex,
        staticRowIndex,
        table,
      })}
    {:else if column.id === 'mrt-row-numbers'}
      {rowNumber}
    {/if}
  {:else}
    <MRT_TableBodyCellValue {cell} {staticColumnIndex} {staticRowIndex} {table} />
  {/if}
  {#if cell.getIsGrouped() && !columnDef.GroupedCell}
    {' '}({row.subRows?.length})
  {/if}
</td>

<style>
  .mrt-body-cell {
    border-bottom: 1px solid var(--mrt-divider);
    box-sizing: border-box;
    color: var(--mdc-theme-on-surface, rgba(0, 0, 0, 0.87));
    z-index: 0;
  }
  .mrt-body-cell:hover {
    text-overflow: clip;
  }
  .mrt-body-cell:focus-visible {
    outline: 2px solid var(--mdc-theme-primary, #6200ee);
    outline-offset: -2px;
  }
  .mrt-action-cell {
    outline: 1px solid var(--mrt-divider);
    outline-offset: -1px;
  }
  /* row selected / pinned / hover tint, painted behind the content */
  .mrt-body-cell::after {
    background-color: var(--mrt-row-highlight, transparent);
    content: '';
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    width: 100%;
    z-index: -1;
  }
  :global(.mrt-body-row:hover) > .mrt-body-cell::after {
    background-color: var(
      --mrt-row-highlight-hover,
      color-mix(in srgb, var(--mdc-theme-on-surface, #000) 6%, transparent)
    );
  }
  .mrt-skeleton {
    animation: mrt-skeleton-wave 1.5s ease-in-out infinite;
    background: linear-gradient(
      90deg,
      var(--mrt-divider),
      color-mix(in srgb, var(--mdc-theme-on-surface, #000) 4%, transparent),
      var(--mrt-divider)
    );
    background-size: 200% 100%;
    border-radius: 4px;
    display: block;
    height: 20px;
    max-width: 100%;
  }
  @keyframes mrt-skeleton-wave {
    from {
      background-position: 200% 0;
    }
    to {
      background-position: -200% 0;
    }
  }
</style>
