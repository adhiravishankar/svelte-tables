<script lang="ts">
  import { untrack } from 'svelte';
  import { ShadcnSvelteTable, type MRT_ColumnDef } from '../../src/lib';
  import type { Employee } from '../data';

  let {
    columns,
    data: initial,
  }: { columns: MRT_ColumnDef<Employee>[]; data: Employee[] } = $props();

  // a working copy: the story edits it without touching the shared data
  let data = $state(untrack(() => structuredClone($state.snapshot(initial))));
  let isSaving = $state(false);
</script>

<ShadcnSvelteTable
  options={{
    columns,
    get data() {
      return data;
    },
    editDisplayMode: 'modal',
    enableEditing: true,
    onEditingRowSave: async ({ exitEditingMode, row, values }) => {
      isSaving = true;
      await new Promise((resolve) => setTimeout(resolve, 1500)); // pretend API call
      data[row.index] = { ...data[row.index], ...values };
      isSaving = false;
      exitEditingMode();
    },
    state: {
      get isSaving() {
        return isSaving;
      },
    },
  }}
/>
