<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { MaterialSvelteTable, type MRT_ColumnDef, type MRT_Row } from '../../src/lib';
  import { type Employee, employees, type Person, people, personColumns } from '../data';
  import ColumnOrderingCustom from './ColumnOrderingCustom.svelte';

  // More column hiding, ordering, pinning, resizing, widths and alignment
  const { Story } = defineMeta({ title: 'Features/Column Examples (Advanced)' });

  const columns = personColumns;
  const data = people.slice(0, 40);

  const grouped: MRT_ColumnDef<Person>[] = [
    {
      columns: [
        { accessorKey: 'firstName', header: 'First Name' },
        { accessorKey: 'lastName', header: 'Last Name' },
      ],
      header: 'Name',
    },
    {
      columns: [
        { accessorKey: 'address', header: 'Address' },
        { accessorKey: 'state', header: 'State' },
        { accessorKey: 'phoneNumber', header: 'Phone Number' },
      ],
      header: 'Contact',
    },
  ];

  const resizing = { columns, data, enableColumnResizing: true } as const;
  const center = 'text-align: center; justify-content: center';
</script>

{#snippet detailPanel(ctx: { row: MRT_Row<Person> })}
  <div style="padding: 0.5rem 1rem">{ctx.row.original.address}, {ctx.row.original.state}</div>
{/snippet}

<!-- hiding -->
<Story name="Column Hiding With Header Groups">
  <MaterialSvelteTable options={{ columns: grouped, data }} />
</Story>

<Story name="Column Hiding With Columns Hidden And Not Visible In Show Hide">
  <MaterialSvelteTable
    options={{
      columns: [
        { accessorKey: 'firstName', header: 'First Name' },
        { accessorKey: 'lastName', header: 'Last Name', visibleInShowHideMenu: false },
        { accessorKey: 'address', header: 'Address' },
        { accessorKey: 'state', header: 'State' },
      ],
      data,
      initialState: { columnVisibility: { address: false, lastName: false } },
    }}
  />
</Story>

<!-- ordering / pinning -->
<Story name="Column Ordering State Managed Custom">
  <ColumnOrderingCustom />
</Story>

<Story name="Column Pinning With Detail Panel">
  <MaterialSvelteTable
    options={{
      columns,
      data,
      detailPanel,
      enableColumnPinning: true,
      initialState: { columnPinning: { end: [], start: ['mrt-row-expand', 'firstName'] } },
    }}
  />
</Story>

<!-- resizing -->
<Story name="Column Resizing Default On Change Grid With Individual Shrink">
  <MaterialSvelteTable
    options={{
      ...resizing,
      columns: [
        { accessorKey: 'firstName', grow: false, header: 'First Name' },
        { accessorKey: 'lastName', grow: false, header: 'Last Name' },
        { accessorKey: 'address', header: 'Address' },
        { accessorKey: 'state', header: 'State' },
      ],
      layoutMode: 'grid',
    }}
  />
</Story>

<Story name="Column Resizing Enabled Default On Change Grid RTL">
  <div dir="rtl">
    <MaterialSvelteTable
      options={{ ...resizing, columnResizeDirection: 'rtl', layoutMode: 'grid' }}
    />
  </div>
</Story>

<Story name="Column Resizing Enabled Default On Change Semantic RTL">
  <div dir="rtl">
    <MaterialSvelteTable
      options={{ ...resizing, columnResizeDirection: 'rtl', layoutMode: 'semantic' }}
    />
  </div>
</Story>

<Story name="Column Resizing With Header Groups Grid Grow">
  <MaterialSvelteTable options={{ ...resizing, columns: grouped, layoutMode: 'grid' }} />
</Story>

<Story name="Column Resizing Layout Grid Grow RTL">
  <div dir="rtl">
    <MaterialSvelteTable
      options={{ ...resizing, columnResizeDirection: 'rtl', layoutMode: 'grid' }}
    />
  </div>
</Story>

<!-- header groups -->
<Story name="Header Groups With Column Ordering">
  <MaterialSvelteTable
    options={{ columns: grouped, data, enableColumnOrdering: true }}
  />
</Story>

<Story name="Header Groups With Column Resizing">
  <MaterialSvelteTable
    options={{ columns: grouped, data, enableColumnResizing: true }}
  />
</Story>

<Story name="Header Groups With Column Resizing Grid">
  <MaterialSvelteTable
    options={{ columns: grouped, data, enableColumnResizing: true, layoutMode: 'grid' }}
  />
</Story>

<Story name="Header Groups With Semantic Column Resizing">
  <MaterialSvelteTable
    options={{ columns: grouped, data, enableColumnResizing: true, layoutMode: 'semantic' }}
  />
</Story>

<Story name="Header Groups With Column Virtualization">
  <MaterialSvelteTable
    options={{
      columns: grouped,
      data,
      enableColumnVirtualization: true,
      tableContainerProps: { style: 'max-width: 700px' },
    }}
  />
</Story>

<!-- column widths -->
<Story name="Custom Widths Grid No Grow">
  <MaterialSvelteTable
    options={{
      columns: [
        { accessorKey: 'firstName', header: 'First Name', size: 100 },
        { accessorKey: 'lastName', header: 'Last Name', size: 400 },
        { accessorKey: 'state', header: 'State', size: 200 },
      ],
      data,
      layoutMode: 'grid-no-grow',
    }}
  />
</Story>

<Story name="Custom Widths Grid Individual Shrink">
  <MaterialSvelteTable
    options={{
      columns: [
        { accessorKey: 'firstName', grow: false, header: 'First Name', size: 100 },
        { accessorKey: 'lastName', header: 'Last Name', size: 400 },
        { accessorKey: 'state', grow: false, header: 'State', size: 200 },
      ],
      data,
      layoutMode: 'grid',
    }}
  />
</Story>

<Story name="Small Widths Semantic">
  <MaterialSvelteTable
    options={{
      columns: columns.map((c) => ({ ...c, minSize: 10, size: 20 })),
      data,
      layoutMode: 'semantic',
    }}
  />
</Story>

<Story name="Small Widths Grid">
  <MaterialSvelteTable
    options={{
      columns: columns.map((c) => ({ ...c, minSize: 10, size: 20 })),
      data,
      layoutMode: 'grid',
    }}
  />
</Story>

<Story name="Small Widths Grid No Grow">
  <MaterialSvelteTable
    options={{
      columns: columns.map((c) => ({ ...c, minSize: 10, size: 20 })),
      data,
      layoutMode: 'grid-no-grow',
    }}
  />
</Story>

<Story name="Small Widths Grid No Grow Individual Grow">
  <MaterialSvelteTable
    options={{
      columns: columns.map((c, i) => ({ ...c, grow: i === 2, minSize: 10, size: 20 })),
      data,
      layoutMode: 'grid-no-grow',
    }}
  />
</Story>

<!-- alignment -->
<Story name="Default Left Grid">
  <MaterialSvelteTable options={{ columns, data, layoutMode: 'grid' }} />
</Story>

<Story name="Right Cells Grid">
  <MaterialSvelteTable
    options={{
      columns,
      data,
      layoutMode: 'grid',
      tableBodyCellProps: { style: 'text-align: right; justify-content: flex-end' },
      tableHeadCellProps: { style: 'text-align: right; justify-content: flex-end' },
    }}
  />
</Story>

<Story name="Center Cells With Grab Handle">
  <MaterialSvelteTable
    options={{
      columns,
      data,
      enableColumnOrdering: true,
      tableBodyCellProps: { style: center },
      tableHeadCellProps: { style: center },
    }}
  />
</Story>

<Story name="Center Cells With Grab Handle No Sorting">
  <MaterialSvelteTable
    options={{
      columns,
      data,
      enableColumnOrdering: true,
      enableSorting: false,
      tableBodyCellProps: { style: center },
      tableHeadCellProps: { style: center },
    }}
  />
</Story>

<Story name="Center Cells No Column Actions">
  <MaterialSvelteTable
    options={{
      columns,
      data,
      enableColumnActions: false,
      tableBodyCellProps: { style: center },
      tableHeadCellProps: { style: center },
    }}
  />
</Story>
