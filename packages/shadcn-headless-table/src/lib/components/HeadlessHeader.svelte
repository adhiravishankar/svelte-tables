<script lang="ts" generics="TData extends RowData">
  import { Render } from '@humanspeak/svelte-headless-table';
  import ArrowDownwardIcon from '../icons/ArrowDownwardIcon.svelte';
  import type {
    HeadlessColumnDef,
    HeadlessLocalization,
    HeadlessTableInstance,
    RowData,
  } from '../types';
  import {
    cellStyle,
    EXPAND_COLUMN_WIDTH,
    SELECT_COLUMN_WIDTH,
  } from '../utils/cell';
  import ColumnFilter from './ColumnFilter.svelte';
  import Checkbox from './kit/Checkbox.svelte';

  let {
    data,
    defs,
    enableColumnFilters,
    enableResizing,
    expandable,
    localization,
    selectable,
    table,
  }: {
    data: TData[];
    defs: Record<string, HeadlessColumnDef<TData>>;
    enableColumnFilters: boolean;
    enableResizing: boolean;
    expandable: boolean;
    localization: HeadlessLocalization;
    selectable: boolean;
    table: HeadlessTableInstance<TData>;
  } = $props();

  const headerRow = $derived(table.viewModel.current.headerRows[0]);
  const showFilters = $derived(
    enableColumnFilters &&
      (headerRow?.cells ?? []).some((cell: any) => defs[cell.id]?.filterVariant !== false),
  );
</script>

<div class="hdt-head" role="rowgroup">
  <div class="hdt-row hdt-head-row" role="row">
    {#if selectable}
      <div class="hdt-cell hdt-fixed" role="columnheader" style="flex: 0 0 {SELECT_COLUMN_WIDTH}px">
        <Checkbox
          checked={table.allSelected}
          indeterminate={table.someSelected}
          label={localization.toggleSelectAll}
          onchange={(value) => table.toggleAllRows(value)}
        />
      </div>
    {/if}
    {#if expandable}
      <div class="hdt-cell hdt-fixed" role="columnheader" style="flex: 0 0 {EXPAND_COLUMN_WIDTH}px"></div>
    {/if}
    {#each headerRow?.cells ?? [] as cell (cell.id)}
      {@const def = defs[cell.id]}
      {@const props = cell.current.props}
      {@const order = table.sortOrder(cell.id)}
      {@const sortable = !!props.sort && !props.sort.disabled}
      <div
        {...cell.current.attrs}
        aria-sort={order === 'asc' ? 'ascending' : order === 'desc' ? 'descending' : undefined}
        class="hdt-cell hdt-head-cell"
        class:hdt-sortable={sortable}
        style={cellStyle(def, cell.current.attrs.style)}
      >
        {#if sortable}
          <button
            class="hdt-sort"
            onclick={(event) => table.setSorting(cell.id, event)}
            title={order === 'asc'
              ? localization.sortByColumnDesc.replace('{column}', def?.header ?? '')
              : localization.sortByColumnAsc.replace('{column}', def?.header ?? '')}
            type="button"
          >
            <Render of={cell.render()} />
            <span class="hdt-sort-icon" class:hdt-sort-active={!!order} class:hdt-sort-asc={order === 'asc'}>
              <ArrowDownwardIcon />
            </span>
          </button>
        {:else}
          <Render of={cell.render()} />
        {/if}
        {#if enableResizing && props.resize && !props.resize.disabled}
          <!-- svelte-ignore a11y_no_static_element_interactions -->
          <span
            aria-hidden="true"
            class="hdt-resize"
            use:props.resize.drag
            ondblclick={(event: MouseEvent) => props.resize.reset(event.currentTarget as Element)}
          ></span>
        {/if}
      </div>
    {/each}
  </div>
  {#if showFilters}
    <div class="hdt-row hdt-filter-row" role="row">
      {#if selectable}
        <div class="hdt-cell hdt-fixed" role="cell" style="flex: 0 0 {SELECT_COLUMN_WIDTH}px"></div>
      {/if}
      {#if expandable}
        <div class="hdt-cell hdt-fixed" role="cell" style="flex: 0 0 {EXPAND_COLUMN_WIDTH}px"></div>
      {/if}
      {#each headerRow?.cells ?? [] as cell (cell.id)}
        {@const def = defs[cell.id]}
        <div class="hdt-cell" role="cell" style={cellStyle(def, cell.current.attrs.style)}>
          {#if def && def.filterVariant !== false}
            <ColumnFilter column={def} {data} id={cell.id} {localization} {table} />
          {/if}
        </div>
      {/each}
    </div>
  {/if}
</div>
