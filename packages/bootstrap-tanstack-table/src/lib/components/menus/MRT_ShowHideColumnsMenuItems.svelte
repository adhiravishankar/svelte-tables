<script lang="ts" generics="TData extends MRT_RowData">
  import { Label } from '../ui/label';
  import { Switch } from '../ui/switch';
  import type { MRT_Column, MRT_RowData, MRT_TableInstance } from '../../types';
  import { reorderColumn } from '../../utils/column.utils';
  import MRT_ColumnPinningButtons from '../buttons/MRT_ColumnPinningButtons.svelte';
  import MRT_GrabHandleButton from '../buttons/MRT_GrabHandleButton.svelte';
  import MRT_ShowHideColumnsMenuItems from './MRT_ShowHideColumnsMenuItems.svelte';

  let {
    allColumns,
    column,
    hoveredColumn,
    isNestedColumns,
    setHoveredColumn,
    table,
  }: {
    allColumns: MRT_Column<TData>[];
    column: MRT_Column<TData>;
    hoveredColumn: MRT_Column<TData> | null;
    isNestedColumns: boolean;
    setHoveredColumn: (column: MRT_Column<TData> | null) => void;
    table: MRT_TableInstance<TData>;
  } = $props();

  const o = $derived(table.options);
  const columnDef = $derived(column.columnDef);
  const columnDefType = $derived(columnDef.columnDefType);
  const switchChecked = $derived(column.getIsVisible());

  let menuItem = $state<HTMLElement | null>(null);
  let isDragging = $state(false);

  function handleToggleColumnHidden() {
    if (columnDefType === 'group') {
      column.columns?.forEach((childColumn: MRT_Column<TData>) => {
        childColumn.toggleVisibility(!switchChecked);
      });
    } else {
      column.toggleVisibility();
    }
  }

  function handleDragStart(e: DragEvent) {
    isDragging = true;
    try {
      if (menuItem) e.dataTransfer?.setDragImage(menuItem, 0, 0);
    } catch (error) {
      console.error(error);
    }
  }

  function handleDragEnd() {
    isDragging = false;
    // props are live: read the drop target before clearing it
    const dropTarget = hoveredColumn;
    setHoveredColumn(null);
    if (dropTarget) {
      const reorderedColumns = reorderColumn(
        column,
        dropTarget,
        table.atoms.columnOrder.get(),
      );
      table.setColumnOrder(reorderedColumns);
      table.setColumnPinning(({ start = [], end = [] }) => ({
        end: reorderedColumns.filter((id) => end.includes(id)),
        start: reorderedColumns.filter((id) => start.includes(id)),
      }));
    }
  }

  function handleDragEnter() {
    if (!isDragging && columnDef.enableColumnOrdering !== false) {
      setHoveredColumn(column);
    }
  }

  const visible = $derived(!!columnDef.header && columnDef.visibleInShowHideMenu !== false);
  const outline = $derived(
    isDragging
      ? '2px dashed rgba(128, 128, 128, 0.8)'
      : hoveredColumn?.id === column.id
        ? `2px dashed ${o.mrtTheme.draggingBorderColor}`
        : 'none',
  );
</script>

{#if visible}
  <div bind:this={menuItem} role="presentation" ondragenter={handleDragEnter}>
    <div
      class="mrt-show-hide-row"
      style="opacity: {isDragging
        ? 0.5
        : 1}; outline: {outline}; outline-offset: -2px; padding-inline-start: {(column.depth + 0.5) * 2}rem"
    >
      <div class="mrt-show-hide-item">
        {#if columnDefType !== 'group' && o.enableColumnOrdering && !isNestedColumns}
          {#if columnDef.enableColumnOrdering !== false}
            <MRT_GrabHandleButton
              ondragend={handleDragEnd}
              ondragstart={handleDragStart}
              {table}
            />
          {:else}
            <div style="width: 28px"></div>
          {/if}
        {/if}
        {#if o.enableColumnPinning}
          {#if column.getCanPin()}
            <MRT_ColumnPinningButtons {column} {table} />
          {:else}
            <div style="width: 70px"></div>
          {/if}
        {/if}
        {#if o.enableHiding}
          <Label class="gap-2">
            <Switch
              checked={switchChecked}
              disabled={!column.getCanHide()}
              onCheckedChange={handleToggleColumnHidden}
              title={o.localization.toggleVisibility}
            />
            <span style:opacity={columnDefType !== 'display' ? 1 : 0.5}>
              {columnDef.header}
            </span>
          </Label>
        {:else}
          <span class="mrt-show-hide-name">{columnDef.header}</span>
        {/if}
      </div>
    </div>
  </div>
{/if}
{#each column.columns ?? [] as childColumn, i (`${i}-${childColumn.id}`)}
  <MRT_ShowHideColumnsMenuItems
    {allColumns}
    column={childColumn}
    {hoveredColumn}
    {isNestedColumns}
    {setHoveredColumn}
    {table}
  />
{/each}

<style>
  .mrt-show-hide-row {
    align-items: center;
    display: flex;
    justify-content: flex-start;
    padding-block: 0.25rem;
    padding-inline-end: 0.5rem;
  }
  .mrt-show-hide-item {
    align-items: center;
    display: flex;
    flex-wrap: nowrap;
    gap: 8px;
  }
  .mrt-show-hide-name {
    align-self: center;
  }
</style>
