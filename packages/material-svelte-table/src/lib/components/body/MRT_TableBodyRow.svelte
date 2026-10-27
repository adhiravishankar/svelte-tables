<script lang="ts" generics="TData extends MRT_RowData">
  import type { HTMLAttributes } from 'svelte/elements';
  import { untrack } from 'svelte';
  import { useColumnVirtualizer } from '../../hooks/createMRTVirtualizers.svelte';
  import type {
    MRT_Row,
    MRT_RowData,
    MRT_RowVirtualizer,
    MRT_TableInstance,
    MRT_VirtualItem,
  } from '../../types';
  import { getIsRowSelected } from '../../utils/row.utils';
  import { isGridLayout, mergeStyles } from '../../utils/style.utils';
  import { parseFromValuesOrFunc } from '../../utils/utils';
  import MRT_TableBodyCell from './MRT_TableBodyCell.svelte';
  import MRT_TableDetailPanel from './MRT_TableDetailPanel.svelte';

  let {
    pinnedRowIds,
    row,
    rowVirtualizer,
    staticRowIndex,
    table,
    virtualRow,
    ...rest
  }: {
    pinnedRowIds?: string[];
    row: MRT_Row<TData>;
    rowVirtualizer?: { instance: MRT_RowVirtualizer };
    staticRowIndex: number;
    table: MRT_TableInstance<TData>;
    virtualRow?: MRT_VirtualItem;
  } & HTMLAttributes<HTMLTableRowElement> = $props();

  const rowProps = $derived({
    ...parseFromValuesOrFunc(table.options.tableBodyRowProps, {
      row,
      staticRowIndex,
      table,
    }),
    ...rest,
  });

  const columnVirtualizer = useColumnVirtualizer();
  const virtualizer = $derived(columnVirtualizer?.instance);
  const visibleCells = $derived(row.getVisibleCells());
  const cellItems = $derived(
    virtualizer
      ? virtualizer.virtualColumns
          .map((v) => ({ cell: visibleCells[v.index], index: v.index }))
          .filter((item) => item.cell)
      : visibleCells.map((cell, index) => ({ cell, index })),
  );

  let rowElement = $state<HTMLTableRowElement | null>(null);
  function attachRow(node: HTMLTableRowElement) {
    rowElement = node;
    untrack(() => rowVirtualizer?.instance.measureElement(node));
    return () => {
      rowElement = null;
    };
  }

  const grid = $derived(isGridLayout(table.options.layoutMode));
  const density = $derived(table.mrtState.density);
  const isRowSelected = $derived(getIsRowSelected({ row, table }));
  const isRowPinned = $derived(table.options.enableRowPinning && row.getIsPinned());
  const isDraggingRow = $derived(table.mrtState.draggingRow?.id === row.id);
  const isHoveredRow = $derived(table.mrtState.hoveredRow?.id === row.id);
  const sticky = $derived(
    !!table.options.rowPinningDisplayMode?.includes('sticky'),
  );

  const [bottomPinnedIndex, topPinnedIndex] = $derived.by(() => {
    // read for reactivity: pinned rows move when pinning changes
    table.atoms.rowPinning.get();
    if (!table.options.enableRowPinning || !sticky || !pinnedRowIds || !row.getIsPinned()) {
      return [undefined, undefined];
    }
    return [
      [...pinnedRowIds].reverse().indexOf(row.id),
      pinnedRowIds.indexOf(row.id),
    ];
  });

  const rowHeight = $derived(
    parseInt(String(rowProps.style ?? '').match(/height:\s*([\d.]+)/)?.[1] ?? '', 10) ||
      (density === 'compact' ? 37 : density === 'comfortable' ? 53 : 69),
  );

  const highlight = $derived(
    isRowSelected
      ? table.options.mrtTheme.selectedRowBackgroundColor
      : isRowPinned
        ? table.options.mrtTheme.pinnedRowBackgroundColor
        : undefined,
  );

  const tableHeadHeight = $derived(
    ((table.options.enableStickyHeader || table.mrtState.isFullScreen) &&
      table.refs.tableHeadRef.current?.clientHeight) ||
      0,
  );
  const tableFooterHeight = $derived(
    (table.options.enableStickyFooter &&
      table.refs.tableFooterRef.current?.clientHeight) ||
      0,
  );
</script>

<tr
  data-index={table.options.detailPanel ? staticRowIndex * 2 : staticRowIndex}
  data-pinned={!!isRowPinned || undefined}
  data-selected={isRowSelected || undefined}
  ondragover={(e) => e.preventDefault()}
  ondragenter={() => {
    if (table.options.enableRowOrdering && table.mrtState.draggingRow) {
      table.setHoveredRow(row);
    }
  }}
  {...rowProps}
  {@attach attachRow}
  class={['mrt-body-row', rowProps.class]}
  style={mergeStyles(
    {
      '--mrt-row-highlight': highlight,
      '--mrt-row-highlight-hover': isRowSelected ? highlight : undefined,
      backgroundColor: table.options.mrtTheme.baseBackgroundColor,
      bottom:
        bottomPinnedIndex !== undefined && isRowPinned
          ? `${bottomPinnedIndex * rowHeight + (table.options.enableStickyFooter ? tableFooterHeight - 1 : 0)}px`
          : undefined,
      boxSizing: 'border-box',
      display: grid ? 'flex' : undefined,
      opacity: isRowPinned ? 0.97 : isDraggingRow || isHoveredRow ? 0.5 : 1,
      position: virtualRow
        ? 'absolute'
        : sticky && isRowPinned
          ? 'sticky'
          : 'relative',
      top: virtualRow
        ? 0
        : topPinnedIndex !== undefined && isRowPinned
          ? `${topPinnedIndex * rowHeight + (table.options.enableStickyHeader || table.mrtState.isFullScreen ? tableHeadHeight - 1 : 0)}px`
          : undefined,
      transform: virtualRow ? `translateY(${virtualRow.start}px)` : undefined,
      transition: virtualRow ? 'none' : 'all 150ms ease-in-out',
      width: '100%',
      zIndex: sticky && isRowPinned ? 2 : 0,
    },
    rowProps.style,
  )}
>
  {#if virtualizer?.virtualPaddingLeft}
    <td style="display: flex; width: {virtualizer.virtualPaddingLeft}px"></td>
  {/if}
  {#each cellItems as { cell, index } (cell.id)}
    <MRT_TableBodyCell {cell} staticColumnIndex={index} {staticRowIndex} {table} />
  {/each}
  {#if virtualizer?.virtualPaddingRight}
    <td style="display: flex; width: {virtualizer.virtualPaddingRight}px"></td>
  {/if}
</tr>
{#if table.options.detailPanel && !row.getIsGrouped()}
  <MRT_TableDetailPanel
    parentRow={rowElement}
    {row}
    {rowVirtualizer}
    {staticRowIndex}
    {table}
    {virtualRow}
  />
{/if}
