<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { ShadcnSvelteTable, type MRT_ColumnDef } from '../../src/lib';
  import { type Employee, employees } from '../data';
  import GroupingStateManaged from './GroupingStateManaged.svelte';

  // Column grouping and aggregation
  const { Story } = defineMeta({ title: 'Features/Grouping Examples' });

  const columns: MRT_ColumnDef<Employee>[] = [
    { accessorKey: 'state', header: 'State' },
    { accessorKey: 'gender', header: 'Gender' },
    { accessorKey: 'firstName', header: 'First Name' },
    { accessorKey: 'lastName', header: 'Last Name' },
  ];

  const aggregated: MRT_ColumnDef<Employee>[] = [
    { accessorKey: 'state', header: 'State' },
    { accessorKey: 'gender', header: 'Gender' },
    { accessorKey: 'firstName', header: 'First Name' },
    {
      accessorKey: 'age',
      aggregationFn: 'max',
      AggregatedCell: maxAge,
      header: 'Oldest',
    },
    {
      accessorKey: 'salary',
      aggregationFn: 'sum',
      AggregatedCell: totalSalary,
      header: 'Total Salary',
    },
  ];
</script>

{#snippet maxAge(ctx: { cell: { getValue: () => unknown } })}
  Oldest: <strong>{ctx.cell.getValue()}</strong>
{/snippet}

{#snippet totalSalary(ctx: { cell: { getValue: () => unknown } })}
  Total: <strong>${Number(ctx.cell.getValue()).toLocaleString()}</strong>
{/snippet}

<Story name="Column Grouping Enabled">
  <ShadcnSvelteTable options={{ columns, data: employees, enableGrouping: true }} />
</Story>

<Story name="Column Grouping Enabled Reorder">
  <ShadcnSvelteTable
    options={{
      columns,
      data: employees,
      enableGrouping: true,
      groupedColumnMode: 'reorder',
      initialState: { grouping: ['state'] },
    }}
  />
</Story>

<Story name="Grouping Column Mode Remove">
  <ShadcnSvelteTable
    options={{
      columns,
      data: employees,
      enableGrouping: true,
      groupedColumnMode: 'remove',
      initialState: { grouping: ['state'] },
    }}
  />
</Story>

<Story name="Grouping Column Mode False">
  <ShadcnSvelteTable
    options={{
      columns,
      data: employees,
      enableGrouping: true,
      groupedColumnMode: false,
      initialState: { grouping: ['state'] },
    }}
  />
</Story>

<Story name="Grouping Column Mode Remove Paginate Pre Expand">
  <ShadcnSvelteTable
    options={{
      columns,
      data: employees,
      enableGrouping: true,
      groupedColumnMode: 'remove',
      initialState: { expanded: true, grouping: ['state'] },
      paginateExpandedRows: false,
    }}
  />
</Story>

<Story name="Column Grouping Enabled With Selection">
  <ShadcnSvelteTable
    options={{ columns, data: employees, enableGrouping: true, enableRowSelection: true }}
  />
</Story>

<Story name="Column Grouping No Drag Handles">
  <ShadcnSvelteTable
    options={{
      columns,
      data: employees,
      enableColumnDragging: false,
      enableGrouping: true,
    }}
  />
</Story>

<Story name="Column Grouping Enabled Drop Zone Bottom">
  <ShadcnSvelteTable
    options={{
      columns,
      data: employees,
      enableGrouping: true,
      positionToolbarDropZone: 'bottom',
    }}
  />
</Story>

<Story name="Column Grouping Banner On Bottom">
  <ShadcnSvelteTable
    options={{
      columns,
      data: employees,
      enableGrouping: true,
      initialState: { grouping: ['state'] },
      positionToolbarAlertBanner: 'bottom',
    }}
  />
</Story>

<Story name="Grouping State Managed">
  <GroupingStateManaged />
</Story>

<Story name="Aggregation">
  <ShadcnSvelteTable
    options={{
      columns: aggregated,
      data: employees,
      enableGrouping: true,
      initialState: { expanded: true, grouping: ['state'] },
    }}
  />
</Story>

<Story name="Aggregation With Selection">
  <ShadcnSvelteTable
    options={{
      columns: aggregated,
      data: employees,
      enableGrouping: true,
      enableRowSelection: true,
      initialState: { grouping: ['state'] },
    }}
  />
</Story>

<Story name="Multi Aggregation Per Column">
  <ShadcnSvelteTable
    options={{
      columns: [
        { accessorKey: 'state', header: 'State' },
        { accessorKey: 'firstName', header: 'First Name' },
        {
          accessorKey: 'salary',
          // every entry is computed; the cell receives an object keyed by id
          aggregationFn: [
            { aggregationFn: 'min', id: 'min' },
            { aggregationFn: 'max', id: 'max' },
          ],
          AggregatedCell: salaryRange,
          header: 'Salary range',
        },
      ],
      data: employees,
      enableGrouping: true,
      initialState: { expanded: true, grouping: ['state'] },
    }}
  />
</Story>

{#snippet salaryRange(ctx: { cell: { getValue: () => unknown } })}
  {@const range = ctx.cell.getValue() as { max?: number; min?: number } | undefined}
  ${range?.min?.toLocaleString()} – ${range?.max?.toLocaleString()}
{/snippet}
