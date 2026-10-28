<script lang="ts" generics="TData extends RowData">
  import { Render } from '@humanspeak/svelte-headless-table';
  import ChevronRightIcon from '../icons/ChevronRightIcon.svelte';
  import ExpandMoreIcon from '../icons/ExpandMoreIcon.svelte';
  import type {
    CellContext,
    HeadlessColumnDef,
    HeadlessLocalization,
    HeadlessTableInstance,
    RowData,
  } from '../types';
  import { cellStyle, SELECT_COLUMN_WIDTH } from '../utils/cell';
  import Checkbox from './kit/Checkbox.svelte';

  let {
    cellClass,
    defs,
    localization,
    onRowClick,
    rowClass,
    selectable,
    row,
    table,
  }: {
    cellClass?: string;
    defs: Record<string, HeadlessColumnDef<TData>>;
    localization: HeadlessLocalization;
    onRowClick?: (context: CellContext<TData>, event: MouseEvent) => void;
    rowClass?: string;
    selectable: boolean;
    row: any;
    table: HeadlessTableInstance<TData>;
  } = $props();

  // Rows made by the group by plugin have no data of their own.
  const isData = $derived(row.isData());
  const rowId = $derived<string>(isData ? row.dataId : row.id);
  const selected = $derived(isData && table.isRowSelected(rowId));
  const context = $derived<CellContext<TData>>({
    row: row.original,
    rowId,
    value: undefined,
  });

  const groupColumn = $derived(isData ? undefined : table.state.grouping[row.depth]);
  const groupOpen = $derived(!isData && table.isGroupExpanded(row.id));
  const leafCount = (item: any): number =>
    item.subRows?.length ? item.subRows.reduce((sum: number, sub: any) => sum + leafCount(sub), 0) : 1;
  const indent = $derived(row.depth > 0 ? `padding-inline-start: calc(0.75rem + ${row.depth}rem); ` : '');
</script>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
<div
  {...row.current.attrs}
  aria-expanded={isData ? undefined : groupOpen}
  aria-selected={selectable && isData ? selected : undefined}
  class="hdt-row hdt-body-row {rowClass ?? ''}"
  class:hdt-clickable={!!onRowClick || !isData}
  class:hdt-group-row={!isData}
  data-selected={selected}
  onclick={(event) => (isData ? onRowClick?.(context, event) : table.toggleGroupRow(row.id))}
>
  {#if selectable}
    <div class="hdt-cell hdt-fixed" role="cell" style="flex: 0 0 {SELECT_COLUMN_WIDTH}px">
      {#if isData}
        <Checkbox
          checked={selected}
          label={localization.toggleSelectRow}
          onchange={(value) => table.toggleRow(rowId, value)}
        />
      {/if}
    </div>
  {/if}
  {#each row.cells as cell, index (cell.id)}
    <div
      {...cell.current.attrs}
      class="hdt-cell {cellClass ?? ''}"
      style="{index === 0 ? indent : ''}{cellStyle(defs[cell.id], cell.current.attrs.style)}"
    >
      {#if !isData && cell.id === groupColumn}
        <span class="hdt-group-toggle">
          {#if groupOpen}<ExpandMoreIcon />{:else}<ChevronRightIcon />{/if}
          <Render of={cell.render()} />
          <span class="hdt-group-count">({leafCount(row)})</span>
        </span>
      {:else}
        <Render of={cell.render()} />
      {/if}
    </div>
  {/each}
</div>

<style>
  .hdt-group-toggle {
    align-items: center;
    display: inline-flex;
    font-weight: 600;
    gap: 0.25rem;
  }
  .hdt-group-count {
    color: var(--hdt-muted);
    font-weight: normal;
  }
</style>
