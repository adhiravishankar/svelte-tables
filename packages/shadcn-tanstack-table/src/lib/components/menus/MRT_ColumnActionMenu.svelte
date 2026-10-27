<script lang="ts" generics="TData extends MRT_RowData">
  import { DropdownMenuSeparator as Separator } from '../ui/dropdown-menu';
  import type { Snippet } from 'svelte';
  import type { MRT_Header, MRT_RowData, MRT_TableInstance } from '../../types';
  import MRT_ActionMenuItem from './MRT_ActionMenuItem.svelte';
  import MRT_FilterOptionMenu from './MRT_FilterOptionMenu.svelte';
  import MRT_Menu from './MRT_Menu.svelte';

  let {
    anchorEl,
    header,
    setAnchorEl,
    table,
  }: {
    anchorEl: HTMLElement | null;
    header: MRT_Header<TData>;
    setAnchorEl: (anchorEl: HTMLElement | null) => void;
    table: MRT_TableInstance<TData>;
  } = $props();

  const o = $derived(table.options);
  const column = $derived(header.column);
  const columnDef = $derived(column.columnDef);
  const { localization } = $derived(o);
  const {
    ClearAllIcon,
    DynamicFeedIcon,
    FilterListIcon,
    FilterListOffIcon,
    PushPinIcon,
    RestartAltIcon,
    SortIcon,
    ViewColumnIcon,
    VisibilityOffIcon,
  } = $derived(o.icons);

  const columnFilterValue = $derived(column.getFilterValue());
  const isSorted = $derived(column.getIsSorted());
  const isPinned = $derived(column.getIsPinned());
  const showColumnFilters = $derived(table.mrtState.showColumnFilters);
  const columnSizing = $derived(table.atoms.columnSizing.get());
  const columnVisibility = $derived(table.atoms.columnVisibility.get());

  let filterMenuAnchorEl = $state<HTMLElement | null>(null);

  const close = () => setAnchorEl(null);

  const allowedColumnFilterOptions = $derived(
    columnDef.columnFilterModeOptions ?? o.columnFilterModeOptions,
  );
  const showFilterModeSubMenu = $derived(
    o.enableColumnFilterModes &&
      columnDef.enableColumnFilterModes !== false &&
      !columnDef.filterSelectOptions &&
      (allowedColumnFilterOptions === undefined || !!allowedColumnFilterOptions?.length),
  );

  const headerName = $derived(String(columnDef.header));
  const fill = (text: string | undefined) => text?.replace('{column}', headerName) ?? '';

  function handleClearFilter() {
    column.setFilterValue(undefined);
    close();
    if (['empty', 'notEmpty'].includes(columnDef._filterFn)) {
      table.setColumnFilterFns((prev) => ({
        ...prev,
        [header.id]: allowedColumnFilterOptions?.[0] ?? 'fuzzy',
      }));
    }
  }

  function handleFilterByColumn() {
    // read before closing: the menu (and its derived state) is torn down
    const inputKey = `${column.id}-0`;
    table.setShowColumnFilters(true);
    queueMicrotask(() => table.refs.filterInputRefs.current?.[inputKey]?.focus());
    close();
  }

  function handleOpenFilterModeMenu(event: Event) {
    event.stopPropagation();
    filterMenuAnchorEl = event.currentTarget as HTMLElement;
  }

  function handleResetColumnSize() {
    table.setColumnResizing((old) => ({ ...old, isResizingColumn: false }));
    column.resetSize();
    close();
  }

  function handleGroupByColumn() {
    column.toggleGrouping();
    table.setColumnOrder((old: string[]) => ['mrt-row-expand', ...old]);
    close();
  }

  function handleShowAllColumns() {
    table
      .getAllLeafColumns()
      .filter((col) => col.columnDef.enableHiding !== false)
      .forEach((col) => col.toggleVisibility(true));
    close();
  }

  const sortDivider = $derived(o.enableColumnFilters || o.enableGrouping || o.enableHiding);
  // the built-in items; custom `columnActionsMenuItems` snippets receive them
  const internalColumnMenuItems = $derived([
  ...(o.enableSorting && column.getCanSort()
    ? [o.enableSortingRemoval !== false && clearSortItem, sortAscItem, sortDescItem]
    : []),
  ...(o.enableColumnFilters && column.getCanFilter()
    ? [clearFilterItem, o.columnFilterDisplayMode === 'subheader' && filterByColumnItem]
    : []),
  ...(o.enableGrouping && column.getCanGroup() ? [groupItem] : []),
  ...(o.enableColumnPinning && column.getCanPin() ? [pinStartItem, pinEndItem, unpinItem] : []),
  ...(o.enableColumnResizing && column.getCanResize() ? [resetSizeItem] : []),
  ...(o.enableHiding ? [hideColumnItem, showAllItem] : []),
].filter(Boolean) as Snippet[]);
</script>

{#snippet clearSortItem()}
  <MRT_ActionMenuItem
    disabled={isSorted === false}
    label={localization.clearSort}
    onclick={() => (column.clearSorting(), close())}
    {table}
  >
    {#snippet icon()}<ClearAllIcon />{/snippet}
  </MRT_ActionMenuItem>
{/snippet}

{#snippet sortAscItem()}
  <MRT_ActionMenuItem
    disabled={isSorted === 'asc'}
    label={fill(localization.sortByColumnAsc)}
    onclick={() => (column.toggleSorting(false), close())}
    {table}
  >
    {#snippet icon()}<SortIcon style="transform: rotate(180deg) scaleX(-1)" />{/snippet}
  </MRT_ActionMenuItem>
{/snippet}

{#snippet sortDescItem()}
  <MRT_ActionMenuItem
    disabled={isSorted === 'desc'}
    label={fill(localization.sortByColumnDesc)}
    onclick={() => (column.toggleSorting(true), close())}
    {table}
  >
    {#snippet icon()}<SortIcon />{/snippet}
  </MRT_ActionMenuItem>
  {#if sortDivider}<Separator />{/if}
{/snippet}

{#snippet clearFilterItem()}
  <MRT_ActionMenuItem
    disabled={!columnFilterValue ||
      (Array.isArray(columnFilterValue) && !columnFilterValue.filter((v) => v).length)}
    label={localization.clearFilter}
    onclick={handleClearFilter}
    {table}
  >
    {#snippet icon()}<FilterListOffIcon />{/snippet}
  </MRT_ActionMenuItem>
{/snippet}

{#snippet filterByColumnItem()}
  <MRT_ActionMenuItem
    disabled={showColumnFilters && !o.enableColumnFilterModes}
    label={fill(localization.filterByColumn)}
    onclick={showColumnFilters ? handleOpenFilterModeMenu : handleFilterByColumn}
    onOpenSubMenu={showFilterModeSubMenu ? handleOpenFilterModeMenu : undefined}
    {table}
  >
    {#snippet icon()}<FilterListIcon />{/snippet}
  </MRT_ActionMenuItem>
  {#if o.enableGrouping || o.enableHiding}<Separator />{/if}
{/snippet}

{#snippet groupItem()}
  <MRT_ActionMenuItem
    label={fill(column.getIsGrouped() ? localization.ungroupByColumn : localization.groupByColumn)}
    onclick={handleGroupByColumn}
    {table}
  >
    {#snippet icon()}<DynamicFeedIcon />{/snippet}
  </MRT_ActionMenuItem>
  {#if o.enableColumnPinning}<Separator />{/if}
{/snippet}

{#snippet pinStartItem()}
  <MRT_ActionMenuItem
    disabled={isPinned === 'start' || !column.getCanPin()}
    label={localization.pinToLeft}
    onclick={() => (column.pin('start'), close())}
    {table}
  >
    {#snippet icon()}<PushPinIcon style="transform: rotate(90deg)" />{/snippet}
  </MRT_ActionMenuItem>
{/snippet}

{#snippet pinEndItem()}
  <MRT_ActionMenuItem
    disabled={isPinned === 'end' || !column.getCanPin()}
    label={localization.pinToRight}
    onclick={() => (column.pin('end'), close())}
    {table}
  >
    {#snippet icon()}<PushPinIcon style="transform: rotate(-90deg)" />{/snippet}
  </MRT_ActionMenuItem>
{/snippet}

{#snippet unpinItem()}
  <MRT_ActionMenuItem
    disabled={!isPinned}
    label={localization.unpin}
    onclick={() => (column.pin(false), close())}
    {table}
  >
    {#snippet icon()}<PushPinIcon />{/snippet}
  </MRT_ActionMenuItem>
  {#if o.enableHiding}<Separator />{/if}
{/snippet}

{#snippet resetSizeItem()}
  <MRT_ActionMenuItem
    disabled={columnSizing[column.id] === undefined}
    label={localization.resetColumnSize}
    onclick={handleResetColumnSize}
    {table}
  >
    {#snippet icon()}<RestartAltIcon />{/snippet}
  </MRT_ActionMenuItem>
{/snippet}

{#snippet hideColumnItem()}
  <MRT_ActionMenuItem
    disabled={!column.getCanHide()}
    label={fill(localization.hideColumn)}
    onclick={() => (column.toggleVisibility(false), close())}
    {table}
  >
    {#snippet icon()}<VisibilityOffIcon />{/snippet}
  </MRT_ActionMenuItem>
{/snippet}

{#snippet showAllItem()}
  <MRT_ActionMenuItem
    disabled={!Object.values(columnVisibility).filter((visible) => !visible).length}
    label={fill(localization.showAllColumns)}
    onclick={handleShowAllColumns}
    {table}
  >
    {#snippet icon()}<ViewColumnIcon />{/snippet}
  </MRT_ActionMenuItem>
{/snippet}

<MRT_Menu {anchorEl} onclose={close} {table}>
  {#if columnDef.columnActionsMenuItems ?? o.columnActionsMenuItems}
    {@render (columnDef.columnActionsMenuItems ?? o.columnActionsMenuItems)!({
      closeMenu: close,
      column,
      internalColumnMenuItems,
      table,
    })}
  {:else}
    {#each internalColumnMenuItems as item}
      {@render item()}
    {/each}
  {/if}
</MRT_Menu>

{#if o.enableColumnFilters && column.getCanFilter() && showFilterModeSubMenu}
  <MRT_FilterOptionMenu
    anchorEl={filterMenuAnchorEl}
    {header}
    onSelect={handleFilterByColumn}
    setAnchorEl={(el) => (filterMenuAnchorEl = el)}
    {table}
  />
{/if}
