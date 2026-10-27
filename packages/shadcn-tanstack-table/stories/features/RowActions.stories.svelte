<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import {
    MRT_ActionMenuItem,
    ShadcnSvelteTable,
    type MRT_Cell,
    type MRT_Row,
    type MRT_TableInstance,
  } from '../../src/lib';
  import { type Employee, employees, employeeColumns } from '../data';

  // Row actions, cell actions and click to copy
  const { Story } = defineMeta({ title: 'Features/Actions Examples' });

  const columns = employeeColumns;
  const data = employees.slice(0, 30);
</script>

{#snippet rowActionMenuItems(ctx: {
  closeMenu: () => void;
  row: MRT_Row<Employee>;
  table: MRT_TableInstance<Employee>;
})}
  <MRT_ActionMenuItem
    label="View profile"
    onclick={() => {
      console.info('view', ctx.row.original.firstName);
      ctx.closeMenu();
    }}
    table={ctx.table}
  />
  <MRT_ActionMenuItem
    label="Send email"
    onclick={() => {
      console.info('email', ctx.row.original.firstName);
      ctx.closeMenu();
    }}
    table={ctx.table}
  />
{/snippet}

{#snippet rowActions(ctx: { row: MRT_Row<Employee> })}
  <div style="display: flex; gap: 0.5rem">
    <button onclick={() => alert(`Edit ${ctx.row.original.firstName}`)}>Edit</button>
    <button onclick={() => alert(`Delete ${ctx.row.original.firstName}`)}>Delete</button>
  </div>
{/snippet}

<!-- row actions -->
<Story name="Row Actions Enabled">
  <ShadcnSvelteTable
    options={{ columns, data, enableRowActions: true, rowActionMenuItems }}
  />
</Story>

<Story name="Row Actions Enabled Conditionally">
  <ShadcnSvelteTable
    options={{ columns, data, enableRowActions: false, rowActionMenuItems }}
  />
</Story>

<Story name="Row Actions And Editing Enabled">
  <ShadcnSvelteTable
    options={{
      columns,
      data,
      editDisplayMode: 'modal',
      enableEditing: true,
      enableRowActions: true,
      onEditingRowSave: ({ exitEditingMode }) => exitEditingMode(),
      rowActionMenuItems,
    }}
  />
</Story>

<Story name="Row Actions Last Column">
  <ShadcnSvelteTable
    options={{
      columns,
      data,
      enableRowActions: true,
      positionActionsColumn: 'last',
      rowActionMenuItems,
    }}
  />
</Story>

<Story name="Custom Row Action Buttons">
  <ShadcnSvelteTable options={{ columns, data, enableRowActions: true, rowActions }} />
</Story>

<Story name="Custom Row Action Buttons Last Column">
  <ShadcnSvelteTable
    options={{
      columns,
      data,
      enableRowActions: true,
      positionActionsColumn: 'last',
      rowActions,
    }}
  />
</Story>

<!-- cell actions -->
{#snippet cellActionMenuItems(ctx: {
  cell: MRT_Cell<Employee>;
  closeMenu: () => void;
  table: MRT_TableInstance<Employee>;
})}
  <MRT_ActionMenuItem
    label={`Log "${ctx.cell.getValue()}"`}
    onclick={() => {
      console.info(ctx.cell.getValue());
      ctx.closeMenu();
    }}
    table={ctx.table}
  />
{/snippet}

<Story name="Cell Actions Enabled">
  <ShadcnSvelteTable
    options={{ cellActionMenuItems, columns, data, enableCellActions: true }}
  />
</Story>

<Story name="Cell Actions Enabled Conditionally">
  <ShadcnSvelteTable
    options={{
      cellActionMenuItems,
      columns,
      data,
      // only the salary column has a menu
      enableCellActions: (cell) => cell.column.id === 'salary',
    }}
  />
</Story>

<Story name="Cell Actions With Click To Copy">
  <ShadcnSvelteTable
    options={{
      columns,
      data,
      enableCellActions: true,
      enableClickToCopy: 'context-menu',
    }}
  />
</Story>

<Story name="Cell Actions With Built Ins">
  <ShadcnSvelteTable
    options={{
      columns,
      data,
      editDisplayMode: 'cell',
      enableCellActions: true,
      enableClickToCopy: 'context-menu',
      enableEditing: true,
    }}
  />
</Story>

<!-- click to copy -->
<Story name="Click To Copy Enabled">
  <ShadcnSvelteTable options={{ columns, data, enableClickToCopy: true }} />
</Story>

<Story name="Click To Copy Enabled With Column Resizing">
  <ShadcnSvelteTable
    options={{ columns, data, enableClickToCopy: true, enableColumnResizing: true }}
  />
</Story>

<Story name="Click To Copy Enabled Per Column">
  <ShadcnSvelteTable
    options={{
      columns: [
        { accessorKey: 'firstName', enableClickToCopy: true, header: 'First Name' },
        { accessorKey: 'lastName', header: 'Last Name' },
        { accessorKey: 'state', header: 'State' },
      ],
      data,
    }}
  />
</Story>

<Story name="Click To Copy Disabled Per Column">
  <ShadcnSvelteTable
    options={{
      columns: [
        { accessorKey: 'firstName', header: 'First Name' },
        { accessorKey: 'lastName', enableClickToCopy: false, header: 'Last Name' },
        { accessorKey: 'state', header: 'State' },
      ],
      data,
      enableClickToCopy: true,
    }}
  />
</Story>
