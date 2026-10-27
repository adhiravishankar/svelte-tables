<script lang="ts" generics="TData extends MRT_RowData">
  import type { MRT_Header, MRT_RowData, MRT_TableInstance } from '../../types';

  let {
    header,
    table,
  }: { header: MRT_Header<TData>; table: MRT_TableInstance<TData> } = $props();

  const column = $derived(header.column);
  const columnDef = $derived(column.columnDef);
  const ArrowDownwardIcon = $derived(table.options.icons.ArrowDownwardIcon);
  const SyncAltIcon = $derived(table.options.icons.SyncAltIcon);

  const sorted = $derived(column.getIsSorted());
  const sortCount = $derived(table.atoms.sorting.get().length);
  const sortTooltip = $derived.by(() => {
    const { localization } = table.options;
    if (table.mrtState.isLoading || table.mrtState.showSkeletons) return '';
    return sorted
      ? (sorted === 'desc'
          ? localization.sortedByColumnDesc
          : localization.sortedByColumnAsc
        ).replace('{column}', columnDef.header)
      : (column.getNextSortingOrder() === 'desc'
          ? localization.sortByColumnDesc
          : localization.sortByColumnAsc
        ).replace('{column}', columnDef.header);
  });
</script>

<span class="mrt-sort-wrapper" title={sortTooltip}>
  <button
    type="button"
    class="mrt-sort-label"
    class:mrt-sorted={!!sorted}
    aria-label={sortTooltip}
    onclick={(e) => {
      e.stopPropagation();
      column.getToggleSortingHandler()?.(e);
    }}
  >
    {#if sorted}
      <ArrowDownwardIcon
        class={['mrt-sort-icon', sorted === 'asc' && 'mrt-sort-asc']
          .filter(Boolean)
          .join(' ')}
      />
    {:else}
      <SyncAltIcon
        class="mrt-sort-icon"
        style="transform: rotate(-90deg) scaleX(0.9) translateX(-1px)"
      />
    {/if}
  </button>
  {#if sortCount > 1 && sorted}
    <span class="mrt-sort-badge">{column.getSortIndex() + 1}</span>
  {/if}
</span>

<style>
  .mrt-sort-wrapper {
    display: inline-flex;
    flex: 0 0;
    position: relative;
    width: 3ch;
  }
  .mrt-sort-label {
    align-items: center;
    background: none;
    border: 0;
    color: var(--mrt-text-secondary);
    cursor: pointer;
    display: inline-flex;
    font: inherit;
    opacity: 0.3;
    padding: 0;
    transition: all 150ms ease-in-out;
  }
  .mrt-sorted {
    opacity: 1;
  }
  .mrt-sort-label :global(.mrt-sort-icon) {
    font-size: 1.125rem;
    transition: transform 150ms ease-in-out;
  }
  .mrt-sort-label :global(.mrt-sort-asc) {
    transform: rotate(180deg);
  }
  .mrt-sort-badge {
    background: var(--mdc-theme-primary, #6200ee);
    border-radius: 10px;
    color: var(--mdc-theme-on-primary, #fff);
    font-size: 0.65rem;
    height: 1rem;
    line-height: 1rem;
    min-width: 1rem;
    position: absolute;
    right: -2px;
    text-align: center;
    top: -4px;
  }
</style>
