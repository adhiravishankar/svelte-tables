<script lang="ts" generics="TData extends MRT_RowData">
  import type { HTMLTdAttributes } from 'svelte/elements';
  import type { MRT_Row, MRT_RowData, MRT_TableInstance } from '../../types';
  import { isGridLayout, mergeStyles } from '../../utils/style.utils';
  import { parseFromValuesOrFunc } from '../../utils/utils';

  let {
    row,
    staticRowIndex,
    table,
    ...rest
  }: {
    row: MRT_Row<TData>;
    staticRowIndex: number;
    table: MRT_TableInstance<TData>;
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
  style={mergeStyles(
    { display: grid ? 'flex' : undefined, width: '100%' },
    rowProps?.style,
  )}
>
  <td
    class="mrt-detail-panel-cell"
    colspan={table.getVisibleLeafColumns().length}
    {...cellProps}
    style={mergeStyles(
      {
        borderBottom: !isExpanded ? 'none' : undefined,
        display: grid ? 'flex' : undefined,
        padding: hasContent && isExpanded ? '1rem' : 0,
        transition: 'all 150ms ease-in-out',
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
    color: var(--mdc-theme-on-surface, rgba(0, 0, 0, 0.87));
  }
</style>
