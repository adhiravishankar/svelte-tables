<script lang="ts" generics="TData extends MRT_RowData">
  import type { MRT_Row, MRT_RowData, MRT_TableInstance } from '../../types';
  import { parseFromValuesOrFunc } from '../../utils/utils';
  import MRT_GrabHandleButton from '../buttons/MRT_GrabHandleButton.svelte';

  /**
   * The drag handle in the row drag column. It records the dragged and hovered
   * rows in the table state; moving the data is up to you (see
   * `rowDragHandleProps.ondragend`).
   */
  let {
    row,
    table,
    ...rest
  }: {
    row: MRT_Row<TData>;
    table: MRT_TableInstance<TData>;
    [key: string]: any;
  } = $props();

  const buttonProps = $derived({
    ...parseFromValuesOrFunc(table.options.rowDragHandleProps, { row, table }),
    ...rest,
  });

  function ondragstart(event: DragEvent) {
    buttonProps.ondragstart?.(event);
    try {
      const tr = (event.currentTarget as HTMLElement).closest('tr');
      if (tr) event.dataTransfer?.setDragImage(tr, 0, 0);
    } catch (error) {
      console.error(error);
    }
    table.setDraggingRow(row);
  }

  function ondragend(event: DragEvent) {
    buttonProps.ondragend?.(event);
    table.setDraggingRow(null);
    table.setHoveredRow(null);
  }
</script>

<MRT_GrabHandleButton {...buttonProps} {ondragend} {ondragstart} {table} />
