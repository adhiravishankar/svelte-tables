<script lang="ts" generics="TData extends MRT_RowData">
  import * as Dialog from '../ui/dialog';
  import type { MRT_Row, MRT_RowData, MRT_TableInstance } from '../../types';
  import { parseFromValuesOrFunc } from '../../utils/utils';
  import MRT_EditActionButtons from '../buttons/MRT_EditActionButtons.svelte';
  import MRT_EditCellTextField from '../inputs/MRT_EditCellTextField.svelte';

  /** The dialog used for `createDisplayMode` / `editDisplayMode` `'modal'`. */
  let {
    table,
    ...rest
  }: { table: MRT_TableInstance<TData>; [key: string]: any } = $props();

  const creatingRow = $derived(table.mrtState.creatingRow);
  const row = $derived((creatingRow ?? table.mrtState.editingRow) as MRT_Row<TData>);
  const { localization } = $derived(table.options);

  const dialogProps = $derived({
    ...parseFromValuesOrFunc(table.options.editRowDialogProps, { row, table }),
    ...(creatingRow &&
      parseFromValuesOrFunc(table.options.createRowDialogProps, { row, table })),
    ...rest,
  });

  const internalEditCells = $derived(
    row.getAllCells().filter((cell) => cell.column.columnDef.columnDefType === 'data'),
  );

  const customContent = $derived(
    (creatingRow && table.options.createRowDialogContent) ||
      table.options.editRowDialogContent,
  );

  // closing the dialog (escape key or click outside) cancels creating/editing
  function onclosed() {
    if (!table.mrtState.creatingRow && !table.mrtState.editingRow) return;
    if (table.mrtState.creatingRow) {
      table.options.onCreatingRowCancel?.({ row, table });
      table.setCreatingRow(null);
    } else {
      table.options.onEditingRowCancel?.({ row, table });
      table.setEditingRow(null);
    }
    row._valuesCache = {} as any; //reset values cache
  }
</script>

<Dialog.Root open onOpenChange={(open) => !open && onclosed()}>
  <Dialog.Content
    aria-describedby="mrt-edit-dialog-content"
    aria-labelledby="mrt-edit-dialog-title"
    showCloseButton={false}
    style="width: 100%; max-width: 444px"
    {...dialogProps}
  >
    {#if customContent}
      {@render customContent({ internalEditCells, row, table })}
    {:else}
      <Dialog.Header>
        <Dialog.Title id="mrt-edit-dialog-title" class="text-center">
          {localization.edit}
        </Dialog.Title>
      </Dialog.Header>
      <div id="mrt-edit-dialog-content">
        <form class="mrt-edit-form" onsubmit={(e) => e.preventDefault()}>
          {#each internalEditCells as cell (cell.id)}
            <MRT_EditCellTextField {cell} {table} />
          {/each}
        </form>
      </div>
      <Dialog.Footer style="padding: 1.25rem">
        <MRT_EditActionButtons {row} {table} variant="text" />
      </Dialog.Footer>
    {/if}
  </Dialog.Content>
</Dialog.Root>

<style>
  .mrt-edit-form {
    display: flex;
    flex-direction: column;
    gap: 32px;
    padding-top: 16px;
    width: 100%;
  }
</style>
