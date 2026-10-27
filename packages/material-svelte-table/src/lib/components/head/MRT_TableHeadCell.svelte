<script lang="ts" generics="TData extends MRT_RowData">
  import { untrack } from 'svelte';
  import type { HTMLThAttributes } from 'svelte/elements';
  import { useColumnVirtualizer } from '../../hooks/createMRTVirtualizers.svelte';
  import type { MRT_Header, MRT_RowData, MRT_TableInstance } from '../../types';
  import { cellKeyboardShortcuts } from '../../utils/cell.utils';
  import {
    getCellPadding,
    getCommonMRTCellStyles,
    getPinnedEdge,
    isGridLayout,
    mergeStyles,
  } from '../../utils/style.utils';
  import { parseFromValuesOrFunc } from '../../utils/utils';
  import MRT_DisplayHeader from './MRT_DisplayHeader.svelte';
  import MRT_TableHeadCellColumnActionsButton from './MRT_TableHeadCellColumnActionsButton.svelte';
  import MRT_TableHeadCellGrabHandle from './MRT_TableHeadCellGrabHandle.svelte';
  import MRT_TableHeadCellResizeHandle from './MRT_TableHeadCellResizeHandle.svelte';
  import MRT_TableHeadCellFilterContainer from './MRT_TableHeadCellFilterContainer.svelte';
  import MRT_TableHeadCellFilterLabel from './MRT_TableHeadCellFilterLabel.svelte';
  import MRT_TableHeadCellSortLabel from './MRT_TableHeadCellSortLabel.svelte';

  let {
    header,
    staticColumnIndex,
    table,
    ...rest
  }: {
    header: MRT_Header<TData>;
    staticColumnIndex?: number;
    table: MRT_TableInstance<TData>;
  } & HTMLThAttributes = $props();

  const columnVirtualizer = useColumnVirtualizer();
  const column = $derived(header.column);
  const columnDef = $derived(column.columnDef);
  const columnDefType = $derived(columnDef.columnDefType);

  const cellProps = $derived({
    ...parseFromValuesOrFunc(table.options.tableHeadCellProps, {
      column,
      table,
    }),
    ...parseFromValuesOrFunc(columnDef.tableHeadCellProps, { column, table }),
    ...rest,
  });

  const grid = $derived(isGridLayout(table.options.layoutMode));
  const density = $derived(table.mrtState.density);
  const showColumnFilters = $derived(table.mrtState.showColumnFilters);
  const isColumnPinned = $derived(
    table.options.enableColumnPinning &&
      columnDefType !== 'group' &&
      column.getIsPinned(),
  );
  const sorted = $derived(column.getIsSorted());
  const showColumnActions = $derived(
    (table.options.enableColumnActions || columnDef.enableColumnActions) &&
      columnDef.enableColumnActions !== false,
  );
  const align = $derived(columnDefType === 'group' ? 'center' : 'start');

  const draggingColumn = $derived(table.mrtState.draggingColumn);
  const hoveredColumn = $derived(table.mrtState.hoveredColumn);
  const resizingColumn = $derived(table.atoms.columnResizing.get().isResizingColumn);
  const grouping = $derived(table.atoms.grouping.get());

  const showDragHandle = $derived(
    table.options.enableColumnDragging !== false &&
      columnDef.enableColumnDragging !== false &&
      (table.options.enableColumnDragging ||
        (table.options.enableColumnOrdering && columnDef.enableColumnOrdering !== false) ||
        (table.options.enableGrouping &&
          columnDef.enableGrouping !== false &&
          !grouping.includes(column.id))),
  );

  const draggingBorders = $derived.by(() => {
    const color = table.options.mrtTheme.draggingBorderColor;
    const showResizeBorder =
      resizingColumn === column.id &&
      table.options.columnResizeMode === 'onChange' &&
      !header.subHeaders.length;
    const borderStyle = showResizeBorder
      ? `2px solid ${color} !important`
      : draggingColumn?.id === column.id
        ? '1px dashed rgba(128, 128, 128, 0.8)'
        : hoveredColumn?.id === column.id
          ? `2px dashed ${color}`
          : undefined;
    if (showResizeBorder) {
      return table.options.columnResizeDirection === 'ltr'
        ? { borderRight: borderStyle }
        : { borderLeft: borderStyle };
    }
    return borderStyle
      ? { borderLeft: borderStyle, borderRight: borderStyle, borderTop: borderStyle }
      : undefined;
  });

  function ondragenter(event: DragEvent & { currentTarget: HTMLTableCellElement }) {
    cellProps.ondragenter?.(event as any);
    if (table.options.enableGrouping && hoveredColumn?.id === 'drop-zone') {
      table.setHoveredColumn(null);
    }
    if (table.options.enableColumnOrdering && draggingColumn && columnDefType !== 'group') {
      table.setHoveredColumn(columnDef.enableColumnOrdering !== false ? column : null);
    }
  }

  function ondragover(event: DragEvent & { currentTarget: HTMLTableCellElement }) {
    cellProps.ondragover?.(event as any);
    if (columnDef.enableColumnOrdering !== false) event.preventDefault();
  }

  const paddingBottom = $derived(
    columnDefType === 'display'
      ? '0'
      : showColumnFilters || density === 'compact'
        ? '0.4rem'
        : '0.6rem',
  );
  const paddingTop = $derived(
    columnDefType === 'group' || density === 'compact'
      ? '0.25rem'
      : density === 'comfortable'
        ? '0.75rem'
        : '1.25rem',
  );

  const headerLength = $derived(columnDef.header?.length ?? 0);

  function onkeydown(event: KeyboardEvent & { currentTarget: HTMLTableCellElement }) {
    cellProps.onkeydown?.(event as any);
    cellKeyboardShortcuts({
      cellValue: columnDef.header,
      event,
      header,
      table,
    });
  }

  function attach(node: HTMLTableCellElement) {
    const refs = table.refs.tableHeadCellRefs.current;
    if (refs) refs[column.id] = node;
    if (columnDefType !== 'group') {
      untrack(() => columnVirtualizer?.instance.measureElement(node));
    }
    return () => {
      if (refs) delete refs[column.id];
    };
  }
</script>

<th
  aria-sort={sorted ? (sorted === 'asc' ? 'ascending' : 'descending') : 'none'}
  colspan={header.colSpan}
  data-can-sort={column.getCanSort() || undefined}
  data-index={staticColumnIndex}
  data-pinned={!!isColumnPinned || undefined}
  data-pinned-edge={isColumnPinned ? getPinnedEdge(column) : undefined}
  data-sort={sorted || undefined}
  tabindex={table.options.enableKeyboardShortcuts ? 0 : undefined}
  {...cellProps}
  {onkeydown}
  {ondragenter}
  {ondragover}
  {@attach attach}
  class={['mrt-head-cell', cellProps.class]}
  style={mergeStyles(
    {
      flexDirection: grid ? 'column' : undefined,
      fontWeight: 'bold',
      overflow: 'visible',
      padding: getCellPadding({ columnDefType, density, kind: 'head' }),
      paddingBottom,
      paddingTop,
      textAlign: align,
      userSelect:
        table.options.enableMultiSort && column.getCanSort() ? 'none' : undefined,
      verticalAlign: 'top',
    },
    getCommonMRTCellStyles({ align, column, header, table }),
    draggingBorders,
    cellProps.style,
  )}
>
  {#if !header.isPlaceholder}
    <div class="mrt-head-cell-content">
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div
        class="mrt-head-cell-labels"
        class:mrt-clickable={column.getCanSort() && columnDefType !== 'group'}
        style:overflow={columnDefType === 'data' ? 'hidden' : undefined}
        onclick={column.getToggleSortingHandler()}
      >
        <div
          class="mrt-head-cell-label"
          style:min-width="{Math.min(headerLength, 4)}ch"
          style:overflow={columnDefType === 'data' ? 'hidden' : undefined}
          style:white-space={headerLength < 20 ? 'nowrap' : 'normal'}
        >
          {#if columnDef.Header}
            {@render columnDef.Header({ column, header, table })}
          {:else if columnDefType === 'display'}
            <MRT_DisplayHeader {header} {table} />
          {:else}
            {columnDef.header}
          {/if}
        </div>
        {#if column.getCanFilter()}
          <MRT_TableHeadCellFilterLabel {header} {table} />
        {/if}
        {#if column.getCanSort()}
          <MRT_TableHeadCellSortLabel {header} {table} />
        {/if}
      </div>
      {#if columnDefType !== 'group' && (showDragHandle || showColumnActions)}
        <div class="mrt-head-cell-actions">
          {#if showDragHandle}
            <MRT_TableHeadCellGrabHandle {column} {table} />
          {/if}
          {#if showColumnActions}
            <MRT_TableHeadCellColumnActionsButton {header} {table} />
          {/if}
        </div>
      {/if}
      {#if column.getCanResize()}
        <MRT_TableHeadCellResizeHandle {header} {table} />
      {/if}
    </div>
  {/if}
  {#if table.options.columnFilterDisplayMode === 'subheader' && column.getCanFilter()}
    <MRT_TableHeadCellFilterContainer {header} {table} />
  {/if}
</th>

<style>
  .mrt-head-cell {
    border-bottom: 1px solid var(--mrt-divider);
    box-sizing: border-box;
    color: var(--mdc-theme-on-surface, rgba(0, 0, 0, 0.87));
    text-align: start;
  }
  .mrt-head-cell:focus-visible {
    outline: 2px solid var(--mdc-theme-primary, #6200ee);
    outline-offset: -2px;
  }
  .mrt-head-cell-content {
    align-items: center;
    display: flex;
    justify-content: flex-start;
    position: relative;
    width: 100%;
  }
  .mrt-head-cell-labels {
    align-items: center;
    display: flex;
  }
  .mrt-head-cell-actions {
    margin-inline-start: auto;
    white-space: nowrap;
  }
  .mrt-head-cell:hover :global(.mrt-icon-button) {
    opacity: 1;
  }
  .mrt-clickable {
    cursor: pointer;
  }
  .mrt-head-cell-label {
    text-overflow: ellipsis;
  }
  .mrt-head-cell-label:hover {
    text-overflow: clip;
  }
</style>
