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
  import type { Snippet } from 'svelte';
  import { cellStyle, EXPAND_COLUMN_WIDTH, SELECT_COLUMN_WIDTH } from '../utils/cell';
  import Button from './kit/Button.svelte';
  import Checkbox from './kit/Checkbox.svelte';

  let {
    cellClass,
    defs,
    detail,
    localization,
    onRowClick,
    rowClass,
    selectable,
    row,
    table,
  }: {
    cellClass?: string;
    defs: Record<string, HeadlessColumnDef<TData>>;
    detail?: Snippet<[CellContext<TData>]>;
    localization: HeadlessLocalization;
    onRowClick?: (context: CellContext<TData>, event: MouseEvent) => void;
    rowClass?: string;
    selectable: boolean;
    row: any;
    table: HeadlessTableInstance<TData>;
  } = $props();

  const selected = $derived(table.isRowSelected(row.dataId));
  const expanded = $derived(!!detail && table.isExpanded(row.dataId));
  const context = $derived<CellContext<TData>>({
    row: row.original,
    rowId: row.dataId,
    value: undefined,
  });
</script>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
<div
  {...row.current.attrs}
  aria-selected={selectable ? selected : undefined}
  class="hdt-row hdt-body-row {rowClass ?? ''}"
  class:hdt-clickable={!!onRowClick}
  data-selected={selected}
  onclick={(event) => onRowClick?.(context, event)}
>
  {#if selectable}
    <div class="hdt-cell hdt-fixed" role="cell" style="flex: 0 0 {SELECT_COLUMN_WIDTH}px">
      <Checkbox
        checked={selected}
        label={localization.toggleSelectRow}
        onchange={(value) => table.toggleRow(row.dataId, value)}
      />
    </div>
  {/if}
  {#if detail}
    <div class="hdt-cell hdt-fixed" role="cell" style="flex: 0 0 {EXPAND_COLUMN_WIDTH}px">
      <Button
        aria-expanded={expanded}
        aria-label={expanded ? localization.collapse : localization.expand}
        icon
        onclick={(event: MouseEvent) => {
          event.stopPropagation();
          table.toggleExpanded(row.dataId);
        }}
        title={expanded ? localization.collapse : localization.expand}
      >
        {#if expanded}<ExpandMoreIcon />{:else}<ChevronRightIcon />{/if}
      </Button>
    </div>
  {/if}
  {#each row.cells as cell (cell.id)}
    <div
      {...cell.current.attrs}
      class="hdt-cell {cellClass ?? ''}"
      style={cellStyle(defs[cell.column.id], cell.current.attrs.style)}
    >
      <Render of={cell.render()} />
    </div>
  {/each}
</div>
{#if expanded && detail}
  <div class="hdt-detail" role="row">
    <div role="cell">{@render detail(context)}</div>
  </div>
{/if}
