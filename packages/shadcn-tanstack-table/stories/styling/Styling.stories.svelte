<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { ShadcnSvelteTable, type MRT_ColumnDef } from '../../src/lib';
  import { type Employee, employees, employeeColumns } from '../data';

  const { Story } = defineMeta({ title: 'Styling/Styling Examples' });

  const columns = employeeColumns;
  const data = employees.slice(0, 25);

  const center = 'text-align: center; justify-content: center';
  const right = 'text-align: right; justify-content: flex-end';
</script>

{#snippet caption()}
  Employees, updated nightly
{/snippet}

{#snippet salary(ctx: { renderedCellValue: unknown })}
  <strong style="color: seagreen">${Number(ctx.renderedCellValue).toLocaleString()}</strong>
{/snippet}

{#snippet headerWithEmoji(ctx: { column: { columnDef: { header: string } } })}
  🧑‍💼 {ctx.column.columnDef.header}
{/snippet}

{#snippet emptyFallback()}
  <p style="padding: 2rem; text-align: center">Nothing here yet — add someone!</p>
{/snippet}

<!-- alignment -->
<Story name="Default Left">
  <ShadcnSvelteTable options={{ columns, data }} />
</Story>

<Story name="Right Cells">
  <ShadcnSvelteTable
    options={{
      columns,
      data,
      tableBodyCellProps: { style: right },
      tableHeadCellProps: { style: right },
    }}
  />
</Story>

<Story name="Center Cells">
  <ShadcnSvelteTable
    options={{
      columns,
      data,
      tableBodyCellProps: { style: center },
      tableHeadCellProps: { style: center },
    }}
  />
</Story>

<Story name="Center Cells Grid">
  <ShadcnSvelteTable
    options={{
      columns,
      data,
      layoutMode: 'grid',
      tableBodyCellProps: { style: center },
      tableHeadCellProps: { style: center },
    }}
  />
</Story>

<Story name="Right Align Number Column">
  <ShadcnSvelteTable
    options={{
      columns: columns.map((c) =>
        c.accessorKey === 'salary'
          ? { ...c, tableBodyCellProps: { style: right }, tableHeadCellProps: { style: right } }
          : c,
      ) as MRT_ColumnDef<Employee>[],
      data,
    }}
  />
</Story>

<!-- caption / custom body -->
<Story name="Bottom Caption">
  <ShadcnSvelteTable options={{ caption, columns, data }} />
</Story>

<Story name="Custom Empty Rows">
  <ShadcnSvelteTable options={{ columns, data: [], emptyRowsFallback: emptyFallback }} />
</Story>

<!-- column widths -->
<Story name="Custom Widths Semantic">
  <ShadcnSvelteTable
    options={{
      columns: [
        { accessorKey: 'firstName', header: 'First Name', size: 100 },
        { accessorKey: 'lastName', header: 'Last Name', size: 400 },
        { accessorKey: 'state', header: 'State', size: 200 },
      ],
      data,
    }}
  />
</Story>

<Story name="Custom Widths Grid">
  <ShadcnSvelteTable
    options={{
      columns: [
        { accessorKey: 'firstName', header: 'First Name', size: 100 },
        { accessorKey: 'lastName', header: 'Last Name', size: 400 },
        { accessorKey: 'state', header: 'State', size: 200 },
      ],
      data,
      layoutMode: 'grid',
    }}
  />
</Story>

<Story name="Custom Widths Grid No Grow Individual Grow">
  <ShadcnSvelteTable
    options={{
      columns: [
        { accessorKey: 'firstName', grow: false, header: 'First Name', size: 100 },
        { accessorKey: 'lastName', grow: true, header: 'Last Name', size: 200 },
        { accessorKey: 'state', header: 'State', size: 200 },
      ],
      data,
      layoutMode: 'grid-no-grow',
    }}
  />
</Story>

<!-- sticky header / footer -->
<Story name="Enable Sticky Header">
  <ShadcnSvelteTable
    options={{
      columns,
      data,
      enableStickyHeader: true,
      tableContainerProps: { style: 'max-height: 400px' },
    }}
  />
</Story>

<Story name="Enable Sticky Footer">
  <ShadcnSvelteTable
    options={{
      columns: columns.map((c) => ({ ...c, footer: String(c.header) })),
      data,
      enableStickyFooter: true,
      enableStickyHeader: true,
      tableContainerProps: { style: 'max-height: 400px' },
    }}
  />
</Story>

<!-- rows / cells / head cells -->
<Story name="Set Row Height">
  <ShadcnSvelteTable
    options={{ columns, data, tableBodyRowProps: { style: 'height: 80px' } }}
  />
</Story>

<Story name="Disable Row Hover Effect">
  <ShadcnSvelteTable
    options={{
      columns,
      data,
      tableBodyRowProps: { style: '--mrt-row-highlight-hover: transparent' },
    }}
  />
</Story>

<Story name="Style Custom Striped Rows">
  <ShadcnSvelteTable
    options={{
      columns,
      data,
      tableBodyRowProps: ({ staticRowIndex }) => ({
        style:
          staticRowIndex % 2 === 0
            ? 'background-color: color-mix(in srgb, var(--primary) 8%, transparent) !important'
            : '',
      }),
    }}
  />
</Story>

<Story name="Conditionally Style Rows">
  <ShadcnSvelteTable
    options={{
      columns,
      data,
      tableBodyRowProps: ({ row }) => ({
        style: row.original.age > 50 ? 'outline: 2px solid tomato; outline-offset: -2px' : '',
      }),
    }}
  />
</Story>

<Story name="Style All Body Cells">
  <ShadcnSvelteTable
    options={{
      columns,
      data,
      tableBodyCellProps: { style: 'font-style: italic; color: slategray' },
    }}
  />
</Story>

<Story name="Style Body Cell Conditionally In 1 Column">
  <ShadcnSvelteTable
    options={{
      columns: columns.map((c) =>
        c.accessorKey === 'age'
          ? {
              ...c,
              tableBodyCellProps: ({ cell }) => ({
                style: Number(cell.getValue()) > 50 ? 'color: tomato; font-weight: bold' : '',
              }),
            }
          : c,
      ) as MRT_ColumnDef<Employee>[],
      data,
    }}
  />
</Story>

<Story name="Custom Cell Render">
  <ShadcnSvelteTable
    options={{
      columns: columns.map((c) =>
        c.accessorKey === 'salary' ? { ...c, Cell: salary } : c,
      ) as MRT_ColumnDef<Employee>[],
      data,
    }}
  />
</Story>

<Story name="Style All Head Cells">
  <ShadcnSvelteTable
    options={{
      columns,
      data,
      tableHeadCellProps: { style: 'background-color: color-mix(in srgb, var(--primary) 15%, var(--card)); text-transform: uppercase' },
    }}
  />
</Story>

<Story name="Custom Head Cell Renders">
  <ShadcnSvelteTable
    options={{
      columns: columns.map((c) => ({ ...c, Header: headerWithEmoji })) as MRT_ColumnDef<Employee>[],
      data,
    }}
  />
</Story>

<Story name="Customize Display Columns">
  <ShadcnSvelteTable
    options={{
      columns,
      data,
      displayColumnDefOptions: {
        'mrt-row-numbers': { size: 80, tableBodyCellProps: { style: 'font-weight: bold' } },
        'mrt-row-select': { size: 100 },
      },
      enableRowNumbers: true,
      enableRowSelection: true,
    }}
  />
</Story>

<!-- dimensions / paper -->
<Story name="Max Width And Centered">
  <ShadcnSvelteTable
    options={{
      columns,
      data,
      tablePaperProps: { style: 'max-width: 900px; margin: 0 auto' },
    }}
  />
</Story>

<Story name="Max Height">
  <ShadcnSvelteTable
    options={{
      columns,
      data,
      enableStickyHeader: true,
      tableContainerProps: { style: 'max-height: 300px' },
    }}
  />
</Story>

<Story name="No Box Shadow">
  <ShadcnSvelteTable
    options={{
      columns,
      data,
      tablePaperProps: { style: 'box-shadow: none; border: 1px solid var(--mrt-divider)' },
    }}
  />
</Story>

<!-- theming -->
<Story name="Default Theme">
  <ShadcnSvelteTable options={{ columns, data, enableRowSelection: true }} />
</Story>

<Story name="Custom Light Theme">
  <div
    style="--primary: #e91e63; --card: #fff8f9; --foreground: #3b0a1a"
  >
    <ShadcnSvelteTable options={{ columns, data, enableRowSelection: true }} />
  </div>
</Story>

<Story name="Custom Dark Theme">
  <div
    style="--primary: #00e5ff; --card: #0b1d26; --foreground: #e0f7fa; background: #0b1d26; padding: 1rem"
  >
    <ShadcnSvelteTable options={{ columns, data, enableRowSelection: true }} />
  </div>
</Story>

<Story name="Custom MRT Theme Colors">
  <ShadcnSvelteTable
    options={{
      columns,
      data,
      enableRowSelection: true,
      mrtTheme: {
        baseBackgroundColor: '#fffbe6',
        selectedRowBackgroundColor: '#ffe58f',
      },
    }}
  />
</Story>
