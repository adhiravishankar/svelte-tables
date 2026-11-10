<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import {
    ShadcnSvelteTable,
    MRT_Default_Icons,
    type MRT_ColumnDef,
    type MRT_Row,
    type MRT_TableInstance,
  } from '../../src/lib';
  import { type Employee, employees } from '../data';

  // The library's built in icons rendered next to custom HTML in headers, cells, footers and actions
  const { Story } = defineMeta({ title: 'Features/Icons With Custom HTML' });

  const data = employees.slice(0, 30);

  const headerColumns: MRT_ColumnDef<Employee>[] = [
    { accessorKey: 'firstName', Header: nameHeader, header: 'First Name' },
    { accessorKey: 'lastName', header: 'Last Name' },
    { accessorKey: 'state', Header: stateHeader, header: 'State' },
    { accessorKey: 'age', header: 'Age' },
  ];

  const cellColumns: MRT_ColumnDef<Employee>[] = [
    { accessorKey: 'firstName', header: 'First Name' },
    { accessorKey: 'lastName', header: 'Last Name' },
    { accessorKey: 'state', Cell: stateCell, header: 'State' },
    { accessorKey: 'salary', Cell: salaryCell, header: 'Salary' },
  ];

  const footerColumns: MRT_ColumnDef<Employee>[] = [
    { accessorKey: 'firstName', footer: 'First Name', header: 'First Name' },
    { accessorKey: 'lastName', footer: 'Last Name', header: 'Last Name' },
    { accessorKey: 'age', Footer: ageFooter, header: 'Age' },
  ];
</script>

{#snippet nameHeader()}
  <span style="align-items: center; display: inline-flex; gap: 0.25rem">
    <MRT_Default_Icons.EditIcon style="font-size: 1rem" />
    <strong>First Name</strong>
  </span>
{/snippet}

{#snippet stateHeader()}
  <span style="align-items: center; display: inline-flex; gap: 0.25rem">
    <MRT_Default_Icons.FilterAltIcon style="font-size: 1rem" />
    <em>State</em>
    <small style="opacity: 0.6">(custom)</small>
  </span>
{/snippet}

{#snippet stateCell(ctx: { renderedCellValue: unknown })}
  <span style="align-items: center; display: inline-flex; gap: 0.25rem">
    <MRT_Default_Icons.ArrowRightIcon style="font-size: 1rem" />
    <span style="background: #e3f2fd; border-radius: 4px; padding: 0 0.4rem">
      {ctx.renderedCellValue}
    </span>
  </span>
{/snippet}

{#snippet salaryCell(ctx: { cell: { getValue: () => unknown } })}
  {@const salary = Number(ctx.cell.getValue())}
  <span
    style="align-items: center; color: {salary > 50000 ? 'green' : 'inherit'}; display: inline-flex; gap: 0.25rem"
  >
    {#if salary > 50000}
      <MRT_Default_Icons.KeyboardDoubleArrowDownIcon
        style="font-size: 1rem; transform: rotate(180deg)"
      />
    {/if}
    <b>${salary.toLocaleString()}</b>
  </span>
{/snippet}

{#snippet ageFooter()}
  <span style="align-items: center; display: inline-flex; gap: 0.25rem">
    <MRT_Default_Icons.DynamicFeedIcon style="font-size: 1rem" />
    Average age: <b>{Math.round(data.reduce((sum, row) => sum + row.age, 0) / data.length)}</b>
  </span>
{/snippet}

{#snippet rowActions(ctx: { row: MRT_Row<Employee> })}
  <div style="align-items: center; display: flex; gap: 0.5rem">
    <button
      aria-label="Edit"
      onclick={() => alert(`Edit ${ctx.row.original.firstName}`)}
      style="align-items: center; display: inline-flex; gap: 0.25rem"
    >
      <MRT_Default_Icons.EditIcon style="font-size: 1rem" /> Edit
    </button>
    <button
      aria-label="Close"
      onclick={() => alert(`Remove ${ctx.row.original.firstName}`)}
      style="align-items: center; display: inline-flex; gap: 0.25rem"
    >
      <MRT_Default_Icons.CloseIcon style="font-size: 1rem" /> Remove
    </button>
  </div>
{/snippet}

{#snippet toolbarActions(ctx: { table: MRT_TableInstance<Employee> })}
  <div style="align-items: center; display: flex; gap: 0.5rem">
    <button
      onclick={() => ctx.table.resetColumnFilters()}
      style="align-items: center; display: inline-flex; gap: 0.25rem"
    >
      <MRT_Default_Icons.RestartAltIcon style="font-size: 1rem" /> Reset filters
    </button>
    <button
      onclick={() => ctx.table.resetSorting()}
      style="align-items: center; display: inline-flex; gap: 0.25rem"
    >
      <MRT_Default_Icons.ClearAllIcon style="font-size: 1rem" /> Clear sorting
    </button>
  </div>
{/snippet}

<Story name="Default Icons In Custom Headers">
  <ShadcnSvelteTable options={{ columns: headerColumns, data }} />
</Story>

<Story name="Default Icons In Custom Cells">
  <ShadcnSvelteTable options={{ columns: cellColumns, data }} />
</Story>

<Story name="Default Icons In Custom Footer">
  <ShadcnSvelteTable options={{ columns: footerColumns, data, enableTableFooter: true }} />
</Story>

<Story name="Default Icons In Custom Row Actions">
  <ShadcnSvelteTable
    options={{ columns: cellColumns, data, enableRowActions: true, rowActions }}
  />
</Story>

<Story name="Default Icons In Custom Toolbar Actions">
  <ShadcnSvelteTable
    options={{
      columns: headerColumns,
      data,
      enableColumnFilters: true,
      topToolbarCustomActions: toolbarActions,
    }}
  />
</Story>

<Story name="Default Icons Everywhere With Custom HTML">
  <ShadcnSvelteTable
    options={{
      columns: [
        { accessorKey: 'firstName', Header: nameHeader, header: 'First Name' },
        { accessorKey: 'state', Cell: stateCell, Header: stateHeader, header: 'State' },
        { accessorKey: 'salary', Cell: salaryCell, header: 'Salary' },
        { accessorKey: 'age', Footer: ageFooter, header: 'Age' },
      ],
      data,
      enableRowActions: true,
      enableTableFooter: true,
      rowActions,
      topToolbarCustomActions: toolbarActions,
    }}
  />
</Story>
