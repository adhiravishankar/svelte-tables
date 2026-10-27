<script lang="ts" generics="TData extends MRT_RowData">
  import type { MRT_Cell, MRT_RowData, MRT_TableInstance } from '../../types';
  import MRT_ExpandButton from '../buttons/MRT_ExpandButton.svelte';
  import MRT_ToggleRowActionMenuButton from '../buttons/MRT_ToggleRowActionMenuButton.svelte';
  import MRT_SelectCheckbox from '../inputs/MRT_SelectCheckbox.svelte';

  /**
   * The default content of the built-in display columns (`mrt-row-*`). It is
   * used when the column has no `Cell` snippet of its own.
   */
  let {
    cell,
    staticColumnIndex,
    staticRowIndex,
    table,
  }: {
    cell: MRT_Cell<TData>;
    staticColumnIndex?: number;
    staticRowIndex: number;
    table: MRT_TableInstance<TData>;
  } = $props();

  const column = $derived(cell.column);
  const row = $derived(cell.row);
  const columnDef = $derived(column.columnDef);

  const rowNumber = $derived.by(() => {
    const { pageIndex, pageSize } = table.atoms.pagination.get();
    return (
      (table.options.rowNumberDisplayMode === 'static'
        ? (staticRowIndex || 0) + (pageSize || 0) * (pageIndex || 0)
        : row.index) + 1
    );
  });

  const removeGroupedColumn = $derived(
    table.options.groupedColumnMode === 'remove' && !!row.groupingColumnId,
  );
</script>

{#if column.id === 'mrt-row-select'}
  <MRT_SelectCheckbox {row} {staticRowIndex} {table} />
{:else if column.id === 'mrt-row-numbers'}
  {rowNumber}
{:else if column.id === 'mrt-row-actions'}
  <MRT_ToggleRowActionMenuButton {cell} {row} {staticRowIndex} {table} />
{:else if column.id === 'mrt-row-expand'}
  {#if removeGroupedColumn}
    <div class="mrt-expand-grouped">
      <MRT_ExpandButton {row} {staticRowIndex} {table} />
      <span title={table.getColumn(row.groupingColumnId!).columnDef.header}>
        {String(row.groupingValue ?? '')}
      </span>
      {#if row.subRows?.length}<span>({row.subRows.length})</span>{/if}
    </div>
  {:else}
    <MRT_ExpandButton {row} {staticRowIndex} {table} />
    {#if columnDef.GroupedCell}
      {@render columnDef.GroupedCell({
        cell,
        column,
        row,
        staticColumnIndex,
        staticRowIndex,
        table,
      })}
    {/if}
  {/if}
{/if}

<style>
  .mrt-expand-grouped {
    align-items: center;
    display: flex;
    gap: 0.25rem;
  }
</style>
