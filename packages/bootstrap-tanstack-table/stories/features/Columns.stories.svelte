<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { BootstrapSvelteTable, type MRT_ColumnDef } from '../../src/lib';
  import { type Employee, employees, employeeColumns, people, personColumns } from '../data';
  import ColumnOrderingStateManaged from './ColumnOrderingStateManaged.svelte';

  // Column hiding, ordering, dragging and pinning
  const { Story } = defineMeta({ title: 'Features/Column Examples' });

  const columns = personColumns;
</script>

<!-- hiding -->
<Story name="Column Hiding Enabled Default">
  <BootstrapSvelteTable options={{ columns, data: people }} />
</Story>

<Story name="Column Hiding Disabled">
  <BootstrapSvelteTable options={{ columns, data: people, enableHiding: false }} />
</Story>

<Story name="Column Hiding Disabled But With Ordering">
  <BootstrapSvelteTable
    options={{ columns, data: people, enableColumnOrdering: true, enableHiding: false }}
  />
</Story>

<Story name="Column Hiding Disabled But With Pinning">
  <BootstrapSvelteTable
    options={{ columns, data: people, enableColumnPinning: true, enableHiding: false }}
  />
</Story>

<Story name="Column Hiding Disabled Per Column">
  <BootstrapSvelteTable
    options={{
      columns: [
        { accessorKey: 'firstName', header: 'First Name' },
        { accessorKey: 'lastName', enableHiding: false, header: 'Last Name (cannot hide)' },
        { accessorKey: 'state', header: 'State' },
      ],
      data: people,
    }}
  />
</Story>

<Story name="Column Hiding Columns Not Visible In Show Hide">
  <BootstrapSvelteTable
    options={{
      columns: [
        { accessorKey: 'firstName', header: 'First Name' },
        { accessorKey: 'lastName', header: 'Last Name', visibleInShowHideMenu: false },
        { accessorKey: 'state', header: 'State' },
      ],
      data: people,
    }}
  />
</Story>

<Story name="Columns Initially Hidden">
  <BootstrapSvelteTable
    options={{
      columns,
      data: people,
      initialState: { columnVisibility: { address: false, phoneNumber: false } },
    }}
  />
</Story>

<!-- ordering -->
<Story name="Column Ordering Enabled">
  <BootstrapSvelteTable
    options={{ columns, data: people, enableColumnOrdering: true }}
  />
</Story>

<Story name="Display Column Ordering Enabled">
  <BootstrapSvelteTable
    options={{
      columns,
      data: people,
      enableColumnOrdering: true,
      enableRowNumbers: true,
      enableRowSelection: true,
    }}
  />
</Story>

<Story name="Column Ordering Disabled Per Column">
  <BootstrapSvelteTable
    options={{
      columns: [
        { accessorKey: 'firstName', header: 'First Name' },
        { accessorKey: 'lastName', enableColumnOrdering: false, header: 'Last Name (fixed)' },
        { accessorKey: 'state', header: 'State' },
        { accessorKey: 'phoneNumber', header: 'Phone Number' },
      ],
      data: people,
      enableColumnOrdering: true,
    }}
  />
</Story>

<Story name="Column Ordering With Select">
  <BootstrapSvelteTable
    options={{ columns, data: people, enableColumnOrdering: true, enableRowSelection: true }}
  />
</Story>

<Story name="Column Ordering With Pinning">
  <BootstrapSvelteTable
    options={{ columns, data: people, enableColumnOrdering: true, enableColumnPinning: true }}
  />
</Story>

<Story name="Column Ordering No Drag Handles">
  <BootstrapSvelteTable
    options={{
      columns,
      data: people,
      enableColumnDragging: false,
      enableColumnOrdering: true,
    }}
  />
</Story>

<Story name="Column Ordering State Managed">
  <ColumnOrderingStateManaged />
</Story>

<Story name="Column Ordering Enabled With Column Virtualization">
  <BootstrapSvelteTable
    options={{
      columns: Array.from({ length: 40 }, (_, i) => ({
        accessorKey: `c${i}`,
        header: `Column ${i}`,
      })),
      data: Array.from({ length: 20 }, (_, r) =>
        Object.fromEntries(Array.from({ length: 40 }, (_, c) => [`c${c}`, `r${r}c${c}`])),
      ),
      enableColumnOrdering: true,
      enableColumnVirtualization: true,
    }}
  />
</Story>

<!-- dragging -->
<Story name="Column Dragging Enabled">
  <BootstrapSvelteTable
    options={{ columns, data: people, enableColumnDragging: true }}
  />
</Story>

<Story name="Column Dragging Disabled Per Column">
  <BootstrapSvelteTable
    options={{
      columns: [
        { accessorKey: 'firstName', header: 'First Name' },
        { accessorKey: 'lastName', enableColumnDragging: false, header: 'Last Name' },
        { accessorKey: 'state', header: 'State' },
      ],
      data: people,
      enableColumnDragging: true,
    }}
  />
</Story>

<!-- pinning -->
<Story name="Column Pinning Enabled">
  <BootstrapSvelteTable
    options={{ columns, data: people, enableColumnPinning: true }}
  />
</Story>

<Story name="Column Pinning Initial">
  <BootstrapSvelteTable
    options={{
      columns,
      data: people,
      enableColumnPinning: true,
      initialState: { columnPinning: { end: ['phoneNumber'], start: ['firstName'] } },
    }}
  />
</Story>

<Story name="Column Pinning Disabled Per Column">
  <BootstrapSvelteTable
    options={{
      columns: [
        { accessorKey: 'firstName', header: 'First Name' },
        { accessorKey: 'lastName', enablePinning: false, header: 'Last Name (cannot pin)' },
        { accessorKey: 'state', header: 'State' },
      ],
      data: people,
      enableColumnPinning: true,
    }}
  />
</Story>

<Story name="Column Pinning With Select">
  <BootstrapSvelteTable
    options={{
      columns,
      data: people,
      enableColumnPinning: true,
      enableRowSelection: true,
      initialState: { columnPinning: { end: [], start: ['mrt-row-select', 'firstName'] } },
    }}
  />
</Story>
