<script lang="ts" generics="TData extends MRT_RowData">
  import type { MRT_Header, MRT_RowData, MRT_TableInstance } from '../../types';
  import { getFilterModeLabel } from '../../utils/filterOptions';
  import { parseFromValuesOrFunc } from '../../utils/utils';
  import MRT_RangeSlider from './MRT_RangeSlider.svelte';

  let {
    header,
    table,
    ...rest
  }: {
    header: MRT_Header<TData>;
    table: MRT_TableInstance<TData>;
    [key: string]: any;
  } = $props();

  const column = $derived(header.column);
  const columnDef = $derived(column.columnDef);
  const { localization } = $derived(table.options);

  const sliderProps = $derived({
    ...parseFromValuesOrFunc(table.options.filterSliderProps, { column, table }),
    ...parseFromValuesOrFunc(columnDef.filterSliderProps, { column, table }),
    ...rest,
  });

  const showChangeModeButton = $derived(
    table.options.enableColumnFilterModes &&
      columnDef.enableColumnFilterModes !== false,
  );

  const [min, max] = $derived.by(() => {
    let [lo, hi] =
      sliderProps.min !== undefined && sliderProps.max !== undefined
        ? [sliderProps.min, sliderProps.max]
        : (column.getFacetedMinMaxValues() ?? [0, 1]);
    //fix potential TanStack Table bugs where min or max is an array
    if (Array.isArray(lo)) lo = lo[0];
    if (Array.isArray(hi)) hi = hi[0];
    return [lo ?? 0, hi ?? 1] as [number, number];
  });

  const columnFilterValue = $derived(column.getFilterValue());

  // local value while dragging; follows the column filter and the bounds
  let dragged = $state<[number, number] | undefined>();
  const value = $derived<[number, number]>(
    dragged ??
      (Array.isArray(columnFilterValue)
        ? (columnFilterValue as [number, number])
        : [min, max]),
  );

  function commit(next: [number, number]) {
    dragged = undefined;
    if (next[0] <= min && next[1] >= max) {
      //if the user has selected the entire range, remove the filter
      column.setFilterValue(undefined);
    } else {
      column.setFilterValue(next);
    }
  }
</script>

{#if columnDef.Filter}
  {@render columnDef.Filter({ column, header, table })}
{:else}
  <!-- svelte-ignore a11y_no_static_element_interactions, a11y_click_events_have_key_events -->
  <div
    class="mrt-filter-slider"
    onclick={(e) => e.stopPropagation()}
    onkeydown={(e) => {
      // keep arrow keys from moving the focus to the next cell
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') e.stopPropagation();
    }}
    style="min-width: {column.getSize() - 50}px; margin-top: {showChangeModeButton ? '6px' : '10px'}"
  >
    <MRT_RangeSlider
      {max}
      {min}
      onchange={commit}
      bind:value={() => value, (next) => (dragged = next)}
    />
    {#if showChangeModeButton}
      <span class="mrt-filter-mode-label">
        {localization.filterMode.replace(
          '{filterType}',
          getFilterModeLabel(localization, columnDef._filterFn),
        )}
      </span>
    {/if}
  </div>
{/if}

<style>
  .mrt-filter-slider {
    padding: 0 4px;
    width: calc(100% - 8px);
  }
  .mrt-filter-mode-label {
    color: var(--mrt-text-secondary);
    display: block;
    font-size: 0.75rem;
    font-weight: normal;
    line-height: 0.8rem;
    margin-top: 1.25rem;
    white-space: nowrap;
  }
</style>
