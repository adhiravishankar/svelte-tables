<script lang="ts" generics="TData extends MRT_RowData">
  import type { MRT_Header, MRT_RowData, MRT_TableInstance } from '../../types';
  import MRT_FilterTextField from './MRT_FilterTextField.svelte';

  let {
    header,
    table,
  }: { header: MRT_Header<TData>; table: MRT_TableInstance<TData> } = $props();
</script>

<div class="mrt-filter-range">
  {#each [0, 1] as rangeFilterIndex (rangeFilterIndex)}
    <MRT_FilterTextField {header} {rangeFilterIndex} {table} />
  {/each}
</div>

<style>
  .mrt-filter-range {
    display: grid;
    gap: 1rem;
    grid-template-columns: 1fr 1fr;
  }
</style>
