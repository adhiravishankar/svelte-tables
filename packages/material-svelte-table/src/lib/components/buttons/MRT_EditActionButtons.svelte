<script lang="ts" generics="TData extends MRT_RowData">
  import Button, { Label } from '@smui/button';
  import type { MRT_Row, MRT_RowData, MRT_TableInstance } from '../../types';
  import MRT_Spinner from '../MRT_Spinner.svelte';
  import MRT_IconButton from './MRT_IconButton.svelte';

  let {
    row,
    table,
    variant = 'icon',
  }: {
    row: MRT_Row<TData>;
    table: MRT_TableInstance<TData>;
    variant?: 'icon' | 'text';
  } = $props();

  const { localization } = $derived(table.options);
  const { CancelIcon, SaveIcon } = $derived(table.options.icons);
  const isCreating = $derived(table.mrtState.creatingRow?.id === row.id);
  const isEditing = $derived(table.mrtState.editingRow?.id === row.id);
  const isSaving = $derived(!!table.mrtState.isSaving);
  const canSave = $derived(
    (isCreating && !!table.options.onCreatingRowSave) ||
      (isEditing && !!table.options.onEditingRowSave),
  );

  function handleCancel() {
    if (isCreating) {
      table.options.onCreatingRowCancel?.({ row, table });
      table.setCreatingRow(null);
    } else if (isEditing) {
      table.options.onEditingRowCancel?.({ row, table });
      table.setEditingRow(null);
    }
    row._valuesCache = {} as any; //reset values cache
  }

  function handleSubmitRow() {
    //look for auto-filled input values
    Object.values(table.refs.editInputRefs.current ?? {})
      .filter((inputRef) => row.id === inputRef?.name?.split('_')?.[0])
      ?.forEach((input) => {
        if (
          input.value !== undefined &&
          Object.hasOwn(row?._valuesCache as object, input.name)
        ) {
          (row._valuesCache as Record<string, any>)[input.name] = input.value;
        }
      });
    if (isCreating) {
      table.options.onCreatingRowSave?.({
        exitCreatingMode: () => table.setCreatingRow(null),
        row,
        table,
        values: row._valuesCache,
      });
    } else if (isEditing) {
      table.options.onEditingRowSave?.({
        exitEditingMode: () => table.setEditingRow(null),
        row,
        table,
        values: row._valuesCache,
      });
    }
  }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
<div class="mrt-edit-actions" onclick={(e) => e.stopPropagation()}>
  {#if variant === 'icon'}
    <MRT_IconButton label={localization.cancel} onclick={handleCancel}>
      <CancelIcon />
    </MRT_IconButton>
    {#if canSave}
      <MRT_IconButton
        disabled={isSaving}
        label={localization.save}
        onclick={handleSubmitRow}
      >
        {#if isSaving}
          <MRT_Spinner />
        {:else}
          <SaveIcon />
        {/if}
      </MRT_IconButton>
    {/if}
  {:else}
    <Button onclick={handleCancel} style="min-width: 100px">
      <Label>{localization.cancel}</Label>
    </Button>
    <Button
      disabled={isSaving}
      onclick={handleSubmitRow}
      style="min-width: 100px"
      variant="unelevated"
    >
      {#if isSaving}<MRT_Spinner />{/if}
      <Label>{localization.save}</Label>
    </Button>
  {/if}
</div>

<style>
  .mrt-edit-actions {
    display: flex;
    gap: 0.75rem;
  }
</style>
