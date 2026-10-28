<script lang="ts" generics="TData extends RowData">
  import { getSelectOptions } from '../createHeadlessTable.svelte';
  import type {
    HeadlessColumnDef,
    HeadlessLocalization,
    HeadlessTableInstance,
    RowData,
  } from '../types';
  import Checkbox from './kit/Checkbox.svelte';
  import Select from './kit/Select.svelte';
  import TextInput from './kit/TextInput.svelte';

  /** The filter under a header: text, select, number range or checkbox. */
  let {
    column,
    data,
    id,
    localization,
    table,
  }: {
    column: HeadlessColumnDef<TData>;
    data: TData[];
    id: string;
    localization: HeadlessLocalization;
    table: HeadlessTableInstance<TData>;
  } = $props();

  const variant = $derived(column.filterVariant || 'text');
  const value = $derived(table.state.columnFilters[id]);
  const label = $derived(localization.filterByColumn.replace('{column}', column.header));
  const range = $derived((Array.isArray(value) ? value : [null, null]) as (number | null)[]);

  function setRange(index: 0 | 1, text: string) {
    const next = [...range] as (number | null)[];
    next[index] = text === '' ? null : Number(text);
    table.setColumnFilter(id, next[0] === null && next[1] === null ? undefined : next);
  }
</script>

<div class="hdt-filter">
  {#if variant === 'select'}
    <Select
      {label}
      onchange={(next) => table.setColumnFilter(id, next || undefined)}
      options={getSelectOptions(column, data)}
      placeholder={localization.filterByColumn.replace('{column}', column.header)}
      value={value as string | undefined}
    />
  {:else if variant === 'range'}
    <div class="hdt-filter-range">
      <TextInput
        aria-label="{label} ({localization.min})"
        oninput={(text) => setRange(0, text)}
        placeholder={localization.min}
        type="number"
        value={range[0] === null ? '' : String(range[0])}
      />
      <TextInput
        aria-label="{label} ({localization.max})"
        oninput={(text) => setRange(1, text)}
        placeholder={localization.max}
        type="number"
        value={range[1] === null ? '' : String(range[1])}
      />
    </div>
  {:else if variant === 'checkbox'}
    <Checkbox
      checked={value === true}
      indeterminate={value === undefined}
      {label}
      onchange={() =>
        table.setColumnFilter(id, value === undefined ? true : value === true ? false : undefined)}
    />
  {:else}
    <TextInput
      aria-label={label}
      oninput={(text) => table.setColumnFilter(id, text)}
      placeholder={label}
      value={(value as string | undefined) ?? ''}
    />
  {/if}
</div>

<style>
  .hdt-filter {
    min-width: 0;
    width: 100%;
  }
  .hdt-filter-range {
    display: flex;
    gap: 0.25rem;
  }
</style>
