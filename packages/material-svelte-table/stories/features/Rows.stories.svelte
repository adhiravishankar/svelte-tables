<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import {
    MaterialSvelteTable,
    type MRT_ColumnDef,
    type MRT_Row,
    type MRT_TableInstance,
  } from '../../src/lib';
  import { type Employee, employees, employeeColumns, makeTree } from '../data';
  import SingleExpand from './SingleExpand.svelte';

  // Detail panels and sub-row trees
  const { Story } = defineMeta({ title: 'Features/Row Expanding Examples' });

  const columns = employeeColumns;
  const tree = makeTree();
</script>

{#snippet detailPanel(ctx: { row: MRT_Row<Employee> })}
  <div style="display: grid; gap: 0.25rem; padding: 0.5rem 1rem">
    <strong>{ctx.row.original.firstName} {ctx.row.original.lastName}</strong>
    <span>{ctx.row.original.address}</span>
    <span>{ctx.row.original.city}, {ctx.row.original.state}</span>
    <span>{ctx.row.original.phoneNumber}</span>
  </div>
{/snippet}

<!-- detail panel -->
<Story name="Detail Panel Enabled Semantic">
  <MaterialSvelteTable options={{ columns, data: employees, detailPanel }} />
</Story>

<Story name="Detail Panel Enabled Grid">
  <MaterialSvelteTable
    options={{ columns, data: employees, detailPanel, layoutMode: 'grid' }}
  />
</Story>

<Story name="Detail Panel Enabled Grid No Grow">
  <MaterialSvelteTable
    options={{ columns, data: employees, detailPanel, layoutMode: 'grid-no-grow' }}
  />
</Story>

<Story name="Detail Panel Enabled Conditional">
  <MaterialSvelteTable
    options={{
      columns,
      data: employees,
      detailPanel,
      // only rows of people over 50 can expand
      getRowCanExpand: (row) => row.original.age > 50,
    }}
  />
</Story>

<Story name="Detail Panel Single Expand">
  <SingleExpand {columns} data={employees} {detailPanel} />
</Story>

<Story name="Detail Panel Expand Column Last">
  <MaterialSvelteTable
    options={{ columns, data: employees, detailPanel, positionExpandColumn: 'last' }}
  />
</Story>

<Story name="Detail Panel Expanded By Default">
  <MaterialSvelteTable
    options={{ columns, data: employees, detailPanel, initialState: { expanded: true } }}
  />
</Story>

<Story name="Detail Panel Expand All Disabled">
  <MaterialSvelteTable
    options={{ columns, data: employees, detailPanel, enableExpandAll: false }}
  />
</Story>

<!-- sub rows -->
<Story name="Sub Row Tree Enabled Default">
  <MaterialSvelteTable
    options={{ columns, data: tree, enableExpanding: true, getSubRows: (row) => row.subRows }}
  />
</Story>

<Story name="Sub Row Tree Layout Grid">
  <MaterialSvelteTable
    options={{
      columns,
      data: tree,
      enableExpanding: true,
      getSubRows: (row) => row.subRows,
      layoutMode: 'grid',
    }}
  />
</Story>

<Story name="Sub Row Tree Enabled Position Last">
  <MaterialSvelteTable
    options={{
      columns,
      data: tree,
      enableExpanding: true,
      getSubRows: (row) => row.subRows,
      positionExpandColumn: 'last',
    }}
  />
</Story>

<Story name="Sub Row Tree Enabled Default RTL">
  <div dir="rtl">
    <MaterialSvelteTable
      options={{
        columnResizeDirection: 'rtl',
        columns,
        data: tree,
        enableExpanding: true,
        getSubRows: (row) => row.subRows,
      }}
    />
  </div>
</Story>

<Story name="Sub Row Tree Disable Expand All">
  <MaterialSvelteTable
    options={{
      columns,
      data: tree,
      enableExpandAll: false,
      enableExpanding: true,
      getSubRows: (row) => row.subRows,
    }}
  />
</Story>

<Story name="Sub Row Tree Filter From Leaf Rows">
  <MaterialSvelteTable
    options={{
      columns,
      data: tree,
      enableExpanding: true,
      filterFromLeafRows: true,
      getSubRows: (row) => row.subRows,
      initialState: { expanded: true, showColumnFilters: true },
    }}
  />
</Story>

<Story name="Sub Row Tree Max Leaf Row Filter Depth 0">
  <MaterialSvelteTable
    options={{
      columns,
      data: tree,
      enableExpanding: true,
      getSubRows: (row) => row.subRows,
      initialState: { expanded: true, showColumnFilters: true },
      maxLeafRowFilterDepth: 0,
    }}
  />
</Story>

<Story name="Sub Row Tree With Selection">
  <MaterialSvelteTable
    options={{
      columns,
      data: tree,
      enableExpanding: true,
      enableRowSelection: true,
      getSubRows: (row) => row.subRows,
    }}
  />
</Story>

<Story name="Sub Row Tree With Single Selection">
  <MaterialSvelteTable
    options={{
      columns,
      data: tree,
      enableExpanding: true,
      enableMultiRowSelection: false,
      enableRowSelection: true,
      getSubRows: (row) => row.subRows,
    }}
  />
</Story>
