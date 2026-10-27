<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import {
    MRT_ActionMenuItem,
    ShadcnSvelteTable,
    type MRT_Cell,
    type MRT_ColumnDef,
    type MRT_Row,
    type MRT_TableInstance,
  } from '../../src/lib';
  import CreatingRows from './CreatingRows.svelte';
  import { type Employee, employees, employeeColumns, makeTree } from '../data';

  // More rows, editing, detail panels, selection, filtering, pagination and row numbers
  const { Story } = defineMeta({ title: 'Features/Row Examples (Advanced)' });

  const columns = employeeColumns;
  const data = employees.slice(0, 30);
  const tree = makeTree();
  const saveAndClose = ({ exitEditingMode }: { exitEditingMode: () => void }) =>
    exitEditingMode();

  type Nested = { id: number; name: { first: string; last: string }; city: string };
  const nested: Nested[] = Array.from({ length: 12 }, (_, id) => ({
    city: ['Austin', 'Boston', 'Chicago'][id % 3],
    id,
    name: { first: `First ${id}`, last: `Last ${id}` },
  }));
  const nestedColumns: MRT_ColumnDef<Nested>[] = [
    { accessorKey: 'name.first', header: 'First Name' },
    { accessorKey: 'name.last', header: 'Last Name' },
    { accessorKey: 'city', header: 'City' },
  ];
</script>

{#snippet cellMenu(ctx: { cell: MRT_Cell<Employee>; closeMenu: () => void; table: MRT_TableInstance<Employee> })}
  <MRT_ActionMenuItem
    label={`Log "${ctx.cell.getValue()}"`}
    onclick={() => {
      console.info(ctx.cell.getValue());
      ctx.closeMenu();
    }}
    table={ctx.table}
  />
{/snippet}

{#snippet detailPanel(ctx: { row: MRT_Row<Employee> })}
  <div style="padding: 0.5rem 1rem">
    {ctx.row.original.address}, {ctx.row.original.city}, {ctx.row.original.state}
  </div>
{/snippet}

{#snippet customEdit(ctx: { row: MRT_Row<Employee>; internalEditCells: MRT_Cell<Employee>[] })}
  <div style="padding: 1rem">
    Editing <strong>{ctx.row.original.firstName}</strong> (custom dialog content)
  </div>
{/snippet}

{#snippet rowActions(ctx: { row: MRT_Row<Employee> })}
  <button onclick={() => alert(ctx.row.original.firstName)}>Hi</button>
{/snippet}

<!-- cell actions -->
<Story name="Cell Actions Enabled Custom">
  <ShadcnSvelteTable
    options={{
      cellActionMenuItems: cellMenu,
      columns,
      data,
      enableCellActions: (cell) => cell.column.id !== 'age',
      enableClickToCopy: 'context-menu',
    }}
  />
</Story>

<!-- creating -->
<Story name="Create Row Index Index Virtualized">
  <CreatingRows {columns} data={employees} position={20} />
</Story>

<Story name="Create Row Index Index Expanding">
  <CreatingRows {columns} data={employees.slice(0, 30)} position={2} />
</Story>

<Story name="Create With Custom Edit Cell">
  <ShadcnSvelteTable
    options={{
      columns,
      createDisplayMode: 'modal',
      createRowDialogContent: customEdit,
      data,
      editDisplayMode: 'modal',
      enableEditing: true,
      onCreatingRowSave: ({ exitCreatingMode }) => exitCreatingMode(),
    }}
  />
</Story>

<!-- detail panel -->
<Story name="Custom Expand Rotation">
  <ShadcnSvelteTable
    options={{
      columns,
      data,
      detailPanel,
      expandButtonProps: ({ row }) => ({
        style: `transform: rotate(${row.getIsExpanded() ? -90 : 0}deg); transition: transform 0.2s`,
      }),
    }}
  />
</Story>

<Story name="Detail Panel Enabled Conditional Hide">
  <ShadcnSvelteTable
    options={{
      columns,
      data,
      detailPanel,
      expandButtonProps: ({ row }) => ({
        style: row.original.age > 50 ? 'visibility: hidden' : '',
      }),
    }}
  />
</Story>

<Story name="Detail Panel Expand All Disabled Grid">
  <ShadcnSvelteTable
    options={{ columns, data, detailPanel, enableExpandAll: false, layoutMode: 'grid' }}
  />
</Story>

<Story name="Detail Panel Expand All Disabled Grid No Grow">
  <ShadcnSvelteTable
    options={{ columns, data, detailPanel, enableExpandAll: false, layoutMode: 'grid-no-grow' }}
  />
</Story>

<!-- editing -->
<Story name="Editing Enabled Edit Mode Row Custom Save">
  <ShadcnSvelteTable
    options={{
      columns,
      data,
      editDisplayMode: 'row',
      enableEditing: true,
      onEditingRowSave: ({ row, values, exitEditingMode }) => {
        Object.assign(row.original, values);
        console.info('saved', values);
        exitEditingMode();
      },
    }}
  />
</Story>

<Story name="Editing Enabled Edit Mode Cell With Row Actions">
  <ShadcnSvelteTable
    options={{
      columns,
      data,
      editDisplayMode: 'cell',
      enableEditing: true,
      enableRowActions: true,
      rowActions,
    }}
  />
</Story>

<Story name="Edit Select Variant Alternate">
  <ShadcnSvelteTable
    options={{
      columns: [
        { accessorKey: 'firstName', header: 'First Name' },
        {
          accessorKey: 'gender',
          editSelectOptions: [
            { label: 'Female', value: 'Female' },
            { label: 'Male', value: 'Male' },
          ],
          editVariant: 'select',
          header: 'Gender',
        },
        { accessorKey: 'state', header: 'State' },
      ],
      data,
      editDisplayMode: 'table',
      enableEditing: true,
    }}
  />
</Story>

<Story name="Editing Nested Data">
  <ShadcnSvelteTable
    options={{
      columns: nestedColumns,
      data: nested,
      editDisplayMode: 'modal',
      enableEditing: true,
      onEditingRowSave: saveAndClose,
    }}
  />
</Story>

<Story name="Editing Enabled Edit Mode Table With Grouped Rows">
  <ShadcnSvelteTable
    options={{
      columns,
      data,
      editDisplayMode: 'table',
      enableEditing: true,
      enableGrouping: true,
      initialState: { expanded: true, grouping: ['gender'] },
    }}
  />
</Story>

<Story name="Enable Editing Conditionally">
  <ShadcnSvelteTable
    options={{
      columns,
      data,
      editDisplayMode: 'modal',
      enableEditing: (row) => row.original.age < 40,
      onEditingRowSave: saveAndClose,
    }}
  />
</Story>

<Story name="Enable Editing Conditionally Cell">
  <ShadcnSvelteTable
    options={{
      columns,
      data,
      editDisplayMode: 'cell',
      enableEditing: (row) => row.original.age < 40,
    }}
  />
</Story>

<Story name="Enable Editing Conditionally Table">
  <ShadcnSvelteTable
    options={{
      columns,
      data,
      editDisplayMode: 'table',
      enableEditing: (row) => row.original.age < 40,
    }}
  />
</Story>

<Story name="Editing Cell Manual On Change">
  <ShadcnSvelteTable
    options={{
      columns: columns.map((c) =>
        c.accessorKey === 'firstName'
          ? {
              ...c,
              editTextFieldProps: ({ cell, row }: { cell: MRT_Cell<Employee>; row: MRT_Row<Employee> }) => ({
                onchange: (event: Event) => {
                  row.original.firstName = (event.currentTarget as HTMLInputElement).value;
                  console.info('changed', cell.id);
                },
              }),
            }
          : c,
      ),
      data,
      editDisplayMode: 'cell',
      enableEditing: true,
    }}
  />
</Story>

<!-- row actions -->
<Story name="Row Actions Enabled Conditionally Per Row">
  <ShadcnSvelteTable
    options={{
      columns,
      data,
      enableRowActions: true,
      rowActions: conditionalActions,
    }}
  />
</Story>

<Story name="Row Actions Complete Override">
  <ShadcnSvelteTable
    options={{
      columns,
      data,
      displayColumnDefOptions: { 'mrt-row-actions': { header: 'Controls', size: 200 } },
      enableRowActions: true,
      rowActions,
    }}
  />
</Story>

<!-- row dragging / numbers -->
<Story name="Row Dragging Enabled Grid No Grow">
  <ShadcnSvelteTable
    options={{ columns, data, enableRowDragging: true, layoutMode: 'grid-no-grow' }}
  />
</Story>

<Story name="Enable Row Numbers Conditionally">
  <ShadcnSvelteTable
    options={{ columns, data, enableRowNumbers: data.length > 20 }}
  />
</Story>

<Story name="Enable Row Numbers Original Virtual">
  <ShadcnSvelteTable
    options={{
      columns,
      data: employees,
      enableRowNumbers: true,
      enableRowVirtualization: true,
      rowNumberDisplayMode: 'original',
      tableContainerProps: { style: 'max-height: 400px' },
    }}
  />
</Story>

<Story name="Enable Row Numbers Static Virtual">
  <ShadcnSvelteTable
    options={{
      columns,
      data: employees,
      enableRowNumbers: true,
      enableRowVirtualization: true,
      rowNumberDisplayMode: 'static',
      tableContainerProps: { style: 'max-height: 400px' },
    }}
  />
</Story>

<!-- row ordering / pinning -->
<Story name="Row Ordering With Pinning">
  <ShadcnSvelteTable
    options={{ columns, data, enableRowOrdering: true, enableRowPinning: true }}
  />
</Story>

<Story name="Row Ordering With Row Virtualization">
  <ShadcnSvelteTable
    options={{
      columns,
      data: employees,
      enableRowOrdering: true,
      enableRowVirtualization: true,
      tableContainerProps: { style: 'max-height: 400px' },
    }}
  />
</Story>

<Story name="Row Ordering With Column Virtualization">
  <ShadcnSvelteTable
    options={{ columns, data, enableColumnVirtualization: true, enableRowOrdering: true }}
  />
</Story>

<Story name="Row Pinning Sticky Custom Row Height">
  <ShadcnSvelteTable
    options={{
      columns,
      data,
      enableRowPinning: true,
      rowPinningDisplayMode: 'sticky',
      tableBodyRowProps: { style: 'height: 64px' },
    }}
  />
</Story>

<Story name="Row Pinning Select Bottom Mode">
  <ShadcnSvelteTable
    options={{
      columns,
      data,
      enableRowPinning: true,
      enableRowSelection: true,
      rowPinningDisplayMode: 'select-bottom',
    }}
  />
</Story>

<Story name="Row Pinning Sticky With Virtualization">
  <ShadcnSvelteTable
    options={{
      columns,
      data: employees,
      enableRowPinning: true,
      enableRowVirtualization: true,
      rowPinningDisplayMode: 'sticky',
      tableContainerProps: { style: 'max-height: 400px' },
    }}
  />
</Story>

<Story name="Row Pinning Top With Virtualization">
  <ShadcnSvelteTable
    options={{
      columns,
      data: employees,
      enableRowPinning: true,
      enableRowVirtualization: true,
      rowPinningDisplayMode: 'top',
      tableContainerProps: { style: 'max-height: 400px' },
    }}
  />
</Story>

<!-- search / filtering -->
<Story name="Search Initialized State">
  <ShadcnSvelteTable
    options={{
      columns,
      data,
      enableGlobalFilterModes: true,
      initialState: { globalFilter: 'a', showGlobalFilter: true },
    }}
  />
</Story>

<Story name="Filtering Change Mode Enabled Faceted">
  <ShadcnSvelteTable
    options={{
      columns: columns.map((c) =>
        c.accessorKey === 'state' ? { ...c, filterVariant: 'select' as const } : c,
      ),
      data,
      enableColumnFilterModes: true,
      enableFacetedValues: true,
      initialState: { showColumnFilters: true },
    }}
  />
</Story>

<Story name="Filtering Change Mode Enabled Hidden">
  <ShadcnSvelteTable
    options={{
      columns,
      data,
      columnFilterDisplayMode: 'popover',
      enableColumnFilterModes: true,
      initialState: { showColumnFilters: false },
    }}
  />
</Story>

<!-- selection -->
<Story name="Select All Mode All Conditionally">
  <ShadcnSvelteTable
    options={{
      columns,
      data,
      enableRowSelection: (row) => row.original.age < 50,
      selectAllMode: 'all',
    }}
  />
</Story>

<Story name="Select All Disabled Custom Header">
  <ShadcnSvelteTable
    options={{
      columns,
      data,
      displayColumnDefOptions: { 'mrt-row-select': { header: 'Pick' } },
      enableRowSelection: true,
      enableSelectAll: false,
    }}
  />
</Story>

<Story name="Select Checkbox Secondary Color">
  <ShadcnSvelteTable
    options={{
      columns,
      data,
      enableRowSelection: true,
      selectCheckboxProps: { color: 'secondary' },
    }}
  />
</Story>

<Story name="Custom Alert Banner Head Overlay">
  <ShadcnSvelteTable
    options={{
      columns,
      data,
      enableRowSelection: true,
      initialState: { rowSelection: { '1': true, '2': true } },
      positionToolbarAlertBanner: 'head-overlay',
    }}
  />
</Story>

<!-- sub row tree -->
<Story name="Sub Row Tree Layout Grid No Grow">
  <ShadcnSvelteTable
    options={{ columns, data: tree, enableExpanding: true, layoutMode: 'grid-no-grow' }}
  />
</Story>

<Story name="Sub Row Tree Enabled Default RTL And Position Last">
  <div dir="rtl">
    <ShadcnSvelteTable
      options={{
        columns,
        data: tree,
        enableExpanding: true,
        positionExpandColumn: 'last',
      }}
    />
  </div>
</Story>

<Story name="Sub Row Tree Max Leaf Row Filter Depth 1">
  <ShadcnSvelteTable
    options={{
      columns,
      data: tree,
      enableExpanding: true,
      initialState: { showColumnFilters: true },
      maxLeafRowFilterDepth: 1,
    }}
  />
</Story>

<Story name="Sub Row Tree Max Leaf Row Filter Depth And Filter From Leaf Rows">
  <ShadcnSvelteTable
    options={{
      columns,
      data: tree,
      enableExpanding: true,
      filterFromLeafRows: true,
      initialState: { showColumnFilters: true },
      maxLeafRowFilterDepth: 1,
    }}
  />
</Story>

<Story name="Sub Row Tree With Selection No Sub Row Selection">
  <ShadcnSvelteTable
    options={{
      columns,
      data: tree,
      enableExpanding: true,
      enableRowSelection: true,
      enableSubRowSelection: false,
    }}
  />
</Story>

<!-- loading -->
<Story name="Loading 5">
  <ShadcnSvelteTable
    options={{
      columns,
      data: [],
      state: { isLoading: true, showProgressBars: true, showSkeletons: true },
    }}
  />
</Story>

<Story name="Loading With Detail Panel Example">
  <ShadcnSvelteTable
    options={{
      columns,
      data: [],
      detailPanel,
      state: { isLoading: true },
    }}
  />
</Story>

{#snippet conditionalActions(ctx: { row: MRT_Row<Employee> })}
  {#if ctx.row.original.isActive}
    <button onclick={() => alert(ctx.row.original.firstName)}>Active</button>
  {:else}
    <em>inactive</em>
  {/if}
{/snippet}
