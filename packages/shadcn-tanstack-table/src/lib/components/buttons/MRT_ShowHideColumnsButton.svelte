<script lang="ts" generics="TData extends MRT_RowData">
  import type { MRT_RowData, MRT_TableInstance } from '../../types';
  import MRT_ShowHideColumnsMenu from '../menus/MRT_ShowHideColumnsMenu.svelte';
  import MRT_IconButton from './MRT_IconButton.svelte';

  let {
    table,
    ...rest
  }: { table: MRT_TableInstance<TData>; [key: string]: any } = $props();

  const ViewColumnIcon = $derived(table.options.icons.ViewColumnIcon);
  let anchorEl = $state<HTMLElement | null>(null);
</script>

<MRT_IconButton
  label={table.options.localization.showHideColumns}
  onclick={(event: MouseEvent) => (anchorEl = event.currentTarget as HTMLElement)}
  {...rest}
>
  <ViewColumnIcon />
</MRT_IconButton>
{#if anchorEl}
  <MRT_ShowHideColumnsMenu
    {anchorEl}
    setAnchorEl={(el) => (anchorEl = el)}
    {table}
  />
{/if}
