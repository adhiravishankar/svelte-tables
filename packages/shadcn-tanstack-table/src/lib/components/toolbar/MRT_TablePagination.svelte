<script lang="ts" generics="TData extends MRT_RowData">
  import type { MRT_RowData, MRT_TableInstance } from '../../types';
  import { flipIconStyle } from '../../utils/style.utils';
  import { createMediaQuery } from '../../utils/mediaQuery.svelte';
  import { parseFromValuesOrFunc } from '../../utils/utils';
  import MRT_IconButton from '../buttons/MRT_IconButton.svelte';

  const defaultRowsPerPage = [5, 10, 15, 20, 25, 30, 50, 100];

  let {
    position = 'bottom',
    table,
    ...rest
  }: {
    position?: 'bottom' | 'top';
    table: MRT_TableInstance<TData>;
    [key: string]: any;
  } = $props();

  const isMobile = createMediaQuery('(max-width: 720px)');

  const paginationProps = $derived({
    ...parseFromValuesOrFunc(table.options.paginationProps, { table }),
    ...rest,
  });

  const { localization } = $derived(table.options);
  const { ChevronLeftIcon, ChevronRightIcon, FirstPageIcon, LastPageIcon } =
    $derived(table.options.icons);

  const pagination = $derived(table.atoms.pagination.get());
  const pageIndex = $derived(pagination.pageIndex ?? 0);
  const pageSize = $derived(pagination.pageSize ?? 10);
  const totalRowCount = $derived(table.getRowCount());
  const numberOfPages = $derived(table.getPageCount());
  const showFirstLastPageButtons = $derived(numberOfPages > 2);
  const firstRowIndex = $derived(pageIndex * pageSize);
  const lastRowIndex = $derived(Math.min(firstRowIndex + pageSize, totalRowCount));

  const disabled = $derived(paginationProps.disabled ?? false);
  const showFirstButton = $derived(
    paginationProps.showFirstButton ?? showFirstLastPageButtons,
  );
  const showLastButton = $derived(
    paginationProps.showLastButton ?? showFirstLastPageButtons,
  );
  const showRowsPerPage = $derived(paginationProps.showRowsPerPage ?? true);
  const rowsPerPageOptions = $derived(
    (paginationProps.rowsPerPageOptions ?? defaultRowsPerPage) as Array<
      { label: string; value: number } | number
    >,
  );

  const disableBack = $derived(pageIndex <= 0 || disabled);
  const disableNext = $derived(lastRowIndex >= totalRowCount || disabled);

  const flip = $derived(
    flipIconStyle(
      typeof document !== 'undefined' ? document.dir || undefined : undefined,
    ),
  );

  const format = (n: number) => n.toLocaleString(localization.language);
  const rangeLabel = $derived(
    `${lastRowIndex === 0 ? 0 : format(firstRowIndex + 1)}-${format(lastRowIndex)} ${
      localization.of
    } ${format(totalRowCount)}`,
  );

  /** Page numbers (1-based) to show in `pages` mode, with gaps as `null`. */
  const pageItems = $derived.by(() => {
    const current = pageIndex + 1;
    const last = numberOfPages;
    const pages = new Set(
      [1, last, current - 1, current, current + 1].filter(
        (p) => p >= 1 && p <= last,
      ),
    );
    const sorted = [...pages].sort((a, b) => a - b);
    const items: Array<number | null> = [];
    sorted.forEach((p, i) => {
      if (i > 0 && p - sorted[i - 1] > 1) items.push(null);
      items.push(p);
    });
    return items;
  });
</script>

<div
  class="mrt-pagination"
  class:mrt-pagination-top-offset={position === 'top' &&
    table.options.enableToolbarInternalActions}
  class:mrt-pagination-mobile={isMobile.current}
>
  {#if showRowsPerPage}
    <div class="mrt-rows-per-page">
      <label for="mrt-rows-per-page-{table.options.id}">
        {localization.rowsPerPage}
      </label>
      <select
        id="mrt-rows-per-page-{table.options.id}"
        {disabled}
        value={pageSize}
        onchange={(e) => table.setPageSize(+e.currentTarget.value)}
      >
        {#each rowsPerPageOptions as option}
          {@const value = typeof option !== 'number' ? option.value : option}
          <option {value}>
            {typeof option !== 'number' ? option.label : `${option}`}
          </option>
        {/each}
      </select>
    </div>
  {/if}

  {#if table.options.paginationDisplayMode === 'pages'}
    <nav aria-label="pagination" class="mrt-page-list">
      {#if showFirstButton}
        <MRT_IconButton
          disabled={disableBack}
          label={localization.goToFirstPage}
          onclick={() => table.firstPage()}
          size="button"
        >
          <FirstPageIcon style={flip} />
        </MRT_IconButton>
      {/if}
      <MRT_IconButton
        disabled={disableBack}
        label={localization.goToPreviousPage}
        onclick={() => table.previousPage()}
        size="button"
      >
        <ChevronLeftIcon style={flip} />
      </MRT_IconButton>
      {#each pageItems as item}
        {#if item === null}
          <span class="mrt-page-gap">…</span>
        {:else}
          <button
            aria-current={item === pageIndex + 1 ? 'page' : undefined}
            class="mrt-page-button"
            class:mrt-page-current={item === pageIndex + 1}
            {disabled}
            onclick={() => table.setPageIndex(item - 1)}
            type="button"
          >
            {item}
          </button>
        {/if}
      {/each}
      <MRT_IconButton
        disabled={disableNext}
        label={localization.goToNextPage}
        onclick={() => table.nextPage()}
        size="button"
      >
        <ChevronRightIcon style={flip} />
      </MRT_IconButton>
      {#if showLastButton}
        <MRT_IconButton
          disabled={disableNext}
          label={localization.goToLastPage}
          onclick={() => table.lastPage()}
          size="button"
        >
          <LastPageIcon style={flip} />
        </MRT_IconButton>
      {/if}
    </nav>
  {:else if table.options.paginationDisplayMode === 'default'}
    <span class="mrt-range">{rangeLabel}</span>
    <div class="mrt-page-buttons">
      {#if showFirstButton}
        <MRT_IconButton
          disabled={disableBack}
          label={localization.goToFirstPage}
          onclick={() => table.firstPage()}
          size="button"
        >
          <FirstPageIcon style={flip} />
        </MRT_IconButton>
      {/if}
      <MRT_IconButton
        disabled={disableBack}
        label={localization.goToPreviousPage}
        onclick={() => table.previousPage()}
        size="button"
      >
        <ChevronLeftIcon style={flip} />
      </MRT_IconButton>
      <MRT_IconButton
        disabled={disableNext}
        label={localization.goToNextPage}
        onclick={() => table.nextPage()}
        size="button"
      >
        <ChevronRightIcon style={flip} />
      </MRT_IconButton>
      {#if showLastButton}
        <MRT_IconButton
          disabled={disableNext}
          label={localization.goToLastPage}
          onclick={() => table.lastPage()}
          size="button"
        >
          <LastPageIcon style={flip} />
        </MRT_IconButton>
      {/if}
    </div>
  {/if}
</div>

<style>
  .mrt-pagination {
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    justify-content: space-between;
    justify-self: flex-end;
    padding: 12px 8px;
    position: relative;
    z-index: 2;
  }
  .mrt-pagination-mobile {
    justify-content: center;
  }
  .mrt-pagination-top-offset {
    margin-top: 3rem;
  }
  .mrt-rows-per-page {
    align-items: center;
    display: flex;
    gap: 8px;
  }
  .mrt-rows-per-page select {
    background: transparent;
    border: 0;
    border-bottom: 1px solid var(--mrt-divider);
    color: inherit;
    font: inherit;
    padding: 4px 0;
  }
  .mrt-range {
    margin: 0 4px;
    min-width: 8ch;
    text-align: center;
  }
  .mrt-page-buttons,
  .mrt-page-list {
    align-items: center;
    display: flex;
  }
  .mrt-page-button {
    background: none;
    border: 0;
    border-radius: 16px;
    color: inherit;
    cursor: pointer;
    font: inherit;
    height: 32px;
    min-width: 32px;
  }
  .mrt-page-current {
    background: color-mix(
      in srgb,
      var(--primary) 14%,
      transparent
    );
    color: var(--primary);
  }
  .mrt-page-gap {
    padding: 0 4px;
  }
</style>
