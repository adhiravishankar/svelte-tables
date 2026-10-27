<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import {
    ShadcnSvelteTable,
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
  <ShadcnSvelteTable options={{ caption, columns, data }} />
</Story>

<Story name="Custom Table Body">
  <ShadcnSvelteTable
    options={{
      columns,
      data,
      tableBodyProps: { style: 'font-style: italic' },
      tableBodyRowProps: ({ staticRowIndex }) => ({ style: stripe(staticRowIndex) }),
    }}
  />
</Story>

<Story name="Custom Empty Rows JSX">
  <ShadcnSvelteTable options={{ columns, data: [], emptyRowsFallback: emptyRows }} />
</Story>

<!-- sticky -->
<Story name="Sticky Header Disabled Default">
  <ShadcnSvelteTable
    options={{ columns, data, enableStickyHeader: false, tableContainerProps: { style: 'max-height: 300px' } }}
  />
</Story>

<Story name="Sticky Header Shorter Table">
  <ShadcnSvelteTable
    options={{ columns, data, enableStickyHeader: true, tableContainerProps: { style: 'max-height: 200px' } }}
  />
</Story>

<Story name="Disable Sticky Footer">
  <ShadcnSvelteTable
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
  <ShadcnSvelteTable options={{ columns, data }} />
</Story>

<Story name="Style All Table Body Cell">
  <ShadcnSvelteTable
    options={{
      columns,
      data,
      tableBodyCellProps: { style: 'color: tomato; font-weight: 600; border-right: 1px solid rgba(128,128,128,0.4)' },
    }}
  />
</Story>

<Story name="Style Table Body Cell Conditionally In 1 Column">
  <ShadcnSvelteTable
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
  <ShadcnSvelteTable options={{ columns, data }} />
</Story>

<Story name="Style Table Body Row">
  <ShadcnSvelteTable
    options={{ columns, data, tableBodyRowProps: { style: 'height: 56px; cursor: pointer' } }}
  />
</Story>

<Story name="Style Custom Striped Rows Detail Panel">
  <ShadcnSvelteTable
    options={{
      columns,
      data,
      detailPanel,
      tableBodyRowProps: ({ staticRowIndex }) => ({ style: stripe(staticRowIndex) }),
    }}
  />
</Story>

<Story name="Conditionally Style Table Row">
  <ShadcnSvelteTable
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
  <ShadcnSvelteTable options={{ columns, data }} />
</Story>

<Story name="Color Sort Icon">
  <ShadcnSvelteTable
    options={{
      columns,
      data,
      initialState: { sorting: [{ desc: false, id: 'firstName' }] },
      mrtTheme: { selectedRowBackgroundColor: 'rgba(0, 150, 136, 0.2)' },
      tableHeadCellProps: { style: '--primary: tomato' },
    }}
  />
</Story>

<Story name="Style All Table Head Cell">
  <ShadcnSvelteTable
    options={{
      columns,
      data,
      tableHeadCellProps: { style: 'background: rgba(0, 150, 136, 0.18); font-style: italic' },
    }}
  />
</Story>

<Story name="Style Table Head Cells Individually">
  <ShadcnSvelteTable
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
  <ShadcnSvelteTable
    options={{ columns, data: data.slice(0, 3), tableContainerProps: { style: 'min-height: 400px' } }}
  />
</Story>

<Story name="Min Height Parent">
  <div style="height: 600px">
    <ShadcnSvelteTable
      options={{
        columns,
        data: data.slice(0, 3),
        tablePaperProps: { style: 'height: 100%' },
      }}
    />
  </div>
</Story>

<Story name="Container Height">
  <ShadcnSvelteTable
    options={{ columns, data, tableContainerProps: { style: 'height: 250px; max-height: none' } }}
  />
</Story>
