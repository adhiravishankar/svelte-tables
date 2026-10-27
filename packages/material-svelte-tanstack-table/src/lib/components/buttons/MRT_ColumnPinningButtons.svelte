<script lang="ts" generics="TData extends MRT_RowData">
  import type { MRT_Column, MRT_RowData, MRT_TableInstance } from '../../types';
  import MRT_IconButton from './MRT_IconButton.svelte';

  let {
    column,
    table,
  }: { column: MRT_Column<TData>; table: MRT_TableInstance<TData> } = $props();

  const PushPinIcon = $derived(table.options.icons.PushPinIcon);
  const { localization } = $derived(table.options);
  const button = 'height: 1.75rem; width: 1.75rem; padding: 0';
</script>

<div class="mrt-pinning-buttons">
  {#if column.getIsPinned()}
    <MRT_IconButton
      label={localization.unpin}
      onclick={() => column.pin(false)}
      size="mini"
      style={button}
    >
      <PushPinIcon />
    </MRT_IconButton>
  {:else}
    <MRT_IconButton
      label={localization.pinToLeft}
      onclick={() => column.pin('start')}
      size="mini"
      style={button}
    >
      <PushPinIcon style="transform: rotate(90deg)" />
    </MRT_IconButton>
    <MRT_IconButton
      label={localization.pinToRight}
      onclick={() => column.pin('end')}
      size="mini"
      style={button}
    >
      <PushPinIcon style="transform: rotate(-90deg)" />
    </MRT_IconButton>
  {/if}
</div>

<style>
  .mrt-pinning-buttons {
    min-width: 70px;
    text-align: center;
  }
</style>
