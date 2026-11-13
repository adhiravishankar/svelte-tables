<script lang="ts" generics="TData extends MRT_RowData">
  import { DropdownMenuSeparator as Separator } from '../ui/dropdown-menu';
  import type {
    MRT_FilterOption,
    MRT_Header,
    MRT_RowData,
    MRT_TableInstance,
  } from '../../types';
  import {
    arrModes,
    emptyModes,
    mrtFilterOptions,
    rangeModes,
    rangeVariants,
  } from '../../utils/filterOptions';
  import MRT_ActionMenuItem from './MRT_ActionMenuItem.svelte';
  import MRT_Menu from './MRT_Menu.svelte';

  /**
   * The menu for picking a filter mode. With a `header` it changes that
   * column's filter mode; without one it changes the global filter mode.
   */
  let {
    anchorEl,
    header,
    onSelect,
    setAnchorEl,
    setFilterValue,
    table,
  }: {
    anchorEl: HTMLElement | null;
    header?: MRT_Header<TData>;
    onSelect?: () => void;
    setAnchorEl: (anchorEl: HTMLElement | null) => void;
    setFilterValue?: (filterValue: any) => void;
    table: MRT_TableInstance<TData>;
  } = $props();

  const column = $derived(header?.column);
  const columnDef = $derived(column?.columnDef);
  const { localization } = $derived(table.options);

  const allowedColumnFilterOptions = $derived.by(() => {
    let allowed = columnDef?.columnFilterModeOptions ?? table.options.columnFilterModeOptions;
    if (rangeVariants.includes(columnDef?.filterVariant as string)) {
      allowed = [...rangeModes, ...(allowed ?? [])].filter((option) =>
        rangeModes.includes(option),
      );
    }
    return allowed;
  });

  const internalFilterOptions = $derived(
    mrtFilterOptions(localization).filter((filterOption) =>
      columnDef
        ? allowedColumnFilterOptions === undefined ||
          allowedColumnFilterOptions?.includes(filterOption.option)
        : (!table.options.globalFilterModeOptions ||
            table.options.globalFilterModeOptions.includes(filterOption.option)) &&
          ['contains', 'fuzzy', 'startsWith'].includes(filterOption.option),
    ),
  );

  const currentOption = $derived(
    header && columnDef ? columnDef._filterFn : table.mrtState.globalFilterFn,
  );

  const customItems = $derived(
    header && column && columnDef
      ? (columnDef.columnFilterModeMenuItems ??
          table.options.columnFilterModeMenuItems)
      : table.options.globalFilterModeMenuItems,
  );

  function handleSelectFilterMode(option: MRT_FilterOption) {
    const currentFilterValue = column?.getFilterValue();
    const prevFilterMode = columnDef?._filterFn ?? '';
    if (!header || !column) {
      // global filter mode
      table.setGlobalFilterFn(option);
    } else if (option !== prevFilterMode) {
      // column filter mode
      table.setColumnFilterFns((prev: { [key: string]: any }) => ({
        ...prev,
        [header.id]: option,
      }));

      // reset filter value and/or perform new filter render
      if (emptyModes.includes(option)) {
        // will now be empty/notEmpty filter mode
        if (currentFilterValue !== ' ' && !emptyModes.includes(prevFilterMode)) {
          column.setFilterValue(' ');
        } else if (currentFilterValue) {
          column.setFilterValue(currentFilterValue); // perform new filter render
        }
      } else if (
        columnDef?.filterVariant === 'multi-select' ||
        arrModes.includes(option as string)
      ) {
        // will now be array filter mode
        if (
          currentFilterValue instanceof String ||
          (currentFilterValue as Array<any>)?.length
        ) {
          column.setFilterValue([]);
          setFilterValue?.([]);
        } else if (currentFilterValue) {
          column.setFilterValue(currentFilterValue); // perform new filter render
        }
      } else if (
        columnDef?.filterVariant?.includes('range') ||
        rangeModes.includes(option as MRT_FilterOption)
      ) {
        // will now be range filter mode
        if (
          !Array.isArray(currentFilterValue) ||
          (!(currentFilterValue as Array<any>)?.every((v) => v === '') &&
            !rangeModes.includes(prevFilterMode))
        ) {
          column.setFilterValue(['', '']);
          setFilterValue?.('');
        } else {
          column.setFilterValue(currentFilterValue); // perform new filter render
        }
      } else {
        // will now be single value filter mode
        if (Array.isArray(currentFilterValue)) {
          column.setFilterValue('');
          setFilterValue?.('');
        } else if (currentFilterValue === ' ' && emptyModes.includes(prevFilterMode)) {
          column.setFilterValue(undefined);
        } else {
          column.setFilterValue(currentFilterValue); // perform new filter render
        }
      }
    }
    setAnchorEl(null);
    onSelect?.();
  }
</script>

<MRT_Menu {anchorEl} anchorCorner="TOP_END" onclose={() => setAnchorEl(null)} {table}>
  {#if customItems}
    {@render customItems({
      column: column as any,
      internalFilterOptions,
      onSelectFilterMode: handleSelectFilterMode,
      table,
    } as any)}
  {:else}
    {#each internalFilterOptions as { divider, label, option, symbol } (option)}
      <MRT_ActionMenuItem
        activated={option === currentOption}
        {label}
        onclick={() => handleSelectFilterMode(option as MRT_FilterOption)}
        {table}
      >
        {#snippet icon()}<span class="mrt-filter-symbol">{symbol}</span>{/snippet}
      </MRT_ActionMenuItem>
      {#if divider}<Separator />{/if}
    {/each}
  {/if}
</MRT_Menu>

<style>
  .mrt-filter-symbol {
    display: inline-block;
    min-width: 1.5rem;
    text-align: center;
  }
</style>
