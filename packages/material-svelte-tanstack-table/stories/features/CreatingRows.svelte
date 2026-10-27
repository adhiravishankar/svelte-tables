<script lang="ts">
  import { untrack } from 'svelte';
  import Button, { Label } from '@smui/button';
  import {
    MaterialSvelteTable,
    createMaterialSvelteTable,
    type MRT_ColumnDef,
  } from '../../src/lib';
  import type { Employee } from '../data';

  let {
    columns,
    data: initial,
    displayMode = 'row',
    position = 'top',
  }: {
    columns: MRT_ColumnDef<Employee>[];
    data: Employee[];
    displayMode?: 'modal' | 'row';
    position?: 'bottom' | 'top' | number;
  } = $props();

  // a working copy: the story edits it without touching the shared data
  let data = $state(untrack(() => structuredClone($state.snapshot(initial))));

  // the table instance is needed to start creating from a toolbar button
  // (props are read once: the story is re-mounted when they change)
  const table = untrack(() => createMaterialSvelteTable<Employee>({
    columns,
    createDisplayMode: displayMode,
    get data() {
      return data;
    },
    editDisplayMode: 'row',
    enableEditing: true,
    onCreatingRowSave: ({ exitCreatingMode, values }) => {
      data = [values as unknown as Employee, ...data];
      exitCreatingMode();
    },
    onEditingRowSave: ({ exitEditingMode, row, values }) => {
      data[row.index] = { ...data[row.index], ...values };
      exitEditingMode();
    },
    positionCreatingRow: position,
    topToolbarCustomActions: createButton,
  }));
</script>

{#snippet createButton()}
  <Button onclick={() => table.setCreatingRow(true)} variant="raised">
    <Label>Create new user</Label>
  </Button>
{/snippet}

<MaterialSvelteTable {table} />
