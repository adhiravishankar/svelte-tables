<script lang="ts" generics="TData extends MRT_RowData">
  import type { MRT_Header, MRT_RowData, MRT_TableInstance } from '../../types';
  import { parseFromValuesOrFunc } from '../../utils/utils';
  import MRT_IconButton from '../buttons/MRT_IconButton.svelte';
  import MRT_ColumnActionMenu from '../menus/MRT_ColumnActionMenu.svelte';

  let {
    header,
    table,
    ...rest
  }: {
    header: MRT_Header<TData>;
    table: MRT_TableInstance<TData>;
    [key: string]: any;
  } = $props();

  const column = $derived(header.column);
  const MoreVertIcon = $derived(table.options.icons.MoreVertIcon);

  const buttonProps = $derived({
    ...parseFromValuesOrFunc(table.options.columnActionsButtonProps, { column, table }),
    ...parseFromValuesOrFunc(column.columnDef.columnActionsButtonProps, { column, table }),
    ...rest,
  });

  let anchorEl = $state<HTMLElement | null>(null);

  function onclick(event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
    anchorEl = event.currentTarget as HTMLElement;
  }
</script>

<MRT_IconButton
  label={table.options.localization.columnActions}
  {onclick}
  size="mini"
  style="height: 2rem; margin: -8px -4px; opacity: 0.3; padding: 0; transition: all 150ms; width: 2rem"
  {...buttonProps}
>
  <MoreVertIcon style="transform: scale(0.9)" />
</MRT_IconButton>
{#if anchorEl}
  <MRT_ColumnActionMenu
    {anchorEl}
    {header}
    setAnchorEl={(el) => (anchorEl = el)}
    {table}
  />
{/if}
