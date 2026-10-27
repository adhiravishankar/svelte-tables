<script lang="ts" generics="TData extends MRT_RowData">
  import Textfield from '@smui/textfield';
  import { untrack } from 'svelte';
  import type { MRT_Cell, MRT_RowData, MRT_TableInstance } from '../../types';
  import { getValueAndLabel, parseFromValuesOrFunc } from '../../utils/utils';

  /**
   * The input used to edit a cell: a text field, or a native select with
   * `editVariant: 'select'`. A column `Edit` snippet replaces it.
   */
  let {
    cell,
    table,
    ...rest
  }: {
    cell: MRT_Cell<TData>;
    table: MRT_TableInstance<TData>;
    [key: string]: any;
  } = $props();

  const column = $derived(cell.column);
  const row = $derived(cell.row);
  const columnDef = $derived(column.columnDef);

  const isCreating = $derived(table.mrtState.creatingRow?.id === row.id);
  const isEditing = $derived(table.mrtState.editingRow?.id === row.id);
  const mode = $derived(
    (isCreating ? table.options.createDisplayMode : table.options.editDisplayMode) as string,
  );
  const labelled = $derived(['custom', 'modal'].includes(mode));

  const context = $derived({ cell, column, row, table });
  const textFieldProps = $derived({
    ...parseFromValuesOrFunc(table.options.editTextFieldProps, context),
    ...parseFromValuesOrFunc(columnDef.editTextFieldProps, context),
    ...rest,
  });
  const selectOptions = $derived(
    parseFromValuesOrFunc(columnDef.editSelectOptions, context),
  );
  const isSelectEdit = $derived(columnDef.editVariant === 'select' || !!textFieldProps.select);
  const disabled = $derived(parseFromValuesOrFunc(columnDef.enableEditing, row) === false);

  let value = $state<unknown>(untrack(() => cell.getValue()));
  let completesComposition = true;

  function saveInputValueToRowCache(newValue: unknown) {
    row._valuesCache[column.id] = newValue;
    if (isCreating) {
      table.setCreatingRow(row);
    } else if (isEditing) {
      table.setEditingRow(row);
    }
  }

  function oninput(event: Event) {
    textFieldProps.input$oninput?.(event);
    value = (event.target as HTMLInputElement).value;
  }

  function onselectchange(event: Event) {
    value = (event.target as HTMLSelectElement).value;
    saveInputValueToRowCache(value);
    textFieldProps.onchange?.(event);
  }

  function onblur(event: FocusEvent) {
    textFieldProps.input$onblur?.(event);
    saveInputValueToRowCache(value);
    table.setEditingCell(null);
  }

  function onkeydown(event: KeyboardEvent) {
    textFieldProps.input$onkeydown?.(event);
    if (event.key === 'Enter' && !event.shiftKey && completesComposition) {
      table.refs.editInputRefs.current?.[column.id]?.blur();
    }
  }

  function attachInput(node: HTMLElement) {
    const input = node.querySelector<HTMLInputElement>('input, select');
    const key = column.id;
    const refs = untrack(() => table.refs.editInputRefs.current);
    if (refs && input) refs[key] = input;
    return () => {
      if (refs) delete refs[key];
    };
  }
</script>

{#if columnDef.Edit}
  {@render columnDef.Edit({ cell, column, row, table })}
{:else}
  <!-- svelte-ignore a11y_no_static_element_interactions, a11y_click_events_have_key_events -->
  <div
    class="mrt-edit-field"
    class:mrt-edit-inline={!labelled}
    class:mrt-edit-table={table.options.editDisplayMode === 'table'}
    onclick={(e) => e.stopPropagation()}
    {@attach attachInput}
  >
    {#if isSelectEdit}
      <label class="mrt-edit-select-label">
        {#if labelled}<span class="mrt-edit-label">{columnDef.header}</span>{/if}
        <select
          {disabled}
          name={column.id}
          {onblur}
          onchange={onselectchange}
          {onkeydown}
          value={value ?? ''}
        >
          {#if !labelled}
            <option value="" disabled>{columnDef.header}</option>
          {/if}
          {#each selectOptions ?? [] as option}
            {@const { label, value: optionValue } = getValueAndLabel(option)}
            <option value={optionValue}>{label}</option>
          {/each}
        </select>
      </label>
    {:else}
      <Textfield
        class="mrt-edit-textfield"
        {disabled}
        input$autocomplete="off"
        input$name={column.id}
        input$placeholder={labelled ? undefined : columnDef.header}
        label={labelled ? columnDef.header : undefined}
        noLabel={!labelled}
        value={value === null || value === undefined ? '' : String(value)}
        variant={labelled ? 'outlined' : 'standard'}
        {...textFieldProps}
        input$onblur={onblur}
        input$oncompositionend={() => (completesComposition = true)}
        input$oncompositionstart={() => (completesComposition = false)}
        input$oninput={oninput}
        input$onkeydown={onkeydown}
      />
    {/if}
  </div>
{/if}

<style>
  .mrt-edit-field {
    width: 100%;
  }
  .mrt-edit-field :global(.mrt-edit-textfield) {
    width: 100%;
  }
  .mrt-edit-inline :global(.mrt-edit-textfield) {
    height: 2.25rem;
  }
  /* edit mode "table" looks like plain cells until focused */
  .mrt-edit-table :global(.mdc-line-ripple),
  .mrt-edit-table :global(.mdc-text-field__ripple) {
    display: none;
  }
  .mrt-edit-select-label {
    display: flex;
    flex-direction: column;
    font-size: 0.75rem;
    gap: 4px;
  }
  .mrt-edit-label {
    color: var(--mrt-text-secondary);
  }
  .mrt-edit-field select {
    background: transparent;
    border: 0;
    border-bottom: 1px solid var(--mrt-text-secondary);
    color: inherit;
    font: inherit;
    padding: 6px 0;
    width: 100%;
  }
</style>
