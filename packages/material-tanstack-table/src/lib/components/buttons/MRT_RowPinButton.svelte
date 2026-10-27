<script lang="ts" generics="TData extends MRT_RowData">
  import type { MRT_Row, MRT_RowData, MRT_TableInstance } from '../../types';
  import MRT_IconButton from './MRT_IconButton.svelte';

  let {
    pinningPosition,
    row,
    table,
    ...rest
  }: {
    pinningPosition: 'bottom' | 'top';
    row: MRT_Row<TData>;
    table: MRT_TableInstance<TData>;
    [key: string]: any;
  } = $props();

  const { CloseIcon, PushPinIcon } = $derived(table.options.icons);
  const { localization } = $derived(table.options);
  const isPinned = $derived(row.getIsPinned());
  const rotation = $derived(
    table.options.rowPinningDisplayMode === 'sticky'
      ? 135
      : pinningPosition === 'top'
        ? 180
        : 0,
  );

  function onclick(event: MouseEvent) {
    event.stopPropagation();
    row.pin(isPinned ? false : pinningPosition);
  }
</script>

<MRT_IconButton
  label={localization.pin}
  title={isPinned ? localization.unpin : localization.pin}
  {onclick}
  size="mini"
  style="height: 24px; padding: 0; width: 24px"
  {...rest}
>
  {#if isPinned}
    <CloseIcon />
  {:else}
    <PushPinIcon style="font-size: 1.1rem; transform: rotate({rotation}deg)" />
  {/if}
</MRT_IconButton>
