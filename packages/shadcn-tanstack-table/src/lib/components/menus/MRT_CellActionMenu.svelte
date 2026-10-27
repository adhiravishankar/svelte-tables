<script lang="ts" generics="TData extends MRT_RowData">
  import type { Snippet } from 'svelte';
  import type { MRT_RowData, MRT_TableInstance } from '../../types';
  import { openEditingCell } from '../../utils/cell.utils';
  import { parseFromValuesOrFunc } from '../../utils/utils';
  import MRT_ActionMenuItem from './MRT_ActionMenuItem.svelte';
  import MRT_Menu from './MRT_Menu.svelte';

  /** The right-click menu of a cell (`enableCellActions`). */
  let { table }: { table: MRT_TableInstance<TData> } = $props();

  const cell = $derived(table.mrtState.actionCell);
  const o = $derived(table.options);
  const { localization } = $derived(o);
  const { ContentCopy, EditIcon } = $derived(o.icons);

  function handleClose(event?: Event) {
    event?.stopPropagation();
    table.setActionCell(null);
    table.refs.actionCellRef.current = null;
  }

  const showCopy = $derived(
    !!cell &&
      (parseFromValuesOrFunc(o.enableClickToCopy, cell) === 'context-menu' ||
        parseFromValuesOrFunc(cell.column.columnDef.enableClickToCopy, cell) ===
          'context-menu'),
  );
  const showEdit = $derived(
    !!cell && !!parseFromValuesOrFunc(o.enableEditing, cell.row) && o.editDisplayMode === 'cell',
  );
</script>

{#snippet copyItem()}
  <MRT_ActionMenuItem
    label={localization.copy}
    onclick={(event: MouseEvent) => {
      event.stopPropagation();
      navigator.clipboard.writeText(cell!.getValue() as string);
      handleClose();
    }}
    {table}
  >
    {#snippet icon()}<ContentCopy />{/snippet}
  </MRT_ActionMenuItem>
{/snippet}

{#snippet editItem()}
  <MRT_ActionMenuItem
    label={localization.edit}
    onclick={() => {
      openEditingCell({ cell: cell!, table });
      handleClose();
    }}
    {table}
  >
    {#snippet icon()}<EditIcon />{/snippet}
  </MRT_ActionMenuItem>
{/snippet}

{#if cell}
  {@const internalMenuItems = [showCopy && copyItem, showEdit && editItem].filter(Boolean) as Snippet[]}
  {@const custom = cell.column.columnDef.cellActionMenuItems ?? o.cellActionMenuItems}
  {#if custom || internalMenuItems.length}
    <MRT_Menu
      anchorEl={table.refs.actionCellRef.current}
      anchorCorner="BOTTOM_END"
      onclose={handleClose}
      {table}
    >
      {#if custom}
        {@render custom({
          cell,
          closeMenu: handleClose,
          column: cell.column,
          internalMenuItems,
          row: cell.row,
          table,
        })}
      {:else}
        {#each internalMenuItems as item}
          {@render item()}
        {/each}
      {/if}
    </MRT_Menu>
  {/if}
{/if}
