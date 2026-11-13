<script lang="ts" generics="TData extends RowData">
  import { Render } from '@humanspeak/svelte-headless-table';
  import ArrowDownwardIcon from '../icons/ArrowDownwardIcon.svelte';
  import DynamicFeedIcon from '../icons/DynamicFeedIcon.svelte';
  import type {
    HeadlessColumnDef,
    HeadlessLocalization,
    HeadlessTableInstance,
    RowData,
  } from '../types';
  import { cellStyle, SELECT_COLUMN_WIDTH } from '../utils/cell';
  import ColumnFilter from './ColumnFilter.svelte';
  import Button from './kit/Button.svelte';
  import Checkbox from './kit/Checkbox.svelte';

  let {
    data,
    defs,
    enableColumnFilters,
    enableColumnOrdering,
    enableResizing,
    localization,
    selectable,
    table,
  }: {
    data: TData[];
    defs: Record<string, HeadlessColumnDef<TData>>;
    enableColumnFilters: boolean;
    enableColumnOrdering: boolean;
    enableResizing: boolean;
    localization: HeadlessLocalization;
    selectable: boolean;
    table: HeadlessTableInstance<TData>;
  } = $props();

  const headerRow = $derived(table.viewModel.current.headerRows[0]);
  const cells = $derived<any[]>(headerRow?.cells ?? []);
  const showFilters = $derived(
    enableColumnFilters && cells.some((cell) => defs[cell.id]?.filterVariant !== false),
  );

  let dragId = $state<string | null>(null);
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
    {#each cells as cell (cell.id)}
      {@const def = defs[cell.id]}
      {@const props = cell.current.props}
      {@const order = table.sortOrder(cell.id)}
      {@const sortable = !!props.sort && !props.sort.disabled}
      {@const groupable = !!props.group && !props.group.disabled}
      {@const draggable = enableColumnOrdering && def?.enableColumnOrdering !== false}
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div
        {...cell.current.attrs}
        aria-sort={order === 'asc' ? 'ascending' : order === 'desc' ? 'descending' : undefined}
        class="hdt-cell hdt-head-cell"
        class:hdt-dragging={dragId === cell.id}
        class:hdt-sortable={sortable}
        {draggable}
        ondragend={() => (dragId = null)}
        ondragover={(event) => dragId && event.preventDefault()}
        ondragstart={(event) => {
          dragId = cell.id;
          event.dataTransfer?.setData('text/plain', cell.id);
        }}
        ondrop={(event) => {
          event.preventDefault();
          if (dragId) table.moveColumn(dragId, cell.id);
          dragId = null;
        }}
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
        {#if groupable}
          <span class="hdt-group-button" class:hdt-grouped={props.group.grouped}>
            <Button
              aria-label={(props.group.grouped ? localization.ungroupByColumn : localization.groupByColumn).replace(
                '{column}',
                def?.header ?? '',
              )}
              aria-pressed={props.group.grouped}
              icon
              onclick={(event: MouseEvent) => props.group.toggle(event)}
              title={(props.group.grouped ? localization.ungroupByColumn : localization.groupByColumn).replace(
                '{column}',
                def?.header ?? '',
              )}
            >
              <DynamicFeedIcon />
            </Button>
          </span>
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
      {#each cells as cell (cell.id)}
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

<style>
  .hdt-group-button {
    display: inline-flex;
    margin-inline-start: auto;
    opacity: 0.4;
  }
  .hdt-group-button.hdt-grouped,
  .hdt-group-button:hover {
    opacity: 1;
  }
  :global(.hdt-dragging) {
    opacity: 0.4;
  }
  :global(.hdt-head-cell[draggable='true']) {
    cursor: grab;
  }
</style>
