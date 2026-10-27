<script lang="ts" generics="TData extends MRT_RowData">
  import { untrack } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import type { MRT_Row, MRT_RowData, MRT_TableInstance } from '../../types';
  import { getMRT_Rows } from '../../utils/row.utils';
  import { isGridLayout, mergeStyles } from '../../utils/style.utils';
  import { parseFromValuesOrFunc } from '../../utils/utils';
  import { createRowVirtualizer } from '../../hooks/createMRTVirtualizers.svelte';
  import MRT_TableBodyRow from './MRT_TableBodyRow.svelte';

  let {
    table,
    ...rest
  }: { table: MRT_TableInstance<TData> } & HTMLAttributes<HTMLTableSectionElement> =
    $props();

  const bodyProps = $derived({
    ...parseFromValuesOrFunc(table.options.tableBodyProps, { table }),
    ...rest,
  });

  const grid = $derived(isGridLayout(table.options.layoutMode));
  const stickyPins = $derived(
    !!table.options.rowPinningDisplayMode?.includes('sticky'),
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

  const pinnedRowIds = $derived.by(() => {
    const { bottom, top } = table.atoms.rowPinning.get();
    if (!bottom?.length && !top?.length) return [];
    return table
      .getRowModel()
      .rows.filter((row) => row.getIsPinned())
      .map((r) => r.id);
  });

  const rows: MRT_Row<TData>[] = $derived(getMRT_Rows(table));

  // virtualizing rows is decided once, when the table is created
  const rowVirtualizer = untrack(() => createRowVirtualizer(table, () => rows));

  /** What to render: every row, or only the virtual ones (with their position). */
  const rowItems = $derived.by(() => {
    if (!rowVirtualizer) {
      return rows.map((row, staticRowIndex) => ({
        key: `${row.id}-${row.index}`,
        row,
        staticRowIndex,
        virtualRow: undefined,
      }));
    }
    const items = [];
    for (const virtualRow of rowVirtualizer.virtualRows) {
      let staticRowIndex = virtualRow.index;
      if (table.options.detailPanel) {
        // detail panels are the odd virtual items
        if (virtualRow.index % 2 === 1) continue;
        staticRowIndex = virtualRow.index / 2;
      }
      const row = rows[staticRowIndex];
      if (row) {
        items.push({ key: `${row.id}-${row.index}`, row, staticRowIndex, virtualRow });
      }
    }
    return items;
  });

  const hasFilters = $derived(
    !!table.atoms.globalFilter.get() || table.atoms.columnFilters.get().length > 0,
  );
</script>

{#snippet pinnedBody(position: 'bottom' | 'top')}
  <tbody
    {...bodyProps}
    class={['mrt-body', bodyProps.class]}
    style={mergeStyles(
      {
        bottom: position === 'bottom' ? tableFooterHeight - 1 : undefined,
        display: grid ? 'grid' : undefined,
        position: 'sticky',
        top: position === 'top' ? tableHeadHeight - 1 : undefined,
        zIndex: 1,
      },
      bodyProps.style,
    )}
  >
    {#each position === 'top' ? table.getTopRows() : table.getBottomRows() as row, staticRowIndex (row.id)}
      <MRT_TableBodyRow {row} {staticRowIndex} {table} />
    {/each}
  </tbody>
{/snippet}

{#if !stickyPins && table.getIsSomeRowsPinned('top')}
  {@render pinnedBody('top')}
{/if}
<tbody
  {...bodyProps}
  class={['mrt-body', bodyProps.class]}
  style={mergeStyles(
    {
      display: grid ? 'grid' : undefined,
      height: rowVirtualizer ? `${rowVirtualizer.instance.getTotalSize()}px` : undefined,
      minHeight: !rows.length ? '100px' : undefined,
      position: 'relative',
    },
    bodyProps.style,
  )}
>
  {#if !rows.length}
    <tr style={mergeStyles({ display: grid ? 'grid' : undefined })}>
      <td
        colspan={table.getVisibleLeafColumns().length}
        style={mergeStyles({ display: grid ? 'grid' : undefined })}
      >
        {#if table.options.emptyRowsFallback}
          {@render table.options.emptyRowsFallback({ table })}
        {:else}
          <p class="mrt-empty">
            {hasFilters
              ? table.options.localization.noResultsFound
              : table.options.localization.noRecordsToDisplay}
          </p>
        {/if}
      </td>
    </tr>
  {:else}
    {#each rowItems as { key, row, staticRowIndex, virtualRow } (key)}
      <MRT_TableBodyRow
        {pinnedRowIds}
        {row}
        {rowVirtualizer}
        {staticRowIndex}
        {table}
        {virtualRow}
      />
    {/each}
  {/if}
</tbody>
{#if !stickyPins && table.getIsSomeRowsPinned('bottom')}
  {@render pinnedBody('bottom')}
{/if}

<style>
  .mrt-empty {
    color: var(--mrt-text-secondary);
    font-style: italic;
    margin: 0;
    padding: 2rem 0;
    text-align: center;
    width: 100%;
  }
</style>
