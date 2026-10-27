<script lang="ts">
  import { untrack } from 'svelte';
  import { ShadcnSvelteTable, type MRT_ColumnDef } from '../../src/lib';
  import type { Employee } from '../data';

  let {
    columns,
    data: initial,
    editDisplayMode,
    virtualized = false,
  }: {
    columns: MRT_ColumnDef<Employee>[];
    data: Employee[];
    editDisplayMode: 'cell' | 'modal' | 'row' | 'table';
    virtualized?: boolean;
  } = $props();

  // a working copy: the story edits it without touching the shared data
  let data = $state(untrack(() => structuredClone($state.snapshot(initial))));
</script>

<ShadcnSvelteTable
  options={{
    columns,
    get data() {
      return data;
    },
    editDisplayMode,
    enableEditing: true,
    enablePagination: !virtualized,
    enableRowVirtualization: virtualized,
    // `values` holds what was typed; write it back to your data
    onEditingRowSave: ({ exitEditingMode, row, values }) => {
      data[row.index] = { ...data[row.index], ...values };
      exitEditingMode();
    },
    // in "cell" mode there is no save button: save when the input loses focus
    editTextFieldProps: ({ cell }) =>
      editDisplayMode === 'cell'
        ? {
            onblur: (event: FocusEvent) => {
              const value = (event.target as HTMLInputElement).value;
              data[cell.row.index] = { ...data[cell.row.index], [cell.column.id]: value };
            },
          }
        : {},
  }}
/>
