<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { MaterialSvelteTable } from '../../src/lib';
  import { employees, employeeColumns } from '../data';
  import RowOrdering from './RowOrdering.svelte';

  // Row pinning, dragging, ordering and numbers
  const { Story } = defineMeta({ title: 'Features/Row Examples' });

  const columns = employeeColumns;
  const data = employees.slice(0, 40);
</script>

<!-- numbers -->
<Story name="Enable Row Numbers Static">
  <MaterialSvelteTable options={{ columns, data, enableRowNumbers: true }} />
</Story>

<Story name="Enable Row Numbers Original">
  <MaterialSvelteTable
    options={{ columns, data, enableRowNumbers: true, rowNumberDisplayMode: 'original' }}
  />
</Story>

<Story name="Enable Row Numbers Static Grid">
  <MaterialSvelteTable
    options={{ columns, data, enableRowNumbers: true, layoutMode: 'grid' }}
  />
</Story>

<Story name="Enable Row Numbers Static Grid No Grow">
  <MaterialSvelteTable
    options={{ columns, data, enableRowNumbers: true, layoutMode: 'grid-no-grow' }}
  />
</Story>

<!-- pinning -->
<Story name="Row Pinning Sticky Default Enabled">
  <MaterialSvelteTable options={{ columns, data, enableRowPinning: true }} />
</Story>

<Story name="Row Pinning Enabled Conditionally">
  <MaterialSvelteTable
    options={{
      columns,
      data,
      // only people over 40 can be pinned
      enableRowPinning: (row) => row.original.age > 40,
    }}
  />
</Story>

<Story name="Row Pinning Sticky No Pagination">
  <MaterialSvelteTable
    options={{ columns, data, enablePagination: false, enableRowPinning: true }}
  />
</Story>

<Story name="Row Pinning Select Sticky Mode">
  <MaterialSvelteTable
    options={{
      columns,
      data,
      enableRowPinning: true,
      enableRowSelection: true,
      rowPinningDisplayMode: 'select-sticky',
    }}
  />
</Story>

<Story name="Row Pinning Top And Bottom Mode">
  <MaterialSvelteTable
    options={{ columns, data, enableRowPinning: true, rowPinningDisplayMode: 'top-and-bottom' }}
  />
</Story>

<Story name="Row Pinning Top Mode">
  <MaterialSvelteTable
    options={{ columns, data, enableRowPinning: true, rowPinningDisplayMode: 'top' }}
  />
</Story>

<Story name="Row Pinning Select Top Mode">
  <MaterialSvelteTable
    options={{
      columns,
      data,
      enableRowPinning: true,
      enableRowSelection: true,
      rowPinningDisplayMode: 'select-top',
    }}
  />
</Story>

<Story name="Row Pinning Bottom Mode">
  <MaterialSvelteTable
    options={{ columns, data, enableRowPinning: true, rowPinningDisplayMode: 'bottom' }}
  />
</Story>

<Story name="Row Pinning With Sticky Header">
  <MaterialSvelteTable
    options={{ columns, data, enableRowPinning: true, enableStickyHeader: true }}
  />
</Story>

<Story name="Row Pinning With Grid Layout">
  <MaterialSvelteTable
    options={{ columns, data, enableRowPinning: true, layoutMode: 'grid' }}
  />
</Story>

<Story name="Row And Column Pinning">
  <MaterialSvelteTable
    options={{ columns, data, enableColumnPinning: true, enableRowPinning: true }}
  />
</Story>

<!-- dragging / ordering -->
<Story name="Row Dragging Enabled">
  <MaterialSvelteTable options={{ columns, data, enableRowDragging: true }} />
</Story>

<Story name="Row Dragging Enabled Grid">
  <MaterialSvelteTable
    options={{ columns, data, enableRowDragging: true, layoutMode: 'grid' }}
  />
</Story>

<Story name="Row Ordering Enabled">
  <RowOrdering />
</Story>

<Story name="Row Ordering With Select">
  <RowOrdering selection />
</Story>

<Story name="Row And Column Ordering">
  <RowOrdering columnOrdering />
</Story>
