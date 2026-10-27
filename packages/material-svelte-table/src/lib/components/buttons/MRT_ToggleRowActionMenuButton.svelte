<script lang="ts" generics="TData extends MRT_RowData">
  import type {
    MRT_Cell,
    MRT_Row,
    MRT_RowData,
    MRT_TableInstance,
  } from '../../types';
  import { parseFromValuesOrFunc } from '../../utils/utils';
  import MRT_RowActionMenu from '../menus/MRT_RowActionMenu.svelte';
  import MRT_EditActionButtons from './MRT_EditActionButtons.svelte';
  import MRT_IconButton from './MRT_IconButton.svelte';

  let {
    cell,
    row,
    staticRowIndex,
    table,
  }: {
    cell: MRT_Cell<TData>;
    row: MRT_Row<TData>;
    staticRowIndex?: number;
    table: MRT_TableInstance<TData>;
  } = $props();

  const o = $derived(table.options);
  const { EditIcon, MoreHorizIcon } = $derived(o.icons);

  const isCreating = $derived(table.mrtState.creatingRow?.id === row.id);
  const isEditing = $derived(table.mrtState.editingRow?.id === row.id);
  const showEditActionButtons = $derived(
    (isCreating && o.createDisplayMode === 'row') ||
      (isEditing && o.editDisplayMode === 'row'),
  );
  const canEdit = $derived(
    !!parseFromValuesOrFunc(o.enableEditing, row) &&
      ['modal', 'row'].includes(o.editDisplayMode!),
  );

  let anchorEl = $state<HTMLElement | null>(null);

  function handleOpenRowActionMenu(event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
    anchorEl = event.currentTarget as HTMLElement;
  }

  function handleStartEditMode(event: MouseEvent) {
    event.stopPropagation();
    table.setEditingRow({ ...row });
    anchorEl = null;
  }

  const iconButtonStyle =
    'height: 2rem; width: 2rem; margin-inline-start: 10px; opacity: 0.5; transition: opacity 150ms';
</script>

{#if o.rowActions && !showEditActionButtons}
  {@render o.rowActions({ cell, row, staticRowIndex, table })}
{:else if showEditActionButtons}
  <MRT_EditActionButtons {row} {table} />
{:else if !o.rowActionMenuItems && canEdit}
  <MRT_IconButton
    label={o.localization.edit}
    onclick={handleStartEditMode}
    size="mini"
    style={iconButtonStyle}
  >
    <EditIcon />
  </MRT_IconButton>
{:else if o.rowActionMenuItems}
  <MRT_IconButton
    label={o.localization.rowActions}
    onclick={handleOpenRowActionMenu}
    size="mini"
    style={iconButtonStyle}
  >
    <MoreHorizIcon />
  </MRT_IconButton>
  <MRT_RowActionMenu
    {anchorEl}
    handleEdit={handleStartEditMode}
    {row}
    setAnchorEl={(el) => (anchorEl = el)}
    {staticRowIndex}
    {table}
  />
{/if}
