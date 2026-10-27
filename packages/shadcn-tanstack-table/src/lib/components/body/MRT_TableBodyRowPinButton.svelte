<script lang="ts" generics="TData extends MRT_RowData">
  import type { MRT_Row, MRT_RowData, MRT_TableInstance } from '../../types';
  import { parseFromValuesOrFunc } from '../../utils/utils';
  import MRT_RowPinButton from '../buttons/MRT_RowPinButton.svelte';

  let {
    row,
    table,
    ...rest
  }: {
    row: MRT_Row<TData>;
    table: MRT_TableInstance<TData>;
    [key: string]: any;
  } = $props();

  const canPin = $derived(parseFromValuesOrFunc(table.options.enableRowPinning, row as any));
  const mode = $derived(table.options.rowPinningDisplayMode);
  const compact = $derived(table.mrtState.density === 'compact');
</script>

{#if canPin}
  {#if mode === 'top-and-bottom' && !row.getIsPinned()}
    <div class="mrt-pin-buttons" class:mrt-pin-row={compact}>
      <MRT_RowPinButton pinningPosition="top" {row} {table} {...rest} />
      <MRT_RowPinButton pinningPosition="bottom" {row} {table} {...rest} />
    </div>
  {:else}
    <MRT_RowPinButton
      pinningPosition={mode === 'bottom' ? 'bottom' : 'top'}
      {row}
      {table}
      {...rest}
    />
  {/if}
{/if}

<style>
  .mrt-pin-buttons {
    display: flex;
    flex-direction: column;
  }
  .mrt-pin-row {
    flex-direction: row;
  }
</style>
