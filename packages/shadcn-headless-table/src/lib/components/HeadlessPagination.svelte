<script lang="ts" generics="TData extends RowData">
  import ChevronLeftIcon from '../icons/ChevronLeftIcon.svelte';
  import ChevronRightIcon from '../icons/ChevronRightIcon.svelte';
  import FirstPageIcon from '../icons/FirstPageIcon.svelte';
  import LastPageIcon from '../icons/LastPageIcon.svelte';
  import type { HeadlessLocalization, HeadlessTableInstance, RowData } from '../types';
  import Button from './kit/Button.svelte';
  import Select from './kit/Select.svelte';

  let {
    localization,
    pageSizes,
    table,
  }: {
    localization: HeadlessLocalization;
    pageSizes: number[];
    table: HeadlessTableInstance<TData>;
  } = $props();

  const total = $derived(table.filteredRows.length);
  const { pageIndex, pageSize } = $derived(table.state);
  const from = $derived(total === 0 ? 0 : pageIndex * pageSize + 1);
  const to = $derived(Math.min(total, (pageIndex + 1) * pageSize));
  const last = $derived(table.pageCount - 1);
</script>

<div class="hdt-pagination">
  <label class="hdt-pagination-size">
    <span>{localization.rowsPerPage}</span>
    <Select
      class="hdt-pagination-select"
      label={localization.rowsPerPage}
      onchange={(value) => table.setPageSize(Number(value))}
      options={pageSizes.map((size) => ({ label: String(size), value: size }))}
      value={pageSize}
    />
  </label>
  <span class="hdt-pagination-range">{from}–{to} {localization.of} {total}</span>
  <div class="hdt-pagination-buttons">
    <Button
      aria-label={localization.goToFirstPage}
      disabled={pageIndex <= 0}
      icon
      onclick={() => table.setPageIndex(0)}
      title={localization.goToFirstPage}
    >
      <FirstPageIcon />
    </Button>
    <Button
      aria-label={localization.goToPreviousPage}
      disabled={pageIndex <= 0}
      icon
      onclick={() => table.setPageIndex(pageIndex - 1)}
      title={localization.goToPreviousPage}
    >
      <ChevronLeftIcon />
    </Button>
    <Button
      aria-label={localization.goToNextPage}
      disabled={pageIndex >= last}
      icon
      onclick={() => table.setPageIndex(pageIndex + 1)}
      title={localization.goToNextPage}
    >
      <ChevronRightIcon />
    </Button>
    <Button
      aria-label={localization.goToLastPage}
      disabled={pageIndex >= last}
      icon
      onclick={() => table.setPageIndex(last)}
      title={localization.goToLastPage}
    >
      <LastPageIcon />
    </Button>
  </div>
</div>

<style>
  .hdt-pagination {
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: flex-end;
  }
  .hdt-pagination-size {
    align-items: center;
    display: flex;
    font-size: 0.875rem;
    gap: 0.5rem;
    white-space: nowrap;
  }
  .hdt-pagination-size :global(.hdt-pagination-select) {
    width: 4.5rem;
  }
  .hdt-pagination-range {
    font-size: 0.875rem;
    white-space: nowrap;
  }
  .hdt-pagination-buttons {
    display: flex;
  }
</style>
