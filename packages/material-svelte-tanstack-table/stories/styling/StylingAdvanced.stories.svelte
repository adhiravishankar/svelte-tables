<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import {
    MaterialSvelteTable,
    type MRT_Row,
    type MRT_TableInstance,
  } from '../../src/lib';
  import { type Employee, employees, employeeColumns } from '../data';

  // Captions, custom bodies, sticky header/footer, cell, row and head styles, dimensions
  const { Story } = defineMeta({ title: 'Styling/Styling Examples (Advanced)' });

  const columns = employeeColumns;
  const data = employees.slice(0, 40);
  const stripe = (index: number) => (index % 2 === 0 ? 'background: rgba(128, 128, 128, 0.12)' : '');
</script>

{#snippet caption()}
  A caption that sits above the table
{/snippet}

{#snippet emptyRows()}
  <div style="padding: 2rem; text-align: center">
    <strong>Nothing here yet.</strong> Try adding some data.
  </div>
{/snippet}

{#snippet detailPanel(ctx: { row: MRT_Row<Employee> })}
  <div style="padding: 1rem">{ctx.row.original.firstName}'s details</div>
{/snippet}

<Story name="Top Caption">
  <MaterialSvelteTable options={{ caption, columns, data }} />
</Story>

<Story name="Custom Table Body">
  <MaterialSvelteTable
    options={{
      columns,
      data,
      tableBodyProps: { style: 'font-style: italic' },
      tableBodyRowProps: ({ staticRowIndex }) => ({ style: stripe(staticRowIndex) }),
    }}
  />
</Story>

<Story name="Custom Empty Rows JSX">
  <MaterialSvelteTable options={{ columns, data: [], emptyRowsFallback: emptyRows }} />
</Story>

<!-- sticky -->
<Story name="Sticky Header Disabled Default">
  <MaterialSvelteTable
    options={{ columns, data, enableStickyHeader: false, tableContainerProps: { style: 'max-height: 300px' } }}
  />
</Story>

<Story name="Sticky Header Shorter Table">
  <MaterialSvelteTable
    options={{ columns, data, enableStickyHeader: true, tableContainerProps: { style: 'max-height: 200px' } }}
  />
</Story>

<Story name="Disable Sticky Footer">
  <MaterialSvelteTable
    options={{
      columns: columns.map((c) => ({ ...c, footer: c.header })),
      data,
      enableStickyFooter: false,
      tableContainerProps: { style: 'max-height: 300px' },
    }}
  />
</Story>

<!-- body cells -->
<Story name="Default Table Body Cell Styles">
  <MaterialSvelteTable options={{ columns, data }} />
</Story>

<Story name="Style All Table Body Cell">
  <MaterialSvelteTable
    options={{
      columns,
      data,
      tableBodyCellProps: { style: 'color: tomato; font-weight: 600; border-right: 1px solid rgba(128,128,128,0.4)' },
    }}
  />
</Story>

<Story name="Style Table Body Cell Conditionally In 1 Column">
  <MaterialSvelteTable
    options={{
      columns: columns.map((c) =>
        c.accessorKey === 'salary'
          ? {
              ...c,
              tableBodyCellProps: ({ cell }: { cell: { getValue: () => unknown } }) => ({
                style: Number(cell.getValue()) > 100_000 ? 'color: seagreen; font-weight: 700' : 'color: tomato',
              }),
            }
          : c,
      ),
      data,
    }}
  />
</Story>

<!-- body rows -->
<Story name="Default Table Body Row Styles">
  <MaterialSvelteTable options={{ columns, data }} />
</Story>

<Story name="Style Table Body Row">
  <MaterialSvelteTable
    options={{ columns, data, tableBodyRowProps: { style: 'height: 56px; cursor: pointer' } }}
  />
</Story>

<Story name="Style Custom Striped Rows Detail Panel">
  <MaterialSvelteTable
    options={{
      columns,
      data,
      detailPanel,
      tableBodyRowProps: ({ staticRowIndex }) => ({ style: stripe(staticRowIndex) }),
    }}
  />
</Story>

<Story name="Conditionally Style Table Row">
  <MaterialSvelteTable
    options={{
      columns,
      data,
      tableBodyRowProps: ({ row }) => ({
        style: row.original.isActive ? '' : 'opacity: 0.5; text-decoration: line-through',
      }),
    }}
  />
</Story>

<!-- head cells -->
<Story name="Default Table Head Cell Styles">
  <MaterialSvelteTable options={{ columns, data }} />
</Story>

<Story name="Color Sort Icon">
  <MaterialSvelteTable
    options={{
      columns,
      data,
      initialState: { sorting: [{ desc: false, id: 'firstName' }] },
      mrtTheme: { selectedRowBackgroundColor: 'rgba(0, 150, 136, 0.2)' },
      tableHeadCellProps: { style: '--mdc-theme-primary: tomato' },
    }}
  />
</Story>

<Story name="Style All Table Head Cell">
  <MaterialSvelteTable
    options={{
      columns,
      data,
      tableHeadCellProps: { style: 'background: rgba(0, 150, 136, 0.18); font-style: italic' },
    }}
  />
</Story>

<Story name="Style Table Head Cells Individually">
  <MaterialSvelteTable
    options={{
      columns: columns.map((c, i) => ({
        ...c,
        tableHeadCellProps: { style: `color: hsl(${i * 60}, 70%, 45%)` },
      })),
      data,
    }}
  />
</Story>

<!-- dimensions -->
<Story name="Min Height">
  <MaterialSvelteTable
    options={{ columns, data: data.slice(0, 3), tableContainerProps: { style: 'min-height: 400px' } }}
  />
</Story>

<Story name="Min Height Parent">
  <div style="height: 600px">
    <MaterialSvelteTable
      options={{
        columns,
        data: data.slice(0, 3),
        tablePaperProps: { style: 'height: 100%' },
      }}
    />
  </div>
</Story>

<Story name="Container Height">
  <MaterialSvelteTable
    options={{ columns, data, tableContainerProps: { style: 'height: 250px; max-height: none' } }}
  />
</Story>
