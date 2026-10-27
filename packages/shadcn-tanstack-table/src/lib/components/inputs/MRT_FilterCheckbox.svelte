<script lang="ts" generics="TData extends MRT_RowData">
  import { Checkbox } from '../ui/checkbox';
  import type { MRT_Header, MRT_RowData, MRT_TableInstance } from '../../types';
  import { parseFromValuesOrFunc } from '../../utils/utils';

  /** A three-state (any / true / false) checkbox filter. */
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
  const checkboxProps = $derived({
    ...parseFromValuesOrFunc(table.options.filterCheckboxProps, { column, table }),
    ...parseFromValuesOrFunc(columnDef.filterCheckboxProps, { column, table }),
    ...rest,
  });

  const filterValue = $derived(column.getFilterValue());
  const filterLabel = $derived(
    table.options.localization.filterByColumn?.replace('{column}', columnDef.header),
  );
  const label = $derived(checkboxProps.title ?? filterLabel);

  // any -> true -> false -> any
  function onclick(event: MouseEvent) {
    event.stopPropagation();
    column.setFilterValue(
      filterValue === undefined ? 'true' : filterValue === 'true' ? 'false' : undefined,
    );
    checkboxProps.onclick?.(event);
  }

  // The shadcn checkbox toggles itself after `click` handlers have run, so the
  // filter is cycled from its change callback.
  let lastClick: MouseEvent | undefined;
  function onCheckboxChange() {
    if (lastClick) onclick(lastClick);
    lastClick = undefined;
  }
</script>

{#if columnDef.Filter}
  {@render columnDef.Filter({ column, header, table })}
{:else}
  <label class="mrt-filter-checkbox" title={label}>
    <Checkbox
      aria-label={label}
      checked={filterValue === 'true'}
      indeterminate={filterValue === undefined}
      onclick={(event: MouseEvent) => {
        event.stopPropagation();
        lastClick = event;
      }}
      onCheckedChange={onCheckboxChange}
    />
    <span>{label}</span>
  </label>
{/if}

<style>
  .mrt-filter-checkbox {
    align-items: center;
    color: var(--mrt-text-secondary);
    display: flex;
    font-weight: normal;
    gap: 0.5rem;
    margin-top: -4px;
  }
</style>
