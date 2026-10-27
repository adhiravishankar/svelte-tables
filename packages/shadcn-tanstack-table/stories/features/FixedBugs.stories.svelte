<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import {
    ShadcnSvelteTable,
    type MRT_Row,
    type MRT_TableInstance,
    MRT_ActionMenuItem,
  } from '../../src/lib';
  import { type Employee, employees, employeeColumns } from '../data';
  import AsyncOptions from './AsyncOptions.svelte';

  // Scenarios for bugs that were fixed in the React version. Each one should simply work.
  const { Story } = defineMeta({ title: 'Fixed Bugs' });

  const columns = employeeColumns;
  const data = employees.slice(0, 30);
  const loadingNested = { state: { isLoading: true } } as const;
  const log = (what: string, row: MRT_Row<Employee>) => console.info(what, row.original.firstName);
</script>

{#snippet rowMenu(ctx: { closeMenu: () => void; row: MRT_Row<Employee>; table: MRT_TableInstance<Employee> })}
  <MRT_ActionMenuItem
    label="Menu action"
    onclick={() => {
      log('menu action (row click should NOT fire)', ctx.row);
      ctx.closeMenu();
    }}
    table={ctx.table}
  />
{/snippet}

{#snippet rowButtons(ctx: { row: MRT_Row<Employee> })}
  <button
    onclick={(event) => {
      event.stopPropagation();
      log('button action (row click should NOT fire)', ctx.row);
    }}
  >
    Action
  </button>
{/snippet}

{#snippet nullable(ctx: { cell: { getValue: () => unknown } })}
  {ctx.cell.getValue() ?? '—'}
{/snippet}

<!-- click propagation -->
<Story name="Row Click And Row Menu Actions">
  <ShadcnSvelteTable
    options={{
      columns,
      data,
      enableRowActions: true,
      rowActionMenuItems: rowMenu,
      tableBodyRowProps: ({ row }) => ({
        onclick: () => log('row click', row),
        style: 'cursor: pointer',
      }),
    }}
  />
</Story>

<Story name="Row Click And Row Button Actions">
  <ShadcnSvelteTable
    options={{
      columns,
      data,
      enableRowActions: true,
      rowActions: rowButtons,
      tableBodyRowProps: ({ row }) => ({
        onclick: () => log('row click', row),
        style: 'cursor: pointer',
      }),
    }}
  />
</Story>

<!-- data types -->
<Story name="Null Column">
  <ShadcnSvelteTable
    options={{
      columns: [
        { accessorKey: 'firstName', header: 'First Name' },
        { accessorFn: () => null, Cell: nullable, header: 'Always Null', id: 'nothing' },
        { accessorFn: (row) => (row.age > 50 ? null : row.age), Cell: nullable, header: 'Age (null over 50)', id: 'ageOrNull' },
      ],
      data,
      initialState: { showColumnFilters: true },
    }}
  />
</Story>

<!-- dragging -->
<Story name="Dragging Row When Filtered">
  <ShadcnSvelteTable
    options={{
      columns,
      data: employees,
      enableRowOrdering: true,
      enableRowVirtualization: true,
      initialState: { columnFilters: [{ id: 'gender', value: 'Female' }], showColumnFilters: true },
      tableContainerProps: { style: 'max-height: 400px' },
    }}
  />
</Story>

<!-- full screen -->
<Story name="Fullscreen Is Above Appbar">
  <div style="position: relative">
    <header
      style="position: sticky; top: 0; z-index: 1100; padding: 1rem; background: #1976d2; color: white"
    >
      Fixed app bar — full screen must cover this
    </header>
    <ShadcnSvelteTable options={{ columns, data }} />
  </div>
</Story>

<!-- grid alignment -->
<Story name="Center Align In Grid Layout Mode">
  <ShadcnSvelteTable
    options={{
      columns: columns.map((c) => ({
        ...c,
        tableBodyCellProps: { style: 'justify-content: center; text-align: center' },
        tableHeadCellProps: { style: 'justify-content: center; text-align: center' },
      })),
      data,
      layoutMode: 'grid',
    }}
  />
</Story>

<Story name="Right Align In Grid Layout Mode">
  <ShadcnSvelteTable
    options={{
      columns: columns.map((c) => ({
        ...c,
        tableBodyCellProps: { style: 'justify-content: flex-end; text-align: right' },
        tableHeadCellProps: { style: 'justify-content: flex-end; text-align: right' },
      })),
      data,
      layoutMode: 'grid',
    }}
  />
</Story>

<!-- loading with initial state -->
<Story name="Nested Loading Data With Initial Expanded">
  <ShadcnSvelteTable
    options={{ columns, data: [], ...loadingNested, initialState: { expanded: true } }}
  />
</Story>

<Story name="Nested Loading Data With Initial Filter">
  <ShadcnSvelteTable
    options={{
      columns,
      data: [],
      ...loadingNested,
      initialState: { columnFilters: [{ id: 'firstName', value: 'a' }], showColumnFilters: true },
    }}
  />
</Story>

<Story name="Nested Loading Data With Initial Group">
  <ShadcnSvelteTable
    options={{
      columns,
      data: [],
      enableGrouping: true,
      ...loadingNested,
      initialState: { grouping: ['gender'] },
    }}
  />
</Story>

<Story name="Nested Loading Data With Initial Page">
  <ShadcnSvelteTable
    options={{
      columns,
      data: [],
      ...loadingNested,
      initialState: { pagination: { pageIndex: 2, pageSize: 5 } },
    }}
  />
</Story>

<Story name="Nested Loading Data With Initial Sort">
  <ShadcnSvelteTable
    options={{
      columns,
      data: [],
      ...loadingNested,
      initialState: { sorting: [{ desc: true, id: 'age' }] },
    }}
  />
</Story>

<Story name="Accessor Key While Loading">
  <ShadcnSvelteTable
    options={{
      columns: [
        { accessorKey: 'name.first', header: 'First' },
        { accessorKey: 'name.last', header: 'Last' },
      ],
      data: [],
      state: { isLoading: true },
    }}
  />
</Story>

<!-- sticky footer -->
<Story name="Pinned Columns With Sticky Footer">
  <ShadcnSvelteTable
    options={{
      columns: columns.map((c) => ({ ...c, footer: c.header, size: 220 })),
      data: employees,
      enableColumnPinning: true,
      enableStickyFooter: true,
      initialState: { columnPinning: { end: ['salary'], start: ['firstName'] } },
      tableContainerProps: { style: 'max-height: 400px; max-width: 600px' },
    }}
  />
</Story>

<!-- options arriving late -->
<Story name="Filter Modes Refetch">
  <AsyncOptions mode="filterModes" />
</Story>

<Story name="Filter Options Async">
  <AsyncOptions mode="filterOptions" />
</Story>

<Story name="Edit Options Async">
  <AsyncOptions mode="editOptions" />
</Story>

<Story name="Row Actions Async">
  <AsyncOptions mode="rowActions" />
</Story>

<Story name="Row Action Menu Items Async">
  <AsyncOptions mode="rowActionMenu" />
</Story>

<Story name="Delayed Faceted Values">
  <AsyncOptions mode="delayedFacets" />
</Story>

<Story name="Prevent Unnecessary Pagination Change By Out Of Bounds Check">
  <AsyncOptions mode="outOfBounds" />
</Story>
