<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { MaterialSvelteTable, type MRT_ColumnDef } from '../../src/lib';
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
  <MaterialSvelteTable options={{ columns, data }} />
</Story>

<Story name="Right Cells">
  <MaterialSvelteTable
    options={{
      columns,
      data,
      tableBodyCellProps: { style: right },
      tableHeadCellProps: { style: right },
    }}
  />
</Story>

<Story name="Center Cells">
  <MaterialSvelteTable
    options={{
      columns,
      data,
      tableBodyCellProps: { style: center },
      tableHeadCellProps: { style: center },
    }}
  />
</Story>

<Story name="Center Cells Grid">
  <MaterialSvelteTable
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
  <MaterialSvelteTable
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
  <MaterialSvelteTable options={{ caption, columns, data }} />
</Story>

<Story name="Custom Empty Rows">
  <MaterialSvelteTable options={{ columns, data: [], emptyRowsFallback: emptyFallback }} />
</Story>

<!-- column widths -->
<Story name="Custom Widths Semantic">
  <MaterialSvelteTable
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
  <MaterialSvelteTable
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
  <MaterialSvelteTable
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
  <MaterialSvelteTable
    options={{
      columns,
      data,
      enableStickyHeader: true,
      tableContainerProps: { style: 'max-height: 400px' },
    }}
  />
</Story>

<Story name="Enable Sticky Footer">
  <MaterialSvelteTable
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
  <MaterialSvelteTable
    options={{ columns, data, tableBodyRowProps: { style: 'height: 80px' } }}
  />
</Story>

<Story name="Disable Row Hover Effect">
  <MaterialSvelteTable
    options={{
      columns,
      data,
      tableBodyRowProps: { style: '--mrt-row-highlight-hover: transparent' },
    }}
  />
</Story>

<Story name="Style Custom Striped Rows">
  <MaterialSvelteTable
    options={{
      columns,
      data,
      tableBodyRowProps: ({ staticRowIndex }) => ({
        style:
          staticRowIndex % 2 === 0
            ? 'background-color: color-mix(in srgb, var(--mdc-theme-primary) 8%, transparent) !important'
            : '',
      }),
    }}
  />
</Story>

<Story name="Conditionally Style Rows">
  <MaterialSvelteTable
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
  <MaterialSvelteTable
    options={{
      columns,
      data,
      tableBodyCellProps: { style: 'font-style: italic; color: slategray' },
    }}
  />
</Story>

<Story name="Style Body Cell Conditionally In 1 Column">
  <MaterialSvelteTable
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
  <MaterialSvelteTable
    options={{
      columns: columns.map((c) =>
        c.accessorKey === 'salary' ? { ...c, Cell: salary } : c,
      ) as MRT_ColumnDef<Employee>[],
      data,
    }}
  />
</Story>

<Story name="Style All Head Cells">
  <MaterialSvelteTable
    options={{
      columns,
      data,
      tableHeadCellProps: { style: 'background-color: color-mix(in srgb, var(--mdc-theme-primary) 15%, var(--mdc-theme-surface)); text-transform: uppercase' },
    }}
  />
</Story>

<Story name="Custom Head Cell Renders">
  <MaterialSvelteTable
    options={{
      columns: columns.map((c) => ({ ...c, Header: headerWithEmoji })) as MRT_ColumnDef<Employee>[],
      data,
    }}
  />
</Story>

<Story name="Customize Display Columns">
  <MaterialSvelteTable
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
  <MaterialSvelteTable
    options={{
      columns,
      data,
      tablePaperProps: { style: 'max-width: 900px; margin: 0 auto' },
    }}
  />
</Story>

<Story name="Max Height">
  <MaterialSvelteTable
    options={{
      columns,
      data,
      enableStickyHeader: true,
      tableContainerProps: { style: 'max-height: 300px' },
    }}
  />
</Story>

<Story name="No Box Shadow">
  <MaterialSvelteTable
    options={{
      columns,
      data,
      tablePaperProps: { style: 'box-shadow: none; border: 1px solid var(--mrt-divider)' },
    }}
  />
</Story>

<!-- theming -->
<Story name="Default Theme">
  <MaterialSvelteTable options={{ columns, data, enableRowSelection: true }} />
</Story>

<Story name="Custom Light Theme">
  <div
    style="--mdc-theme-primary: #e91e63; --mdc-theme-surface: #fff8f9; --mdc-theme-on-surface: #3b0a1a"
  >
    <MaterialSvelteTable options={{ columns, data, enableRowSelection: true }} />
  </div>
</Story>

<Story name="Custom Dark Theme">
  <div
    style="--mdc-theme-primary: #00e5ff; --mdc-theme-surface: #0b1d26; --mdc-theme-on-surface: #e0f7fa; background: #0b1d26; padding: 1rem"
  >
    <MaterialSvelteTable options={{ columns, data, enableRowSelection: true }} />
  </div>
</Story>

<Story name="Custom MRT Theme Colors">
  <MaterialSvelteTable
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
