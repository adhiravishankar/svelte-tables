<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { BootstrapSvelteTable, type MRT_ColumnDef } from '../../src/lib';
  import { makeEmployees, employeeColumns } from '../data';

  const { Story } = defineMeta({ title: 'Features/Virtualization Examples' });

  const rows = makeEmployees(10_000);
  const columns = employeeColumns;

  // a wide table for column virtualization
  const wideColumns: MRT_ColumnDef<Record<string, string>>[] = Array.from(
    { length: 200 },
    (_, i) => ({ accessorKey: `c${i}`, header: `Column ${i}`, size: 120 }),
  );
  const wideData = Array.from({ length: 500 }, (_, r) =>
    Object.fromEntries(wideColumns.map((c, i) => [c.accessorKey as string, `r${r}c${i}`])),
  );
</script>

<Story name="Enable Row Virtualization Dense">
  <BootstrapSvelteTable
    options={{
      columns,
      data: rows,
      enablePagination: false,
      enableRowVirtualization: true,
      initialState: { density: 'compact' },
      tableContainerProps: { style: 'max-height: 600px' },
    }}
  />
</Story>

<Story name="Enable Row Virtualization Comfortable">
  <BootstrapSvelteTable
    options={{
      columns,
      data: rows,
      enablePagination: false,
      enableRowVirtualization: true,
      tableContainerProps: { style: 'max-height: 600px' },
    }}
  />
</Story>

<Story name="Enable Row Virtualization Spacious">
  <BootstrapSvelteTable
    options={{
      columns,
      data: rows,
      enablePagination: false,
      enableRowVirtualization: true,
      initialState: { density: 'spacious' },
      tableContainerProps: { style: 'max-height: 600px' },
    }}
  />
</Story>

<Story name="Enable Row Virtualization With Column Resizing">
  <BootstrapSvelteTable
    options={{
      columns,
      data: rows,
      enableColumnResizing: true,
      enablePagination: false,
      enableRowVirtualization: true,
      tableContainerProps: { style: 'max-height: 600px' },
    }}
  />
</Story>

<Story name="Enable Row Virtualization Sticky Footer">
  <BootstrapSvelteTable
    options={{
      columns: columns.map((c) => ({ ...c, footer: String(c.header) })),
      data: rows,
      enablePagination: false,
      enableRowVirtualization: true,
      enableStickyFooter: true,
      tableContainerProps: { style: 'max-height: 600px' },
    }}
  />
</Story>

<Story name="Enable Column Virtualization">
  <BootstrapSvelteTable
    options={{
      columns: wideColumns,
      data: wideData,
      enableColumnVirtualization: true,
      enablePagination: false,
      enableRowVirtualization: false,
      tableContainerProps: { style: 'max-height: 600px' },
    }}
  />
</Story>

<Story name="Enable Column Virtualization With Pinning">
  <BootstrapSvelteTable
    options={{
      columns: wideColumns,
      data: wideData,
      enableColumnPinning: true,
      enableColumnVirtualization: true,
      initialState: { columnPinning: { end: ['c199'], start: ['c0'] } },
      tableContainerProps: { style: 'max-height: 600px' },
    }}
  />
</Story>

<Story name="Row And Column Virtualization">
  <BootstrapSvelteTable
    options={{
      columns: wideColumns,
      data: wideData,
      enableColumnVirtualization: true,
      enablePagination: false,
      enableRowVirtualization: true,
      tableContainerProps: { style: 'max-height: 600px' },
    }}
  />
</Story>

<Story name="Row And Column Virtualization With Features">
  <BootstrapSvelteTable
    options={{
      columns: wideColumns,
      data: wideData,
      enableColumnOrdering: true,
      enableColumnPinning: true,
      enableColumnVirtualization: true,
      enablePagination: false,
      enableRowSelection: true,
      enableRowVirtualization: true,
      tableContainerProps: { style: 'max-height: 600px' },
    }}
  />
</Story>

<Story name="Empty Data Virtualization">
  <BootstrapSvelteTable
    options={{
      columns,
      data: [],
      enableColumnVirtualization: true,
      enableRowVirtualization: true,
    }}
  />
</Story>
