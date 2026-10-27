<script lang="ts" generics="TData extends MRT_RowData">
  import type { MRT_Header, MRT_RowData, MRT_TableInstance } from '../../types';
  import MRT_ExpandAllButton from '../buttons/MRT_ExpandAllButton.svelte';
  import MRT_SelectCheckbox from '../inputs/MRT_SelectCheckbox.svelte';

  /**
   * The default header content of the built-in display columns (`mrt-row-*`).
   * Used when the column has no `Header` snippet of its own.
   */
  let {
    header,
    table,
  }: { header: MRT_Header<TData>; table: MRT_TableInstance<TData> } = $props();

  const column = $derived(header.column);
  const o = $derived(table.options);
  const groupedNames = $derived(
    o.groupedColumnMode === 'remove'
      ? table
          .atoms.grouping.get()
          .map((id) => table.getColumn(id).columnDef.header)
          .join(', ')
      : '',
  );
</script>

{#if column.id === 'mrt-row-select'}
  {#if o.enableSelectAll && o.enableMultiRowSelection}
    <MRT_SelectCheckbox {table} />
  {:else}
    {column.columnDef.header}
  {/if}
{:else if column.id === 'mrt-row-numbers'}
  {o.localization.rowNumber}
{:else if column.id === 'mrt-row-expand' && o.enableExpandAll}
  <MRT_ExpandAllButton {table} />
  {groupedNames}
{:else}
  {column.columnDef.header}
{/if}
