<script lang="ts" generics="TData extends MRT_RowData">
  import { untrack } from 'svelte';
  import type { MRT_Header, MRT_RowData, MRT_TableInstance } from '../../types';
  import {
    getColumnFilterInfo,
    getDropdownOptions,
  } from '../../utils/column.utils';
  import {
    formatDateInput,
    getDateInputType,
    parseDateInput,
  } from '../../utils/dateInput';
  import { getFilterModeLabel } from '../../utils/filterOptions';
  import {
    debounce,
    getValueAndLabel,
    parseFromValuesOrFunc,
  } from '../../utils/utils';
  import MRT_FilterModeButton from '../buttons/MRT_FilterModeButton.svelte';
  import MRT_IconButton from '../buttons/MRT_IconButton.svelte';
  import MRT_TextField from './MRT_TextField.svelte';

  /**
   * The text-like column filter: text, number, date / datetime / time (native
   * inputs) and autocomplete (a `<datalist>`). Also used for each side of a
   * range filter through `rangeFilterIndex`.
   */
  let {
    header,
    rangeFilterIndex,
    table,
    ...rest
  }: {
    header: MRT_Header<TData>;
    rangeFilterIndex?: number;
    table: MRT_TableInstance<TData>;
    [key: string]: any;
  } = $props();

  const column = $derived(header.column);
  const columnDef = $derived(column.columnDef);
  const { localization } = $derived(table.options);
  const { CloseIcon } = $derived(table.options.icons);

  const info = $derived(getColumnFilterInfo({ header, table }));
  const {
    allowedColumnFilterOptions,
    currentFilterOption,
    isAutocompleteFilter,
    isDateFilter,
    isMultiSelectFilter,
    isRangeFilter,
    isTextboxFilter,
  } = $derived(info);

  const args = $derived({ column, rangeFilterIndex, table });
  const textFieldProps = $derived({
    ...parseFromValuesOrFunc(table.options.filterTextFieldProps, args),
    ...parseFromValuesOrFunc(columnDef.filterTextFieldProps, args),
    ...(isDateFilter
      ? {
          ...parseFromValuesOrFunc(table.options.filterDateInputProps, args),
          ...parseFromValuesOrFunc(columnDef.filterDateInputProps, args),
        }
      : {}),
    ...rest,
  });

  const dropdownOptions = $derived(getDropdownOptions({ header, table }));
  const inputType = $derived(
    isDateFilter
      ? getDateInputType(columnDef.filterVariant)
      : (textFieldProps.type as string | undefined),
  );

  const filterChipLabel = $derived(
    ['empty', 'notEmpty'].includes(currentFilterOption)
      ? getFilterModeLabel(localization, currentFilterOption)
      : '',
  );

  const filterPlaceholder = $derived(
    !isRangeFilter
      ? (textFieldProps.placeholder ??
          localization.filterByColumn?.replace('{column}', String(columnDef.header)))
      : rangeFilterIndex === 0
        ? localization.min
        : rangeFilterIndex === 1
          ? localization.max
          : '',
  );

  const showChangeModeButton = $derived(
    !!(
      table.options.enableColumnFilterModes &&
      columnDef.enableColumnFilterModes !== false &&
      !rangeFilterIndex &&
      (allowedColumnFilterOptions === undefined ||
        !!allowedColumnFilterOptions?.length)
    ),
  );

  // ---- value state: local so typing is instant, filter is debounced -------
  const readColumnValue = () => {
    const value = column.getFilterValue();
    return isRangeFilter
      ? ((value as unknown[] | undefined)?.[rangeFilterIndex as number] ?? '')
      : isAutocompleteFilter
        ? typeof value === 'string'
          ? value
          : ''
        : (value ?? '');
  };
  let filterValue = $state<unknown>(untrack(readColumnValue));

  const displayValue = $derived(
    isDateFilter
      ? formatDateInput(inputType as any, filterValue)
      : filterValue === null || filterValue === undefined
        ? ''
        : String(filterValue),
  );
  const hasValue = $derived(displayValue.length > 0);

  const setColumnValue = debounce(
    (newValue: unknown) => {
      if (isRangeFilter) {
        column.setFilterValue((old: unknown[] | undefined) => {
          const next = [...(Array.isArray(old) ? old : ['', ''])];
          next[rangeFilterIndex as number] = newValue ?? undefined;
          return next;
        });
      } else {
        column.setFilterValue(newValue ?? undefined);
      }
    },
    untrack(() =>
      isTextboxFilter ? (table.options.manualFiltering ? 400 : 200) : 1,
    ),
  );

  function handleChange(newValue: unknown) {
    filterValue = newValue ?? '';
    setColumnValue(newValue);
  }

  function oninput(event: Event) {
    const input = event.target as HTMLInputElement;
    let newValue: unknown = input.value;
    if (isDateFilter) {
      newValue = parseDateInput(inputType as any, input.value);
    } else if (inputType === 'number') {
      newValue = input.value === '' ? '' : input.valueAsNumber;
    } else if (isAutocompleteFilter) {
      // typing the label of an option filters by that option's value
      const match = dropdownOptions
        ?.map(getValueAndLabel)
        .find((option) => option.label === input.value);
      if (match) {
        filterValue = match.label;
        setColumnValue(match.value);
        return;
      }
    }
    handleChange(newValue);
    textFieldProps.oninput?.(event);
  }

  function handleClear() {
    setColumnValue.clear();
    filterValue = '';
    if (isRangeFilter) {
      column.setFilterValue((old: unknown[] | undefined) => {
        const next = [...(Array.isArray(old) ? old : ['', ''])];
        next[rangeFilterIndex as number] = undefined;
        return next;
      });
    } else if (!isAutocompleteFilter) {
      column.setFilterValue(undefined);
    }
  }

  function handleClearEmptyFilterChip() {
    filterValue = '';
    column.setFilterValue(undefined);
    table.setColumnFilterFns((prev) => ({
      ...prev,
      [header.id]: allowedColumnFilterOptions?.[0] ?? 'fuzzy',
    }));
  }

  // keep the input in sync when the filter is changed from elsewhere
  const columnFilterValue = $derived(column.getFilterValue());
  let lastSeen = untrack(() => columnFilterValue);
  $effect(() => {
    const next = columnFilterValue;
    if (next === lastSeen) return;
    lastSeen = next;
    untrack(() => {
      if (next === undefined) {
        filterValue = '';
      } else if (isRangeFilter && rangeFilterIndex !== undefined) {
        filterValue = (next as unknown[])[rangeFilterIndex] ?? '';
      } else if (!isAutocompleteFilter) {
        filterValue = next;
      }
    });
  });
  $effect(() => () => setColumnValue.clear());

  const listId = $derived(`mrt-filter-list-${table.options.id}-${column.id}`);
  const minWidth = $derived(
    isDateFilter
      ? '160px'
      : table.options.enableColumnFilterModes && rangeFilterIndex === 0
        ? '110px'
        : isRangeFilter
          ? '100px'
          : !filterChipLabel
            ? '120px'
            : 'auto',
  );

  function attachInput(node: HTMLElement) {
    const input = node.querySelector('input');
    const key = `${column.id}-${rangeFilterIndex ?? 0}`;
    const refs = table.refs.filterInputRefs.current;
    if (refs && input) refs[key] = input;
    return () => {
      if (refs) delete refs[key];
    };
  }
</script>

{#if columnDef.Filter}
  {@render columnDef.Filter({ column, header, rangeFilterIndex, table })}
{:else}
  <div
    class="mrt-filter-field"
    style:min-width={minWidth}
    {@attach attachInput}
  >
    <!-- svelte-ignore a11y_no_static_element_interactions, a11y_click_events_have_key_events -->
    <div onclick={(e) => e.stopPropagation()} onkeydown={(e) => e.stopPropagation()}>
      <MRT_TextField
        class="mrt-filter-textfield"
        type={inputType as any}
        value={displayValue}
        variant="standard"
        aria-label={filterPlaceholder}
        autocomplete="off"
        disabled={!!filterChipLabel}
        list={isAutocompleteFilter ? listId : undefined}
        {oninput}
        placeholder={filterChipLabel ? undefined : filterPlaceholder}
        title={filterPlaceholder}
        {...textFieldProps}
      >
        {#snippet leading()}
          {#if showChangeModeButton}
            <span class="mrt-adornment">
              <MRT_FilterModeButton
                {header}
                setFilterValue={(value: unknown) => (filterValue = value)}
                {table}
              />
              {#if filterChipLabel}
                <span class="mrt-chip">
                  {filterChipLabel}
                  <button
                    aria-label={localization.clearFilter}
                    class="mrt-chip-delete"
                    onclick={handleClearEmptyFilterChip}
                    type="button">×</button
                  >
                </span>
              {/if}
            </span>
          {/if}
        {/snippet}
        {#snippet trailing()}
          {#if !isAutocompleteFilter && !isDateFilter && !filterChipLabel}
            <span class="mrt-adornment" style:visibility={hasValue ? 'visible' : 'hidden'}>
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
          {/if}
        {/snippet}
      </MRT_TextField>
      {#if isAutocompleteFilter}
        <datalist id={listId}>
          {#each dropdownOptions ?? [] as option}
            <option value={getValueAndLabel(option).label}></option>
          {/each}
        </datalist>
      {/if}
    </div>
    {#if showChangeModeButton}
      <span class="mrt-filter-mode-label">
        {localization.filterMode.replace(
          '{filterType}',
          getFilterModeLabel(localization, currentFilterOption),
        )}
      </span>
    {/if}
  </div>
{/if}

<style>
  .mrt-filter-field {
    margin: 0 -2px;
    width: calc(100% + 4px);
  }
  .mrt-filter-field :global(.mrt-filter-textfield) {
    width: 100%;
  }
  .mrt-adornment {
    align-items: center;
    display: inline-flex;
  }
  .mrt-filter-mode-label {
    color: var(--mrt-text-secondary);
    display: block;
    font-size: 0.75rem;
    font-weight: normal;
    line-height: 0.8rem;
    white-space: nowrap;
  }
  .mrt-chip {
    align-items: center;
    background: var(--mrt-divider);
    border-radius: 16px;
    display: inline-flex;
    font-size: 0.8125rem;
    gap: 4px;
    height: 32px;
    padding: 0 10px;
  }
  .mrt-chip-delete {
    background: none;
    border: 0;
    cursor: pointer;
    font-size: 1.1rem;
    line-height: 1;
    padding: 0;
  }
</style>
