<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { ShadcnSvelteTable, type MRT_ColumnDef } from '../../src/lib';
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
  <ShadcnSvelteTable
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
  <ShadcnSvelteTable
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
  <ShadcnSvelteTable
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
  <ShadcnSvelteTable
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
  <ShadcnSvelteTable
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
  <ShadcnSvelteTable
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
  <ShadcnSvelteTable
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
  <ShadcnSvelteTable
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
  <ShadcnSvelteTable
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
  <ShadcnSvelteTable
    options={{
      columns,
      data: [],
      enableColumnVirtualization: true,
      enableRowVirtualization: true,
    }}
  />
</Story>
