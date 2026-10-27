<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { ShadcnSvelteTable, type MRT_ColumnDef } from '../../src/lib';
  import { type Employee, employees, states } from '../data';
  import AsyncEditing from './AsyncEditing.svelte';
  import CreatingRows from './CreatingRows.svelte';
  import EditingWithSave from './EditingWithSave.svelte';

  // Editing and creating rows
  const { Story } = defineMeta({ title: 'Features/Editing And Creating Examples' });

  const columns: MRT_ColumnDef<Employee>[] = [
    { accessorKey: 'id', enableEditing: false, header: 'Id', size: 80 },
    { accessorKey: 'firstName', header: 'First Name' },
    { accessorKey: 'lastName', header: 'Last Name' },
    {
      accessorKey: 'state',
      editSelectOptions: states,
      editVariant: 'select',
      header: 'State',
    },
    { accessorKey: 'age', header: 'Age' },
  ];

  const data = employees.slice(0, 20);
</script>

<Story name="Editing Enabled Edit Mode Modal Default">
  <EditingWithSave {columns} {data} editDisplayMode="modal" />
</Story>

<Story name="Editing Enabled Edit Mode Row">
  <EditingWithSave {columns} {data} editDisplayMode="row" />
</Story>

<Story name="Editing Enabled Edit Mode Row Virtualized">
  <EditingWithSave {columns} {data} editDisplayMode="row" virtualized />
</Story>

<Story name="Editing Enabled Edit Mode Cell">
  <EditingWithSave {columns} {data} editDisplayMode="cell" />
</Story>

<Story name="Editing Enabled Edit Mode Table">
  <EditingWithSave {columns} {data} editDisplayMode="table" />
</Story>

<Story name="Editing Feature Enabled Conditionally">
  <ShadcnSvelteTable
    options={{
      columns,
      data,
      editDisplayMode: 'row',
      // only people over 40 can be edited
      enableEditing: (row) => row.original.age > 40,
      onEditingRowSave: ({ exitEditingMode }) => exitEditingMode(),
    }}
  />
</Story>

<Story name="Edit Select Variant">
  <EditingWithSave {columns} {data} editDisplayMode="row" />
</Story>

<Story name="Editing Customize Input">
  <ShadcnSvelteTable
    options={{
      columns: [
        {
          accessorKey: 'firstName',
          editTextFieldProps: { placeholder: 'A first name', maxlength: 12 },
          header: 'First Name',
        },
        { accessorKey: 'lastName', header: 'Last Name' },
      ],
      data,
      editDisplayMode: 'row',
      enableEditing: true,
      onEditingRowSave: ({ exitEditingMode }) => exitEditingMode(),
    }}
  />
</Story>

<Story name="Editing Enabled Async">
  <AsyncEditing {columns} {data} />
</Story>

<Story name="Create Row Index Top">
  <CreatingRows {columns} {data} position="top" />
</Story>

<Story name="Create Row Index Bottom">
  <CreatingRows {columns} {data} position="bottom" />
</Story>

<Story name="Create Row Index Index">
  <CreatingRows {columns} {data} position={3} />
</Story>

<Story name="Create Row In Modal">
  <CreatingRows {columns} {data} displayMode="modal" />
</Story>
