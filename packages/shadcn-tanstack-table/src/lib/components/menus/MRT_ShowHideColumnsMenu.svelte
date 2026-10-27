<script lang="ts" generics="TData extends MRT_RowData">
  import { Button } from '../ui/button';
  import { DropdownMenuSeparator as Separator } from '../ui/dropdown-menu';
  import type {
    MRT_Column,
    MRT_RowData,
    MRT_TableInstance,
    MRT_VisibilityState,
  } from '../../types';
  import { getDefaultColumnOrderIds } from '../../utils/displayColumn.utils';
  import MRT_Menu from './MRT_Menu.svelte';
  import MRT_ShowHideColumnsMenuItems from './MRT_ShowHideColumnsMenuItems.svelte';

  let {
    anchorEl,
    setAnchorEl,
    table,
  }: {
    anchorEl: HTMLElement | null;
    setAnchorEl: (anchorEl: HTMLElement | null) => void;
    table: MRT_TableInstance<TData>;
  } = $props();

  const o = $derived(table.options);
  const { localization } = $derived(o);
  const columnOrder = $derived(table.atoms.columnOrder.get());

  function handleToggleAllColumns(value?: boolean) {
    const updates = table
      .getAllLeafColumns()
      .filter((column) => column.columnDef.enableHiding !== false)
      .reduce((acc, column) => {
        acc[column.id] = value ?? !column.getIsVisible();
        return acc;
      }, {} as MRT_VisibilityState);

    table.setColumnVisibility((old) => ({ ...old, ...updates }));
  }

  const allColumns = $derived.by(() => {
    // pinning changes the order the columns are shown in
    table.atoms.columnPinning.get();
    const columns = table.getAllColumns();
    if (
      columnOrder.length > 0 &&
      !columns.some((col) => col.columnDef.columnDefType === 'group')
    ) {
      return [
        ...table.getStartLeafColumns(),
        ...Array.from(new Set(columnOrder)).map((colId) =>
          table.getCenterLeafColumns().find((col) => col?.id === colId),
        ),
        ...table.getEndLeafColumns(),
      ].filter(Boolean) as MRT_Column<TData>[];
    }
    return columns;
  });

  const isNestedColumns = $derived(
    allColumns.some((col) => col.columnDef.columnDefType === 'group'),
  );

  const hasColumnOrderChanged = $derived.by(() => {
    const initialOrder = table.initialState.columnOrder ?? [];
    return (
      columnOrder.length !== initialOrder.length ||
      !columnOrder.every((column, index) => column === initialOrder[index])
    );
  });

  let hoveredColumn = $state.raw<MRT_Column<TData> | null>(null);
</script>

<MRT_Menu {anchorEl} onclose={() => setAnchorEl(null)} {table}>
  <div class="mrt-show-hide-actions">
    {#if o.enableHiding}
      <Button
        size="sm"
        variant="ghost"
        disabled={!table.getIsSomeColumnsVisible()}
        onclick={() => handleToggleAllColumns(false)}
      >
        {localization.hideAll}
      </Button>
    {/if}
    {#if o.enableColumnOrdering}
      <Button
        size="sm"
        variant="ghost"
        disabled={!hasColumnOrderChanged}
        onclick={() => table.setColumnOrder(getDefaultColumnOrderIds(table.options as any, true))}
      >
        {localization.resetOrder}
      </Button>
    {/if}
    {#if o.enableColumnPinning}
      <Button
        size="sm"
        variant="ghost"
        disabled={!table.getIsSomeColumnsPinned()}
        onclick={() => table.resetColumnPinning(true)}
      >
        {localization.unpinAll}
      </Button>
    {/if}
    {#if o.enableHiding}
      <Button
        size="sm"
        variant="ghost"
        disabled={table.getIsAllColumnsVisible()}
        onclick={() => handleToggleAllColumns(true)}
      >
        {localization.showAll}
      </Button>
    {/if}
  </div>
  <Separator />
  {#each allColumns as column, index (`${index}-${column.id}`)}
    <MRT_ShowHideColumnsMenuItems
      {allColumns}
      {column}
      {hoveredColumn}
      {isNestedColumns}
      setHoveredColumn={(c) => (hoveredColumn = c)}
      {table}
    />
  {/each}
</MRT_Menu>

<style>
  .mrt-show-hide-actions {
    display: flex;
    justify-content: space-between;
    padding: 0 0.5rem 0.5rem;
  }
</style>
