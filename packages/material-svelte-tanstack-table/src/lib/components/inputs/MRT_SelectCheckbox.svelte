<script lang="ts" generics="TData extends MRT_RowData">
  import Checkbox from '@smui/checkbox';
  import type { MRT_Row, MRT_RowData, MRT_TableInstance } from '../../types';
  import {
    getIsRowSelected,
    getMRT_RowSelectionHandler,
    getMRT_SelectAllHandler,
  } from '../../utils/row.utils';
  import { parseFromValuesOrFunc } from '../../utils/utils';

  /**
   * The row-select checkbox, or the select-all checkbox when `row` is omitted.
   * Renders a radio button when `enableMultiRowSelection` is `false`.
   */
  let {
    row,
    staticRowIndex,
    table,
    ...rest
  }: {
    row?: MRT_Row<TData>;
    staticRowIndex?: number;
    table: MRT_TableInstance<TData>;
    [key: string]: any;
  } = $props();

  const selectAll = $derived(!row);
  const { localization } = $derived(table.options);
  const compact = $derived(table.mrtState.density === 'compact');

  const checkboxProps = $derived({
    ...(row
      ? parseFromValuesOrFunc(table.options.selectCheckboxProps, {
          row,
          staticRowIndex,
          table,
        })
      : parseFromValuesOrFunc(table.options.selectAllCheckboxProps, { table })),
    ...rest,
  });

  const isChecked = $derived(
    row
      ? getIsRowSelected({ row, table })
      : table.options.selectAllMode === 'page'
        ? table.getIsAllPageRowsSelected()
        : table.getIsAllRowsSelected(),
  );
  const isIndeterminate = $derived(
    !isChecked &&
      (row
        ? row.getIsSomeSelected() && row.getCanSelectSubRows()
        : table.getIsSomeRowsSelected()),
  );
  const disabled = $derived(
    !!table.mrtState.isLoading ||
      (!!row && !row.getCanSelect()) ||
      row?.id === 'mrt-row-create',
  );
  const label = $derived(
    selectAll ? localization.toggleSelectAll : localization.toggleSelectRow,
  );

  // `click` (not `change`) because it carries `shiftKey` for range selection
  function onclick(event: MouseEvent) {
    event.stopPropagation();
    if (row) {
      getMRT_RowSelectionHandler({ row, staticRowIndex, table })(event);
    } else {
      getMRT_SelectAllHandler({ table })(event);
    }
  }
</script>

<span class="mrt-select" class:mrt-select-compact={compact} title={label}>
  {#if table.options.enableMultiRowSelection === false}
    <input
      aria-label={label}
      checked={isChecked}
      {disabled}
      {onclick}
      onchange={() => {}}
      type="radio"
      class="mrt-radio"
    />
  {:else}
    <Checkbox
      checked={isChecked}
      indeterminate={isIndeterminate}
      {disabled}
      input$aria-label={label}
      input$onclick={onclick}
      touch
    />
  {/if}
</span>

<style>
  .mrt-select {
    display: inline-flex;
    height: 2.5rem;
    margin: -0.4rem;
    width: 2.5rem;
  }
  .mrt-select-compact {
    height: 1.75rem;
    margin: 0;
    width: 1.75rem;
  }
  .mrt-radio {
    accent-color: var(--mdc-theme-primary, #6200ee);
    height: 1.25rem;
    margin: auto;
    width: 1.25rem;
  }
</style>
