<script lang="ts" generics="TData extends MRT_RowData">
  import { Item, Text } from '@smui/list';
  import { untrack } from 'svelte';
  import type { MRT_Header, MRT_RowData, MRT_TableInstance } from '../../types';
  import {
    getColumnFilterInfo,
    getDropdownOptions,
  } from '../../utils/column.utils';
  import { getFilterModeLabel } from '../../utils/filterOptions';
  import { getValueAndLabel } from '../../utils/utils';
  import MRT_FilterModeButton from '../buttons/MRT_FilterModeButton.svelte';
  import MRT_IconButton from '../buttons/MRT_IconButton.svelte';
  import MRT_Menu from '../menus/MRT_Menu.svelte';

  /** The `select` and `multi-select` column filters. */
  let {
    header,
    table,
  }: { header: MRT_Header<TData>; table: MRT_TableInstance<TData> } = $props();

  const column = $derived(header.column);
  const columnDef = $derived(column.columnDef);
  const { localization } = $derived(table.options);
  const { CloseIcon } = $derived(table.options.icons);
  const info = $derived(getColumnFilterInfo({ header, table }));
  const dropdownOptions = $derived(getDropdownOptions({ header, table }));
  const multiple = $derived(info.isMultiSelectFilter);

  const options = $derived(
    (dropdownOptions ?? []).map((option) => {
      const { label, value } = getValueAndLabel(option);
      return {
        count: !columnDef.filterSelectOptions
          ? info.facetedUniqueValues?.get(value)
          : undefined,
        label,
        value,
      };
    }),
  );

  const filterValue = $derived(column.getFilterValue());
  const selected = $derived(
    multiple ? (Array.isArray(filterValue) ? (filterValue as string[]) : []) : [],
  );
  const hasValue = $derived(
    multiple ? selected.length > 0 : !!filterValue && filterValue !== '',
  );
  const placeholder = $derived(
    localization.filterByColumn?.replace('{column}', String(columnDef.header)),
  );
  const showChangeModeButton = $derived(
    !!(
      table.options.enableColumnFilterModes &&
      columnDef.enableColumnFilterModes !== false &&
      (info.allowedColumnFilterOptions === undefined ||
        !!info.allowedColumnFilterOptions?.length)
    ),
  );

  let menuAnchor = $state<HTMLElement | null>(null);

  function onselectchange(event: Event) {
    const raw = (event.target as HTMLSelectElement).value;
    const match = options.find((o) => String(o.value) === raw);
    column.setFilterValue(match ? match.value : undefined);
  }

  function toggle(value: string) {
    const next = selected.includes(value)
      ? selected.filter((v) => v !== value)
      : [...selected, value];
    column.setFilterValue(next);
  }

  function handleClear() {
    column.setFilterValue(multiple ? [] : undefined);
  }

  function attachInput(node: HTMLElement) {
    const el = node.querySelector<HTMLElement>('select, button');
    const key = `${column.id}-0`;
    const refs = untrack(() => table.refs.filterInputRefs.current);
    if (refs && el) refs[key] = el as HTMLInputElement;
    return () => {
      if (refs) delete refs[key];
    };
  }
</script>

{#if columnDef.Filter}
  {@render columnDef.Filter({ column, header, table })}
{:else}
  <!-- svelte-ignore a11y_no_static_element_interactions, a11y_click_events_have_key_events -->
  <div
    class="mrt-filter-select"
    onclick={(e) => e.stopPropagation()}
    onkeydown={(e) => e.stopPropagation()}
    {@attach attachInput}
  >
    <div class="mrt-filter-select-row">
      {#if showChangeModeButton}
        <MRT_FilterModeButton {header} {table} />
      {/if}
      {#if multiple}
        <button
          aria-haspopup="listbox"
          aria-label={placeholder}
          class="mrt-select-trigger"
          onclick={(e) => (menuAnchor = e.currentTarget)}
          type="button"
        >
          {#if selected.length === 0}
            <span class="mrt-select-placeholder">{placeholder}</span>
          {:else}
            {#each selected as value (value)}
              <span class="mrt-chip">
                {options.find((o) => o.value === value)?.label ?? value}
              </span>
            {/each}
          {/if}
        </button>
      {:else}
        <select
          aria-label={placeholder}
          class="mrt-select-native"
          onchange={onselectchange}
          title={placeholder}
          value={filterValue === undefined ? '' : String(filterValue)}
        >
          <option value="" disabled hidden>{placeholder}</option>
          {#each options as option (option.value)}
            <option value={String(option.value)}>
              {option.label}{option.count !== undefined ? ` (${option.count})` : ''}
            </option>
          {/each}
        </select>
      {/if}
      <span class="mrt-clear" style:visibility={hasValue ? 'visible' : 'hidden'}>
        <MRT_IconButton
          disabled={!hasValue}
          label={localization.clearFilter}
          onclick={handleClear}
          size="mini"
          style="height: 2rem; width: 2rem; padding: 0; transform: scale(0.9)"
        >
          <CloseIcon />
        </MRT_IconButton>
      </span>
    </div>
    {#if showChangeModeButton}
      <span class="mrt-filter-mode-label">
        {localization.filterMode.replace(
          '{filterType}',
          getFilterModeLabel(localization, info.currentFilterOption),
        )}
      </span>
    {/if}
  </div>

  {#if multiple}
    <MRT_Menu
      anchorEl={menuAnchor}
      onclose={() => (menuAnchor = null)}
      {table}
    >
      {#each options as option, index (`${index}-${option.value}`)}
        <Item onclick={() => toggle(option.value)} tabindex={0}>
          <input
            aria-label={option.label}
            checked={selected.includes(option.value)}
            class="mrt-menu-check"
            onclick={(e) => e.preventDefault()}
            readonly
            tabindex={-1}
            type="checkbox"
          />
          <Text>
            {option.label}
            {option.count !== undefined ? ` (${option.count})` : ''}
          </Text>
        </Item>
      {/each}
    </MRT_Menu>
  {/if}
{/if}

<style>
  .mrt-filter-select {
    margin: 0 -2px;
    min-width: 120px;
    width: calc(100% + 4px);
  }
  .mrt-filter-select-row {
    align-items: center;
    border-bottom: 1px solid var(--mrt-text-secondary);
    display: flex;
    min-height: 2.5rem;
  }
  .mrt-select-native,
  .mrt-select-trigger {
    background: transparent;
    border: 0;
    color: inherit;
    flex: 1;
    font: inherit;
    min-width: 0;
    padding: 4px 0;
    text-align: start;
  }
  .mrt-select-trigger {
    align-items: center;
    cursor: pointer;
    display: flex;
    flex-wrap: wrap;
    gap: 2px;
  }
  .mrt-select-placeholder {
    opacity: 0.5;
  }
  .mrt-chip {
    background: var(--mrt-divider);
    border-radius: 16px;
    font-size: 0.8125rem;
    padding: 2px 10px;
  }
  .mrt-menu-check {
    accent-color: var(--mdc-theme-primary, #6200ee);
    margin-inline-end: 0.5rem;
    pointer-events: none;
  }
  .mrt-filter-mode-label {
    color: var(--mrt-text-secondary);
    display: block;
    font-size: 0.75rem;
    font-weight: normal;
    line-height: 0.8rem;
    white-space: nowrap;
  }
</style>
