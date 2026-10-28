<script lang="ts" generics="TData extends RowData">
  import SvelteVirtualList from '@humanspeak/svelte-virtual-list';
  import { createHeadlessTable, DEFAULT_PAGE_SIZES, getColumnId } from '../createHeadlessTable.svelte';
  import { MRT_Localization_EN } from '../locales/en';
  import type { HeadlessTableInstance, HeadlessTableOptions, RowData } from '../types';
  import HeadlessHeader from './HeadlessHeader.svelte';
  import HeadlessPagination from './HeadlessPagination.svelte';
  import HeadlessRow from './HeadlessRow.svelte';
  import HeadlessToolbar from './HeadlessToolbar.svelte';
  import Progress from './kit/Progress.svelte';

  /**
   * A data table built on Svelte Headless Table. Pass `data` and `columns`;
   * every other prop turns a feature on or off (see `HeadlessTableOptions`).
   * The columns and the enabled features are read once, when the table is
   * created; `data` and the display props stay reactive.
   *
   * Bind `table` to read and drive the table from outside.
   */
  let {
    table = $bindable(),
    class: className,
    ...options
  }: HeadlessTableOptions<TData> & {
    class?: string;
    table?: HeadlessTableInstance<TData>;
  } = $props();

  const instance = createHeadlessTable<TData>(() => options);
  table = instance;

  const localization = $derived(options.localization ?? MRT_Localization_EN);
  const defs = $derived(
    Object.fromEntries(options.columns.map((column) => [getColumnId(column), column])),
  );
  const virtualized = $derived(!!options.enableVirtualization);
  const paginated = $derived(options.enablePagination !== false && !virtualized);
  const selectable = $derived(!!options.enableRowSelection);
  const expandable = $derived(!!options.renderDetailPanel);
  const showTop = $derived(options.enableTopToolbar !== false);
  const showBottom = $derived(options.enableBottomToolbar !== false);
  const height = $derived(
    typeof options.height === 'number' ? `${options.height}px` : (options.height ?? '480px'),
  );
  const hasFooter = $derived(options.columns.some((column) => column.footer));
  const selectedCount = $derived(instance.selectedRows.length);
</script>

{#snippet row(item: any)}
  <HeadlessRow
    cellClass={options.classes?.cell}
    {defs}
    detail={options.renderDetailPanel}
    {localization}
    onRowClick={options.onRowClick}
    rowClass={options.classes?.row}
    row={item}
    {selectable}
    table={instance}
  />
{/snippet}

{#snippet header()}
  <HeadlessHeader
    data={options.data}
    {defs}
    enableColumnFilters={!!options.enableColumnFilters}
    enableResizing={!!options.enableColumnResizing}
    {expandable}
    {localization}
    {selectable}
    table={instance}
  />
{/snippet}

{#snippet empty()}
  <div class="hdt-empty">
    {#if options.emptyState}
      {@render options.emptyState()}
    {:else}
      {instance.filteredRows.length === 0 && options.data.length > 0
        ? localization.noResultsFound
        : localization.noRecordsToDisplay}
    {/if}
  </div>
{/snippet}

<div
  class="hdt {className ?? ''} {options.classes?.container ?? ''}"
  data-density={instance.state.density}
  data-striped={options.striped ? '' : undefined}
>
  {#if showTop}
    <HeadlessToolbar
      actions={options.topToolbarActions}
      class={options.classes?.toolbar}
      enableColumnVisibility={options.enableColumnVisibility !== false}
      enableDensityToggle={options.enableDensityToggle !== false}
      enableGlobalFilter={options.enableGlobalFilter !== false}
      {localization}
      table={instance}
    />
  {/if}
  <div class="hdt-progress-slot">
    {#if options.isLoading}<Progress />{/if}
  </div>

  <div {...instance.viewModel.current.tableAttrs} class="hdt-table" aria-busy={options.isLoading}>
    {#if virtualized}
      <div class="hdt-scroll" style:height>
        <div class="hdt-head-gutter">{@render header()}</div>
        {#if instance.rows.length === 0}
          {@render empty()}
        {:else}
          <div class="hdt-virtual">
            <SvelteVirtualList
              defaultEstimatedItemHeight={options.estimatedRowHeight ?? 53}
              itemKey={(item: any) => item.id}
              items={instance.rows}
              viewportLabel="Table rows"
            >
              {#snippet renderItem(item: any)}{@render row(item)}{/snippet}
            </SvelteVirtualList>
          </div>
        {/if}
      </div>
    {:else}
      <div class="hdt-scroll hdt-scroll-auto">
        {@render header()}
        <div {...instance.viewModel.current.tableBodyAttrs} class="hdt-body">
          {#each instance.rows as item (item.id)}
            {@render row(item)}
          {/each}
        </div>
        {#if instance.rows.length === 0}{@render empty()}{/if}
      </div>
    {/if}
    {#if hasFooter}
      <div class="hdt-row hdt-foot-row" role="row">
        {#if selectable}<div class="hdt-cell hdt-fixed" style="flex: 0 0 48px"></div>{/if}
        {#if expandable}<div class="hdt-cell hdt-fixed" style="flex: 0 0 48px"></div>{/if}
        {#each instance.visibleColumns as column (column.id)}
          <div class="hdt-cell" role="cell" style="flex: 1 1 0; min-width: {defs[column.id]?.minWidth ?? 96}px">
            {defs[column.id]?.footer ?? ''}
          </div>
        {/each}
      </div>
    {/if}
  </div>

  {#if showBottom}
    <div class="hdt-bottom {options.classes?.bottomToolbar ?? ''}">
      <span class="hdt-selected-count">
        {#if selectable}
          {localization.selectedCountOfRowCountRowsSelected
            .replace('{selectedCount}', String(selectedCount))
            .replace('{rowCount}', String(instance.filteredRows.length))}
        {/if}
      </span>
      {#if paginated}
        <HeadlessPagination
          {localization}
          pageSizes={options.pageSizes ?? DEFAULT_PAGE_SIZES}
          table={instance}
        />
      {:else}
        <span class="hdt-total">{instance.filteredRows.length} {localization.of} {options.data.length}</span>
      {/if}
    </div>
  {/if}
</div>

<style>
  .hdt {
    --hdt-bg: var(--mdc-theme-surface, #fff);
    --hdt-fg: var(--mdc-theme-on-surface, rgba(0, 0, 0, 0.87));
    --hdt-border: color-mix(in srgb, var(--hdt-fg) 12%, transparent);
    --hdt-muted: color-mix(in srgb, var(--hdt-fg) 60%, transparent);
    --hdt-hover: color-mix(in srgb, var(--hdt-fg) 4%, transparent);
    --hdt-selected: color-mix(in srgb, var(--mdc-theme-primary, #6200ee) 12%, var(--hdt-bg));
    --hdt-row-y: 0.75rem;
    background: var(--hdt-bg);
    border-radius: 4px;
    box-shadow:
      0 3px 1px -2px rgba(0, 0, 0, 0.2),
      0 2px 2px 0 rgba(0, 0, 0, 0.14),
      0 1px 5px 0 rgba(0, 0, 0, 0.12);
    color: var(--hdt-fg);
    display: flex;
    flex-direction: column;
    font-family: var(--mdc-typography-body2-font-family, Roboto, sans-serif);
    font-size: 0.875rem;
    overflow: hidden;
    width: 100%;
  }
  .hdt[data-density='compact'] {
    --hdt-row-y: 0.25rem;
  }
  .hdt[data-density='spacious'] {
    --hdt-row-y: 1.25rem;
  }
  .hdt-progress-slot {
    height: 4px;
  }
  .hdt-table {
    min-width: 0;
  }
  .hdt-scroll {
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .hdt-scroll-auto {
    overflow-x: auto;
  }
  .hdt-head-gutter {
    overflow-y: hidden;
    scrollbar-gutter: stable;
  }
  .hdt-virtual {
    flex: 1 1 0;
    min-height: 0;
  }
  .hdt-bottom {
    align-items: center;
    border-top: 1px solid var(--hdt-border);
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    justify-content: space-between;
    padding: 0.5rem;
  }
  .hdt-selected-count,
  .hdt-total {
    color: var(--hdt-muted);
    font-size: 0.875rem;
  }
  .hdt-empty {
    color: var(--hdt-muted);
    padding: 2rem 1rem;
    text-align: center;
  }

  /* header, rows and cells are rendered by child components */
  .hdt :global(.hdt-row) {
    align-items: center;
    display: flex;
    min-width: max-content;
    width: 100%;
  }
  .hdt :global(.hdt-head) {
    background: var(--hdt-bg);
    border-bottom: 1px solid var(--hdt-border);
    min-width: max-content;
  }
  .hdt :global(.hdt-cell) {
    align-items: center;
    box-sizing: border-box;
    display: flex;
    min-width: 0;
    overflow: hidden;
    padding: var(--hdt-row-y) 0.75rem;
    position: relative;
    text-overflow: ellipsis;
  }
  .hdt :global(.hdt-head-cell) {
    font-weight: 600;
    white-space: nowrap;
  }
  .hdt :global(.hdt-filter-row .hdt-cell) {
    padding-block: 0.25rem 0.5rem;
  }
  .hdt :global(.hdt-fixed) {
    justify-content: center;
    padding-inline: 0;
  }
  .hdt :global(.hdt-body-row) {
    border-bottom: 1px solid var(--hdt-border);
  }
  .hdt :global(.hdt-body-row:hover) {
    background: var(--hdt-hover);
  }
  .hdt[data-striped] :global(.hdt-body-row:nth-child(even)) {
    background: color-mix(in srgb, var(--hdt-fg) 3%, var(--hdt-bg));
  }
  .hdt :global(.hdt-body-row[data-selected='true']) {
    background: var(--hdt-selected);
  }
  .hdt :global(.hdt-clickable) {
    cursor: pointer;
  }
  .hdt :global(.hdt-detail) {
    border-bottom: 1px solid var(--hdt-border);
    padding: 1rem;
  }
  .hdt :global(.hdt-foot-row) {
    border-top: 1px solid var(--hdt-border);
    font-weight: 600;
  }
  .hdt :global(.hdt-sort) {
    align-items: center;
    background: none;
    border: 0;
    color: inherit;
    cursor: pointer;
    display: inline-flex;
    font: inherit;
    gap: 0.25rem;
    padding: 0;
  }
  .hdt :global(.hdt-sort-icon) {
    display: inline-flex;
    opacity: 0;
    transition: transform 150ms;
  }
  .hdt :global(.hdt-sort:hover .hdt-sort-icon) {
    opacity: 0.4;
  }
  .hdt :global(.hdt-sort-icon.hdt-sort-active) {
    opacity: 1;
  }
  .hdt :global(.hdt-sort-icon.hdt-sort-asc) {
    transform: rotate(180deg);
  }
  .hdt :global(.hdt-resize) {
    bottom: 0;
    cursor: col-resize;
    position: absolute;
    right: 0;
    top: 0;
    touch-action: none;
    user-select: none;
    width: 6px;
  }
  .hdt :global(.hdt-resize:hover) {
    background: var(--mdc-theme-primary, #6200ee);
    opacity: 0.4;
  }
</style>
