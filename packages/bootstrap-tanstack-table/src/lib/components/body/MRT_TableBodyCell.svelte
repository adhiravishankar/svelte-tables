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
  import MRT_CopyButton from '../buttons/MRT_CopyButton.svelte';
  import MRT_EditCellTextField from '../inputs/MRT_EditCellTextField.svelte';
  import MRT_DisplayCell from './MRT_DisplayCell.svelte';
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
  const isEditing = $derived(
    isEditable &&
      !['custom', 'modal'].includes(table.options.editDisplayMode as string) &&
      (table.options.editDisplayMode === 'table' ||
        table.mrtState.editingRow?.id === row.id ||
        table.mrtState.editingCell?.id === cell.id) &&
      !row.getIsGrouped(),
  );
  const isCreating = $derived(
    isEditable &&
      table.options.createDisplayMode === 'row' &&
      table.mrtState.creatingRow?.id === row.id,
  );
  const showClickToCopyButton = $derived(
    (parseFromValuesOrFunc(table.options.enableClickToCopy, cell) === true ||
      parseFromValuesOrFunc(columnDef.enableClickToCopy, cell) === true) &&
      !['context-menu', false].includes(
        parseFromValuesOrFunc(columnDef.enableClickToCopy, cell) as any,
      ),
  );
  const isActionCell = $derived(table.mrtState.actionCell?.id === cell.id);

  const draggingColumn = $derived(table.mrtState.draggingColumn);
  const hoveredColumn = $derived(table.mrtState.hoveredColumn);

  const draggingBorders = $derived.by(() => {
    const color = table.options.mrtTheme.draggingBorderColor;
    const { draggingRow, hoveredRow } = table.mrtState;
    const isDraggingColumn = draggingColumn?.id === column.id;
    const isHoveredColumn = hoveredColumn?.id === column.id;
    const isDraggingRow = draggingRow?.id === row.id;
    const isHoveredRow = hoveredRow?.id === row.id;
    const isFirstColumn = column.getIsFirstColumn();
    const isLastColumn = column.getIsLastColumn();
    const isLastRow = staticRowIndex === table.getRowModel().rows.length - 1;
    const resizing = table.atoms.columnResizing.get().isResizingColumn;
    const isResizingColumn = resizing === column.id;
    const showResizeBorder = isResizingColumn && table.options.columnResizeMode === 'onChange';

    const borderStyle = showResizeBorder
      ? `2px solid ${color} !important`
      : isDraggingColumn || isDraggingRow
        ? '1px dashed rgba(128, 128, 128, 0.8) !important'
        : isHoveredColumn || isHoveredRow || isResizingColumn
          ? `2px dashed ${color} !important`
          : undefined;

    if (showResizeBorder) {
      return table.options.columnResizeDirection === 'ltr'
        ? { borderRight: borderStyle }
        : { borderLeft: borderStyle };
    }
    return borderStyle
      ? {
          borderBottom:
            isDraggingRow || isHoveredRow || (isLastRow && !isResizingColumn)
              ? borderStyle
              : undefined,
          borderLeft:
            isDraggingColumn || isHoveredColumn || ((isDraggingRow || isHoveredRow) && isFirstColumn)
              ? borderStyle
              : undefined,
          borderRight:
            isDraggingColumn || isHoveredColumn || ((isDraggingRow || isHoveredRow) && isLastColumn)
              ? borderStyle
              : undefined,
          borderTop: isDraggingRow || isHoveredRow ? borderStyle : undefined,
        }
      : undefined;
  });

  function ondragenter(event: DragEvent & { currentTarget: HTMLTableCellElement }) {
    cellProps.ondragenter?.(event as any);
    if (table.options.enableGrouping && hoveredColumn?.id === 'drop-zone') {
      table.setHoveredColumn(null);
    }
    if (table.options.enableColumnOrdering && draggingColumn) {
      table.setHoveredColumn(columnDef.enableColumnOrdering !== false ? column : null);
    }
  }

  function ondragover(event: DragEvent & { currentTarget: HTMLTableCellElement }) {
    cellProps.ondragover?.(event as any);
    if (columnDef.enableColumnOrdering !== false) event.preventDefault();
  }

  // random skeleton width, fixed for the lifetime of the cell
  const skeletonWidth = untrack(() => {
    const size = column.getSize();
    return columnDefType === 'display'
      ? size / 2
      : Math.round(Math.random() * (size - size / 3) + size / 3);
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
  {ondragenter}
  {ondragover}
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
    draggingBorders,
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
    {:else}
      <MRT_DisplayCell {cell} {staticColumnIndex} {staticRowIndex} {table} />
    {/if}
  {:else if isCreating || isEditing}
    <MRT_EditCellTextField {cell} {table} />
  {:else if showClickToCopyButton && columnDef.enableClickToCopy !== false}
    <MRT_CopyButton {cell} {table}>
      <MRT_TableBodyCellValue {cell} {staticColumnIndex} {staticRowIndex} {table} />
    </MRT_CopyButton>
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
    color: var(--foreground);
    z-index: 0;
  }
  .mrt-body-cell:hover {
    text-overflow: clip;
  }
  .mrt-body-cell:focus-visible {
    outline: 2px solid var(--primary);
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
      color-mix(in srgb, var(--foreground) 6%, transparent)
    );
  }
  .mrt-skeleton {
    animation: mrt-skeleton-wave 1.5s ease-in-out infinite;
    background: linear-gradient(
      90deg,
      var(--mrt-divider),
      color-mix(in srgb, var(--foreground) 4%, transparent),
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
