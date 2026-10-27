<script lang="ts" generics="TData extends MRT_RowData">
  import type { MRT_RowData, MRT_TableInstance } from '../../types';
  import MRT_IconButton from './MRT_IconButton.svelte';

  let {
    table,
    ...rest
  }: { table: MRT_TableInstance<TData>; [key: string]: any } = $props();

  const isFullScreen = $derived(table.mrtState.isFullScreen);
  const Icon = $derived(
    isFullScreen
      ? table.options.icons.FullscreenExitIcon
      : table.options.icons.FullscreenIcon,
  );
</script>

<MRT_IconButton
  label={table.options.localization.toggleFullScreen}
  onclick={() => table.setIsFullScreen(!isFullScreen)}
  {...rest}
>
  <Icon />
</MRT_IconButton>
