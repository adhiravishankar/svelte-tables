<script lang="ts" generics="TData extends MRT_RowData">
  import { parseFromValuesOrFunc } from '../../utils/utils';
  import type { MRT_Row, MRT_RowData, MRT_TableInstance } from '../../types';
  import MRT_ActionMenuItem from './MRT_ActionMenuItem.svelte';
  import MRT_Menu from './MRT_Menu.svelte';

  let {
    anchorEl,
    handleEdit,
    row,
    setAnchorEl,
    staticRowIndex,
    table,
  }: {
    anchorEl: HTMLElement | null;
    handleEdit: (event: MouseEvent) => void;
    row: MRT_Row<TData>;
    setAnchorEl: (anchorEl: HTMLElement | null) => void;
    staticRowIndex?: number;
    table: MRT_TableInstance<TData>;
  } = $props();

  const EditIcon = $derived(table.options.icons.EditIcon);
  const showEdit = $derived(
    !!parseFromValuesOrFunc(table.options.enableEditing, row) &&
      ['modal', 'row'].includes(table.options.editDisplayMode!),
  );
</script>

<MRT_Menu {anchorEl} onclose={() => setAnchorEl(null)} {table}>
  {#if showEdit}
    <MRT_ActionMenuItem
      label={table.options.localization.edit}
      onclick={handleEdit}
      {table}
    >
      {#snippet icon()}<EditIcon />{/snippet}
    </MRT_ActionMenuItem>
  {/if}
  {#if table.options.rowActionMenuItems}
    {@render table.options.rowActionMenuItems({
      closeMenu: () => setAnchorEl(null),
      row,
      staticRowIndex,
      table,
    })}
  {/if}
</MRT_Menu>
