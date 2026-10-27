<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Button, { Label } from '@smui/button';
  import {
    MaterialSvelteTable,
    type MRT_Row,
    type MRT_TableInstance,
  } from '../../src/lib';
  import { type Employee, employees, employeeColumns } from '../data';

  // More toolbar, pagination and virtualization
  const { Story } = defineMeta({ title: 'Features/Toolbar Pagination Virtualization (Advanced)' });

  const columns = employeeColumns;
  const data = employees.slice(0, 30);
  const tall = { style: 'max-height: 400px' };
  const manyRows = Array.from({ length: 5 }, () => employees).flat();
  const selected = { '0': true, '1': true } as const;
</script>

{#snippet internalActions(ctx: { table: MRT_TableInstance<Employee> })}
  <Button onclick={() => alert('custom action')}><Label>Custom</Label></Button>
{/snippet}

{#snippet selectionActions(ctx: { table: MRT_TableInstance<Employee> })}
  <Button
    disabled={ctx.table.getSelectedRowModel().rows.length === 0}
    onclick={() => alert(`${ctx.table.getSelectedRowModel().rows.length} selected`)}
  >
    <Label>Act on selection</Label>
  </Button>
{/snippet}

{#snippet customTop(ctx: { table: MRT_TableInstance<Employee> })}
  <div style="padding: 0.75rem 1rem; font-weight: 600">My top toolbar ({ctx.table.getRowModel().rows.length} rows)</div>
{/snippet}

{#snippet customBottom(ctx: { table: MRT_TableInstance<Employee> })}
  <div style="padding: 0.75rem 1rem">My bottom toolbar</div>
{/snippet}

{#snippet detailPanel(ctx: { row: MRT_Row<Employee> })}
  <div style="padding: 1rem; height: 120px">Details for {ctx.row.original.firstName}</div>
{/snippet}

<!-- toolbar -->
<Story name="Custom Toolbar Internal Actions">
  <MaterialSvelteTable options={{ columns, data, toolbarInternalActions: internalActions }} />
</Story>

<Story name="Custom Top Toolbar Selection Actions">
  <MaterialSvelteTable
    options={{
      columns,
      data,
      enableRowSelection: true,
      topToolbarCustomActions: selectionActions,
    }}
  />
</Story>

<Story name="Custom Bottom Toolbar Selection Actions">
  <MaterialSvelteTable
    options={{
      bottomToolbarCustomActions: selectionActions,
      columns,
      data,
      enableRowSelection: true,
    }}
  />
</Story>

<Story name="Toolbar Alert Banner Bottom With Actions Also Bottom">
  <MaterialSvelteTable
    options={{
      bottomToolbarCustomActions: selectionActions,
      columns,
      data,
      enableRowSelection: true,
      initialState: { rowSelection: selected },
      positionToolbarAlertBanner: 'bottom',
    }}
  />
</Story>

<Story name="Render Custom Top Toolbar">
  <MaterialSvelteTable options={{ columns, data, topToolbar: customTop }} />
</Story>

<Story name="Render Custom Bottom Toolbar">
  <MaterialSvelteTable options={{ bottomToolbar: customBottom, columns, data }} />
</Story>

<!-- pagination -->
<Story name="Pagination Enabled Default Big Data Language">
  <MaterialSvelteTable
    options={{
      columns,
      data: manyRows,
      localization: { rowsPerPage: 'Rows per page, please:' },
    }}
  />
</Story>

<Story name="Pagination Enabled Default No Rows Per Page">
  <MaterialSvelteTable
    options={{ columns, data, paginationProps: { showRowsPerPage: false } }}
  />
</Story>

<Story name="Pagination Enabled Customize Rows Per Page">
  <MaterialSvelteTable
    options={{
      columns,
      data,
      initialState: { pagination: { pageIndex: 0, pageSize: 3 } },
      paginationProps: { rowsPerPageOptions: [3, 7, 11] },
    }}
  />
</Story>

<Story name="Pagination Pages Display Mode No Pages Per Row">
  <MaterialSvelteTable
    options={{
      columns,
      data,
      paginationDisplayMode: 'pages',
      paginationProps: { showRowsPerPage: false },
    }}
  />
</Story>

<Story name="Custom Pagination Pages Display Mode">
  <MaterialSvelteTable
    options={{
      columns,
      data,
      initialState: { pagination: { pageIndex: 0, pageSize: 5 } },
      paginationDisplayMode: 'pages',
    }}
  />
</Story>

<Story name="Custom Pagination Pages Display Mode More Data">
  <MaterialSvelteTable
    options={{
      columns,
      data: manyRows,
      initialState: { pagination: { pageIndex: 2, pageSize: 5 } },
      paginationDisplayMode: 'pages',
    }}
  />
</Story>

<Story name="Pagination Disabled Or Overriden">
  <MaterialSvelteTable
    options={{ columns, data, paginationProps: { disabled: true } }}
  />
</Story>

<Story name="Customize Pagination Components">
  <MaterialSvelteTable
    options={{
      columns,
      data,
      paginationProps: { class: 'custom-pagination', style: 'background: rgba(128, 128, 128, 0.12)' },
    }}
  />
</Story>

<!-- row virtualization -->
<Story name="Enable Row Virtualization Tall Content">
  <MaterialSvelteTable
    options={{
      columns,
      data: employees,
      enableRowVirtualization: true,
      tableBodyCellProps: { style: 'height: 120px' },
      tableContainerProps: tall,
    }}
  />
</Story>

<Story name="Virtualization Conditionally Wont Toggle">
  <MaterialSvelteTable
    options={{
      columns,
      data: employees,
      enableRowVirtualization: employees.length > 50,
      tableContainerProps: tall,
    }}
  />
</Story>

<Story name="Enable Row Virtualization With Detail Panel">
  <MaterialSvelteTable
    options={{
      columns,
      data: employees,
      detailPanel,
      enableRowVirtualization: true,
      tableContainerProps: tall,
    }}
  />
</Story>

<!-- column virtualization -->
<Story name="Enable Column Virtualization Short Columns">
  <MaterialSvelteTable
    options={{
      columns: Array.from({ length: 30 }, (_, i) => ({
        accessorFn: (row: Employee) => row.firstName + i,
        header: `Column ${i}`,
        id: `c${i}`,
        size: 60,
      })),
      data,
      enableColumnVirtualization: true,
      tableContainerProps: { style: 'max-width: 600px' },
    }}
  />
</Story>

<Story name="Enable Column Virtualization With Footer">
  <MaterialSvelteTable
    options={{
      columns: columns.map((c) => ({ ...c, footer: c.header })),
      data,
      enableColumnVirtualization: true,
      tableContainerProps: { style: 'max-width: 500px' },
    }}
  />
</Story>

<Story name="Enable Column Virtualization Sticky Footer">
  <MaterialSvelteTable
    options={{
      columns: columns.map((c) => ({ ...c, footer: c.header })),
      data: employees,
      enableColumnVirtualization: true,
      enableStickyFooter: true,
      tableContainerProps: { style: 'max-width: 500px; max-height: 400px' },
    }}
  />
</Story>

<Story name="Max Virtualization">
  <MaterialSvelteTable
    options={{
      columns: Array.from({ length: 50 }, (_, i) => ({
        accessorFn: (row: Employee) => `${row.firstName} ${i}`,
        header: `Column ${i}`,
        id: `c${i}`,
        size: 120,
      })),
      data: manyRows,
      enableColumnVirtualization: true,
      enableRowVirtualization: true,
      tableContainerProps: { style: 'max-height: 500px' },
    }}
  />
</Story>
