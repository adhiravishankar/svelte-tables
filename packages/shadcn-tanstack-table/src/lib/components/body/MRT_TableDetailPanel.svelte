<script lang="ts" generics="TData extends MRT_RowData">
  import type { HTMLTdAttributes } from 'svelte/elements';
  import { untrack } from 'svelte';
  import type {
    MRT_Row,
    MRT_RowData,
    MRT_RowVirtualizer,
    MRT_TableInstance,
    MRT_VirtualItem,
  } from '../../types';
  import { isGridLayout, mergeStyles } from '../../utils/style.utils';
  import { parseFromValuesOrFunc } from '../../utils/utils';

  let {
    parentRow,
    row,
    rowVirtualizer,
    staticRowIndex,
    table,
    virtualRow,
    ...rest
  }: {
    parentRow?: HTMLTableRowElement | null;
    row: MRT_Row<TData>;
    rowVirtualizer?: { instance: MRT_RowVirtualizer };
    staticRowIndex: number;
    table: MRT_TableInstance<TData>;
    virtualRow?: MRT_VirtualItem;
  } & HTMLTdAttributes = $props();

  const rowProps = $derived(
    parseFromValuesOrFunc(table.options.tableBodyRowProps, {
      isDetailPanel: true,
      row,
      staticRowIndex,
      table,
    }),
  );
  const cellProps = $derived({
    ...parseFromValuesOrFunc(table.options.detailPanelProps, { row, table }),
    ...rest,
  });

  const grid = $derived(isGridLayout(table.options.layoutMode));
  const isExpanded = $derived(row.getIsExpanded());
  const hasContent = $derived(!table.mrtState.isLoading && !!table.options.detailPanel);
</script>

<tr
  class="mrt-detail-panel-row"
  data-index={staticRowIndex * 2 + 1}
  {...rowProps}
  {@attach (node) => untrack(() => void rowVirtualizer?.instance.measureElement(node))}
  style={mergeStyles(
    {
      display: grid ? 'flex' : undefined,
      position: virtualRow ? 'absolute' : undefined,
      top: virtualRow ? `${parentRow?.getBoundingClientRect().height ?? 0}px` : undefined,
      transform: virtualRow ? `translateY(${virtualRow.start}px)` : undefined,
      width: '100%',
    },
    rowProps?.style,
  )}
>
  <td
    class="mrt-detail-panel-cell"
    colspan={table.getVisibleLeafColumns().length}
    {...cellProps}
    style={mergeStyles(
      {
        backgroundColor: virtualRow ? table.options.mrtTheme.baseBackgroundColor : undefined,
        borderBottom: !isExpanded ? 'none' : undefined,
        display: grid ? 'flex' : undefined,
        padding: hasContent && isExpanded ? '1rem' : 0,
        transition: virtualRow ? undefined : 'all 150ms ease-in-out',
        width: '100%',
      },
      cellProps.style,
    )}
  >
    {#if isExpanded && hasContent}
      {@render table.options.detailPanel!({ row, table })}
    {/if}
  </td>
</tr>

<style>
  .mrt-detail-panel-cell {
    border-bottom: 1px solid var(--mrt-divider);
    box-sizing: border-box;
    color: var(--foreground);
  }
</style>
