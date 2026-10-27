<script lang="ts" generics="TData extends MRT_RowData">
  import highlightWords from 'highlight-words';
  import type { MRT_Cell, MRT_RowData, MRT_TableInstance } from '../../types';

  let {
    cell,
    staticColumnIndex,
    staticRowIndex,
    table,
  }: {
    cell: MRT_Cell<TData>;
    staticColumnIndex?: number;
    staticRowIndex?: number;
    table: MRT_TableInstance<TData>;
  } = $props();

  const allowedTypes = ['string', 'number'];

  const column = $derived(cell.column);
  const row = $derived(cell.row);
  const columnDef = $derived(column.columnDef);

  const ctx = $derived({ cell, column, row, staticColumnIndex, staticRowIndex, table });

  const isAggregated = $derived(cell.getIsAggregated() && !!columnDef.AggregatedCell);
  const isHiddenGroupedValue = $derived(
    !isAggregated && row.getIsGrouped() && !cell.getIsGrouped(),
  );
  const isGrouped = $derived(
    !isAggregated && !isHiddenGroupedValue && cell.getIsGrouped() && !!columnDef.GroupedCell,
  );
  const isGroupedValue = $derived(isAggregated || isHiddenGroupedValue || isGrouped);

  const value = $derived(isGroupedValue ? undefined : cell.renderValue());

  /** Pieces of the value to highlight, when a filter or global search matches. */
  const chunks = $derived.by(() => {
    const filterValue = column.getFilterValue();
    const globalFilter = table.atoms.globalFilter.get();
    if (
      !table.options.enableFilterMatchHighlighting ||
      columnDef.enableFilterMatchHighlighting === false ||
      !allowedTypes.includes(typeof value) ||
      !String(value) ||
      !(
        (filterValue &&
          allowedTypes.includes(typeof filterValue) &&
          ['autocomplete', 'text'].includes(columnDef.filterVariant!)) ||
        (globalFilter &&
          allowedTypes.includes(typeof globalFilter) &&
          column.getCanGlobalFilter())
      )
    ) {
      return undefined;
    }
    const result = highlightWords?.({
      matchExactly:
        (filterValue ? columnDef._filterFn : table.mrtState.globalFilterFn) !==
        'fuzzy',
      query: (filterValue ?? globalFilter ?? '').toString(),
      text: String(value),
    });
    return result?.length > 1 || result?.[0]?.match ? result : undefined;
  });
</script>

{#if isAggregated}
  {@render columnDef.AggregatedCell!(ctx)}
{:else if isHiddenGroupedValue}
  <!-- values of grouped rows are shown on the grouping cell -->
{:else if isGrouped}
  {@render columnDef.GroupedCell!(ctx)}
{:else if columnDef.Cell}
  {@render columnDef.Cell({ ...ctx, renderedCellValue: value })}
{:else if chunks}
  <span aria-label={String(value)} role="note">
    {#each chunks as { key, match, text } (key)}
      <span aria-hidden="true" class:mrt-match={match}>{text}</span>
    {/each}
  </span>
{:else}
  {value}
{/if}

<style>
  .mrt-match {
    background-color: var(--mrt-match-highlight, rgba(255, 213, 79, 0.5));
    border-radius: 2px;
    color: inherit;
    padding: 2px 1px;
  }
</style>
