<script lang="ts" generics="TData extends MRT_RowData">
  import type { MRT_Header, MRT_RowData, MRT_TableInstance } from '../../types';
  import { getColumnFilterInfo } from '../../utils/column.utils';
  import MRT_FilterCheckbox from '../inputs/MRT_FilterCheckbox.svelte';
  import MRT_FilterRangeFields from '../inputs/MRT_FilterRangeFields.svelte';
  import MRT_FilterRangeSlider from '../inputs/MRT_FilterRangeSlider.svelte';
  import MRT_FilterSelectField from '../inputs/MRT_FilterSelectField.svelte';
  import MRT_FilterTextField from '../inputs/MRT_FilterTextField.svelte';

  let {
    header,
    table,
  }: { header: MRT_Header<TData>; table: MRT_TableInstance<TData> } = $props();

  const columnDef = $derived(header.column.columnDef);
  const isRangeFilter = $derived(getColumnFilterInfo({ header, table }).isRangeFilter);
  const open = $derived(
    table.mrtState.showColumnFilters ||
      table.options.columnFilterDisplayMode === 'popover',
  );
  const variant = $derived(columnDef.filterVariant);
</script>

{#if open}
  <div class="mrt-filter-container">
    {#if variant === 'checkbox'}
      <MRT_FilterCheckbox {header} {table} />
    {:else if variant === 'range-slider'}
      <MRT_FilterRangeSlider {header} {table} />
    {:else if variant === 'select' || variant === 'multi-select'}
      <MRT_FilterSelectField {header} {table} />
    {:else if isRangeFilter}
      <MRT_FilterRangeFields {header} {table} />
    {:else}
      <MRT_FilterTextField {header} {table} />
    {/if}
  </div>
{/if}

<style>
  .mrt-filter-container {
    font-weight: normal;
  }
</style>
