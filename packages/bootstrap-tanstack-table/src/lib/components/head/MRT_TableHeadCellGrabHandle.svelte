<script lang="ts" generics="TData extends MRT_RowData">
  import type { MRT_Column, MRT_RowData, MRT_TableInstance } from '../../types';
  import { reorderColumn } from '../../utils/column.utils';
  import { parseFromValuesOrFunc } from '../../utils/utils';
  import MRT_GrabHandleButton from '../buttons/MRT_GrabHandleButton.svelte';

  /**
   * The drag handle in a head cell. Dropping on another column reorders
   * (`enableColumnOrdering`); dropping on the toolbar drop zone groups.
   */
  let {
    column,
    table,
    ...rest
  }: {
    column: MRT_Column<TData>;
    table: MRT_TableInstance<TData>;
    [key: string]: any;
  } = $props();

  const buttonProps = $derived({
    ...parseFromValuesOrFunc(table.options.columnDragHandleProps, { column, table }),
    ...parseFromValuesOrFunc(column.columnDef.columnDragHandleProps, { column, table }),
    ...rest,
  });

  function ondragstart(event: DragEvent) {
    buttonProps.ondragstart?.(event);
    table.setDraggingColumn(column);
    try {
      const cell = table.refs.tableHeadCellRefs.current?.[column.id];
      if (cell) event.dataTransfer?.setDragImage(cell, 0, 0);
    } catch (error) {
      console.error(error);
    }
  }

  function ondragend(event: DragEvent) {
    buttonProps.ondragend?.(event);
    // state getters are live: read the drop target before clearing it
    const { draggingColumn, hoveredColumn } = table.mrtState;
    if (hoveredColumn?.id === 'drop-zone') {
      column.toggleGrouping();
    } else if (
      table.options.enableColumnOrdering &&
      hoveredColumn &&
      hoveredColumn.id !== draggingColumn?.id
    ) {
      const reorderedColumns = reorderColumn(
        column,
        hoveredColumn as MRT_Column<TData>,
        table.atoms.columnOrder.get(),
      );
      table.setColumnOrder(reorderedColumns);
      table.setColumnPinning(({ start = [], end = [] }) => ({
        end: reorderedColumns.filter((id) => end.includes(id)),
        start: reorderedColumns.filter((id) => start.includes(id)),
      }));
    }
    table.setDraggingColumn(null);
    table.setHoveredColumn(null);
  }
</script>

<MRT_GrabHandleButton {...buttonProps} {ondragend} {ondragstart} {table} />
