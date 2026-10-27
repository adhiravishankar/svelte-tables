<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import {
    MaterialSvelteTable,
    type MRT_Cell,
    type MRT_ColumnDef,
    type MRT_Header,
    type MRT_Row,
    type MRT_TableInstance,
  } from '../../src/lib';
  import { type Employee, employees } from '../data';
  import GroupingSetState from './GroupingSetState.svelte';

  // More column grouping and aggregation
  const { Story } = defineMeta({ title: 'Features/Grouping Examples (Advanced)' });

  const data = employees.slice(0, 60);

  const base: MRT_ColumnDef<Employee>[] = [
    { accessorKey: 'state', header: 'State' },
    { accessorKey: 'gender', header: 'Gender' },
    { accessorKey: 'firstName', header: 'First Name' },
    { accessorKey: 'lastName', header: 'Last Name' },
  ];

  const aggregated: MRT_ColumnDef<Employee>[] = [
    { accessorKey: 'state', header: 'State' },
    { accessorKey: 'firstName', header: 'First Name' },
    { accessorKey: 'age', aggregationFn: 'max', AggregatedCell: oldest, header: 'Oldest' },
    { accessorKey: 'salary', aggregationFn: 'sum', AggregatedCell: total, header: 'Total Salary' },
  ];
</script>

{#snippet oldest(ctx: { cell: MRT_Cell<Employee> })}
  Oldest: <strong>{ctx.cell.getValue()}</strong>
{/snippet}

{#snippet total(ctx: { cell: MRT_Cell<Employee> })}
  Total: <strong>${Number(ctx.cell.getValue()).toLocaleString()}</strong>
{/snippet}

{#snippet average(ctx: { cell: MRT_Cell<Employee> })}
  Average: <strong>{Math.round(Number(ctx.cell.getValue()))}</strong>
{/snippet}

{#snippet customGrouped(ctx: { cell: MRT_Cell<Employee>; row: MRT_Row<Employee> })}
  <span style="color: seagreen">▶ {ctx.cell.getValue()} ({ctx.row.subRows?.length ?? 0} people)</span>
{/snippet}

{#snippet customHeader(ctx: { header: MRT_Header<Employee> })}
  <i>Grouped by {ctx.header.column.columnDef.header}</i>
{/snippet}

<!-- aggregation -->
<Story name="Aggregation Expanded Default">
  <MaterialSvelteTable
    options={{
      columns: aggregated,
      data,
      enableGrouping: true,
      initialState: { expanded: true, grouping: ['state'] },
    }}
  />
</Story>

<Story name="Aggregation Remove Mode">
  <MaterialSvelteTable
    options={{
      columns: aggregated,
      data,
      enableGrouping: true,
      groupedColumnMode: 'remove',
      initialState: { expanded: true, grouping: ['state'] },
    }}
  />
</Story>

<Story name="Aggregation False Mode">
  <MaterialSvelteTable
    options={{
      columns: aggregated,
      data,
      enableGrouping: true,
      groupedColumnMode: false,
      initialState: { expanded: true, grouping: ['state'] },
    }}
  />
</Story>

<Story name="Aggregation Remove Mode Custom Grouped Cell">
  <MaterialSvelteTable
    options={{
      columns: aggregated,
      data,
      displayColumnDefOptions: { 'mrt-row-expand': { GroupedCell: customGrouped } },
      enableGrouping: true,
      groupedColumnMode: 'remove',
      initialState: { expanded: true, grouping: ['state'] },
    }}
  />
</Story>

<Story name="Aggregation Grouped And Expanded Default">
  <MaterialSvelteTable
    options={{
      columns: aggregated,
      data,
      enableGrouping: true,
      initialState: { expanded: true, grouping: ['state', 'firstName'] },
    }}
  />
</Story>

<!-- grouping -->
<Story name="Grouping Column Mode Remove Custom Header">
  <MaterialSvelteTable
    options={{
      columns: base,
      data,
      displayColumnDefOptions: { 'mrt-row-expand': { Header: customHeader } },
      enableGrouping: true,
      groupedColumnMode: 'remove',
      initialState: { grouping: ['state'] },
    }}
  />
</Story>

<Story name="Grouping Column Mode Remove Custom Grouped Cell">
  <MaterialSvelteTable
    options={{
      columns: base,
      data,
      displayColumnDefOptions: { 'mrt-row-expand': { GroupedCell: customGrouped } },
      enableGrouping: true,
      groupedColumnMode: 'remove',
      initialState: { grouping: ['state'] },
    }}
  />
</Story>

<Story name="Column Grouping Enabled With Selection Remove">
  <MaterialSvelteTable
    options={{
      columns: base,
      data,
      enableGrouping: true,
      enableRowSelection: true,
      groupedColumnMode: 'remove',
      initialState: { grouping: ['state'] },
    }}
  />
</Story>

<Story name="Column Grouping Enabled Custom Aggregate">
  <MaterialSvelteTable
    options={{
      columns: [
        { accessorKey: 'state', header: 'State' },
        { accessorKey: 'firstName', header: 'First Name' },
        { accessorKey: 'age', aggregationFn: 'mean', AggregatedCell: average, header: 'Average Age' },
      ],
      data,
      enableGrouping: true,
      initialState: { expanded: true, grouping: ['state'] },
    }}
  />
</Story>

<Story name="Column Grouping Drop Zone Always Visible">
  <MaterialSvelteTable
    options={{
      columns: base,
      data,
      enableGrouping: true,
      positionToolbarDropZone: 'top',
      state: { showToolbarDropZone: true },
    }}
  />
</Story>

<Story name="Grouping Columns Set State">
  <GroupingSetState />
</Story>

<Story name="Grouping And Dragging With Some Disabled Grouping">
  <MaterialSvelteTable
    options={{
      columns: [
        { accessorKey: 'state', header: 'State' },
        { accessorKey: 'gender', enableGrouping: false, header: 'Gender (cannot group)' },
        { accessorKey: 'firstName', header: 'First Name' },
        { accessorKey: 'lastName', header: 'Last Name' },
      ],
      data,
      enableColumnOrdering: true,
      enableGrouping: true,
    }}
  />
</Story>
