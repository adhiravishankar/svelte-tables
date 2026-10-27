<script lang="ts">
  import Button, { Label } from '@smui/button';
  import {
    MRT_ActionMenuItem,
    MaterialSvelteTable,
    createMaterialSvelteTable,
    type MRT_ColumnDef,
    type MRT_Row,
    type MRT_TableInstance,
  } from 'material-svelte-table';
  import { type Person, makeData, states } from '../data/makeData';

  let data = $state(makeData(12));
  let validationErrors = $state<Record<string, string>>({});

  const columns: MRT_ColumnDef<Person>[] = [
    // the first 8 characters of the UUID keep the column narrow
    { accessorFn: (row) => row.id.slice(0, 8), enableEditing: false, header: 'Id', id: 'id', size: 110 },
    { accessorKey: 'firstName', header: 'First Name' },
    { accessorKey: 'lastName', header: 'Last Name' },
    { accessorKey: 'email', header: 'Email' },
    {
      accessorKey: 'state',
      editSelectOptions: states,
      editVariant: 'select',
      header: 'State',
    },
  ];

  /** Returns an error per invalid field. */
  const validate = (values: Record<string, unknown>) => {
    const errors: Record<string, string> = {};
    if (!values.firstName) errors.firstName = 'First name is required';
    if (!values.lastName) errors.lastName = 'Last name is required';
    if (!/^\S+@\S+\.\S+$/.test(String(values.email ?? ''))) errors.email = 'Enter a valid email';
    return errors;
  };

  // The table instance is needed to start creating from the toolbar button.
  const table = createMaterialSvelteTable<Person>({
    columns,
    createDisplayMode: 'modal',
    get data() {
      return data;
    },
    editDisplayMode: 'modal',
    enableEditing: true,
    enableRowActions: true,
    getRowId: (row) => row.id,
    onCreatingRowCancel: () => (validationErrors = {}),
    onCreatingRowSave: ({ exitCreatingMode, values }) => {
      validationErrors = validate(values);
      if (Object.keys(validationErrors).length) return; // keep the dialog open
      data = [{ ...(values as unknown as Person), id: crypto.randomUUID() }, ...data];
      exitCreatingMode();
    },
    onEditingRowCancel: () => (validationErrors = {}),
    onEditingRowSave: ({ exitEditingMode, row, values }) => {
      validationErrors = validate(values);
      if (Object.keys(validationErrors).length) return;
      data = data.map((person) => (person.id === row.id ? { ...person, ...values } : person));
      exitEditingMode();
    },
    // show the errors on the fields
    editTextFieldProps: ({ cell }) => ({
      input$onfocus: () => (validationErrors = { ...validationErrors, [cell.column.id]: '' }),
      invalid: !!validationErrors[cell.column.id],
    }),
    rowActionMenuItems: rowActions,
    topToolbarCustomActions: createButton,
  });
</script>

{#snippet rowActions(ctx: {
  closeMenu: () => void;
  row: MRT_Row<Person>;
  table: MRT_TableInstance<Person>;
})}
  <MRT_ActionMenuItem
    label="Delete"
    onclick={() => {
      data = data.filter((person) => person.id !== ctx.row.id);
      ctx.closeMenu();
    }}
    table={ctx.table}
  />
{/snippet}

{#snippet createButton()}
  <Button onclick={() => table.setCreatingRow(true)} variant="raised">
    <Label>Create new user</Label>
  </Button>
{/snippet}

{#if Object.values(validationErrors).some(Boolean)}
  <p role="alert" style="color: tomato">
    {Object.values(validationErrors).filter(Boolean).join(' · ')}
  </p>
{/if}
<MaterialSvelteTable {table} />
