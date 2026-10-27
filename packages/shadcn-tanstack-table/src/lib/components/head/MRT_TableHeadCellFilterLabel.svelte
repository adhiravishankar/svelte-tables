<script lang="ts" generics="TData extends MRT_RowData">
  import MenuSurface from '@smui/menu-surface';
  import type { MRT_Header, MRT_RowData, MRT_TableInstance } from '../../types';
  import {
    getColumnFilterInfo,
    getDropdownOptions,
  } from '../../utils/column.utils';
  import { getFilterModeLabel } from '../../utils/filterOptions';
  import { getValueAndLabel } from '../../utils/utils';
  import MRT_TableHeadCellFilterContainer from './MRT_TableHeadCellFilterContainer.svelte';

  /**
   * The small filter icon in a head cell. It appears once the column is
   * filtered (always, in `popover` mode) and opens the filter input.
   */
  let {
    header,
    table,
  }: { header: MRT_Header<TData>; table: MRT_TableInstance<TData> } = $props();

  const column = $derived(header.column);
  const columnDef = $derived(column.columnDef);
  const { localization } = $derived(table.options);
  const FilterAltIcon = $derived(table.options.icons.FilterAltIcon);
  const popover = $derived(table.options.columnFilterDisplayMode === 'popover');

  const filterValue = $derived(column.getFilterValue() as [string, string] | string);
  const info = $derived(getColumnFilterInfo({ header, table }));
  const dropdownOptions = $derived(getDropdownOptions({ header, table }));

  const getSelectLabel = (index?: number) =>
    getValueAndLabel(
      dropdownOptions?.find(
        (option) =>
          getValueAndLabel(option).value ===
          (index !== undefined ? filterValue[index] : filterValue),
      ),
    ).label;

  const isFilterActive = $derived(
    (Array.isArray(filterValue) && filterValue.some(Boolean)) ||
      (!!filterValue && !Array.isArray(filterValue)),
  );

  const visible = $derived(
    popover ||
      (!!filterValue && !info.isRangeFilter) ||
      (info.isRangeFilter && (!!filterValue?.[0] || !!filterValue?.[1])),
  );

  const filterTooltip = $derived(
    popover && !isFilterActive
      ? localization.filterByColumn?.replace('{column}', String(columnDef.header))
      : localization.filteringByColumn
          .replace('{column}', String(columnDef.header))
          .replace(
            '{filterType}',
            getFilterModeLabel(localization, info.currentFilterOption),
          )
          .replace(
            '{filterValue}',
            `"${
              Array.isArray(filterValue)
                ? (filterValue as [string, string])
                    .map((value, index) =>
                      info.isMultiSelectFilter ? getSelectLabel(index) : value,
                    )
                    .join(
                      `" ${info.isRangeFilter ? localization.and : localization.or} "`,
                    )
                : info.isSelectFilter
                  ? getSelectLabel()
                  : (filterValue as string)
            }"`,
          )
          .replace('" "', ''),
  );

  let anchorEl = $state<HTMLElement | null>(null);

  function onclick(event: MouseEvent) {
    event.stopPropagation();
    if (popover) {
      anchorEl = event.currentTarget as HTMLElement;
    } else {
      table.setShowColumnFilters(true);
    }
    queueMicrotask(() => {
      const input = table.refs.filterInputRefs.current?.[`${column.id}-0`];
      input?.focus?.();
      input?.select?.();
    });
  }
</script>

{#if visible}
  <span class="mrt-filter-label" title={filterTooltip}>
    <button
      aria-label={filterTooltip}
      class="mrt-filter-label-button"
      class:mrt-filter-active={isFilterActive}
      {onclick}
      type="button"
    >
      <FilterAltIcon />
    </button>
  </span>
{/if}

{#if popover && anchorEl}
  <MenuSurface
    anchorCorner="TOP_START"
    anchorElement={anchorEl}
    fixed
    onclick={(e: MouseEvent) => e.stopPropagation()}
    onkeydown={(e: KeyboardEvent) => e.key === 'Enter' && (anchorEl = null)}
    onSMUIMenuSurfaceClosed={() => (anchorEl = null)}
    open
    style="overflow: visible; background: {table.options.mrtTheme.menuBackgroundColor}"
  >
    <div class="mrt-filter-popover">
      <MRT_TableHeadCellFilterContainer {header} {table} />
    </div>
  </MenuSurface>
{/if}

<style>
  .mrt-filter-label {
    flex: 0 0;
    margin-inline-start: 4px;
  }
  .mrt-filter-label-button {
    background: none;
    border: 0;
    color: inherit;
    cursor: pointer;
    display: inline-flex;
    font-size: 1rem;
    height: 16px;
    opacity: 0.3;
    padding: 0;
    transform: scale(0.75);
    transition: all 150ms ease-in-out;
    width: 16px;
  }
  .mrt-filter-active {
    opacity: 1;
  }
  .mrt-filter-popover {
    padding: 1rem;
  }
</style>
