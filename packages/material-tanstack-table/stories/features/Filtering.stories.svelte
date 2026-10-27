<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import {
    MaterialSvelteTable,
    type MRT_Column,
    type MRT_ColumnDef,
  } from '../../src/lib';
  import { type Employee, employees, employeeColumns, states } from '../data';
  import ExternalFilterValue from './ExternalFilterValue.svelte';
  import ManualFiltering from './ManualFiltering.svelte';

  const { Story } = defineMeta({ title: 'Features/Filtering Examples' });

  const columns = employeeColumns;

  /** One column per filter variant. */
  const variantColumns: MRT_ColumnDef<Employee>[] = [
    { accessorKey: 'firstName', header: 'First Name' },
    { accessorKey: 'state', filterSelectOptions: states, filterVariant: 'select', header: 'State (select)' },
    {
      accessorKey: 'gender',
      filterSelectOptions: ['Male', 'Female'],
      filterVariant: 'multi-select',
      header: 'Gender (multi-select)',
    },
    { accessorKey: 'age', filterVariant: 'range', header: 'Age (range)' },
    { accessorKey: 'salary', filterVariant: 'range-slider', header: 'Salary (slider)' },
    {
      accessorFn: (row) => String(row.isActive),
      filterVariant: 'checkbox',
      header: 'Active (checkbox)',
      id: 'isActive',
    },
    {
      accessorFn: (row) => row.birthDate,
      Cell: dateCell,
      filterVariant: 'date-range',
      header: 'Birth Date (date range)',
      id: 'birthDate',
    },
    { accessorKey: 'city', filterVariant: 'autocomplete', header: 'City (autocomplete)' },
  ];
</script>

{#snippet dateCell(ctx: { renderedCellValue: unknown })}
  {(ctx.renderedCellValue as Date).toLocaleDateString()}
{/snippet}

<Story name="Filtering Enabled Default">
  <MaterialSvelteTable options={{ columns, data: employees }} />
</Story>

<Story name="Popover Display Mode">
  <MaterialSvelteTable
    options={{ columnFilterDisplayMode: 'popover', columns, data: employees }}
  />
</Story>

<Story name="Popover Display Mode No Sorting">
  <MaterialSvelteTable
    options={{
      columnFilterDisplayMode: 'popover',
      columns,
      data: employees,
      enableSorting: false,
    }}
  />
</Story>

<Story name="Column Filtering Disabled">
  <MaterialSvelteTable
    options={{ columns, data: employees, enableColumnFilters: false }}
  />
</Story>

<Story name="Filtering Disabled">
  <MaterialSvelteTable options={{ columns, data: employees, enableFilters: false }} />
</Story>

<Story name="Filter Highlighting Disabled">
  <MaterialSvelteTable
    options={{
      columns,
      data: employees,
      enableFilterMatchHighlighting: false,
      initialState: { showColumnFilters: true },
    }}
  />
</Story>

<Story name="Filter Fn And Filter Variants">
  <MaterialSvelteTable
    options={{
      columns: variantColumns,
      data: employees,
      initialState: { showColumnFilters: true },
    }}
  />
</Story>

<Story name="Filter Fn And Filter Variants Faceted">
  <MaterialSvelteTable
    options={{
      columns: [
        { accessorKey: 'firstName', header: 'First Name' },
        { accessorKey: 'state', filterVariant: 'select', header: 'State (select)' },
        { accessorKey: 'gender', filterVariant: 'multi-select', header: 'Gender (multi-select)' },
        { accessorKey: 'age', filterVariant: 'range-slider', header: 'Age (slider)' },
      ],
      data: employees,
      enableFacetedValues: true,
      initialState: { showColumnFilters: true },
    }}
  />
</Story>

<Story name="Filtering Change Mode Enabled">
  <MaterialSvelteTable
    options={{
      columns: variantColumns,
      data: employees,
      enableColumnFilterModes: true,
      initialState: { showColumnFilters: true },
    }}
  />
</Story>

<Story name="Disable Some Filter Types For Certain Columns">
  <MaterialSvelteTable
    options={{
      columns: [
        {
          accessorKey: 'firstName',
          columnFilterModeOptions: ['fuzzy', 'contains', 'startsWith'],
          header: 'First Name (fuzzy, contains, startsWith)',
        },
        {
          accessorKey: 'lastName',
          columnFilterModeOptions: ['equals', 'notEquals'],
          header: 'Last Name (equals, notEquals)',
        },
        { accessorKey: 'age', enableColumnFilterModes: false, header: 'Age (no modes)' },
      ],
      data: employees,
      enableColumnFilterModes: true,
      initialState: { showColumnFilters: true },
    }}
  />
</Story>

<Story name="Filtering Disabled For Certain Columns">
  <MaterialSvelteTable
    options={{
      columns: [
        { accessorKey: 'firstName', header: 'First Name' },
        { accessorKey: 'lastName', enableColumnFilter: false, header: 'Last Name' },
        { accessorKey: 'state', header: 'State' },
        { accessorKey: 'age', enableColumnFilter: false, header: 'Age' },
      ],
      data: employees,
      initialState: { showColumnFilters: true },
    }}
  />
</Story>

<Story name="Custom Filter Function Per Column">
  <MaterialSvelteTable
    options={{
      columns: [
        {
          accessorKey: 'firstName',
          // keeps only names that START with the filter text
          filterFn: (row, columnId, filterValue) =>
            String(row.getValue(columnId)).toLowerCase().startsWith(String(filterValue).toLowerCase()),
          header: 'First Name (starts with)',
        },
        { accessorKey: 'lastName', header: 'Last Name' },
      ],
      data: employees,
      initialState: { showColumnFilters: true },
    }}
  />
</Story>

<Story name="Custom Filter Fns">
  <MaterialSvelteTable
    options={{
      columns: [
        { accessorKey: 'firstName', filterFn: 'startsWithLetter', header: 'First Name (letter)' },
        { accessorKey: 'lastName', header: 'Last Name' },
      ],
      data: employees,
      // registered once, when the table is created
      filterFns: {
        startsWithLetter: (row: any, columnId: string, value: string) =>
          String(row.getValue(columnId)).toLowerCase().startsWith(value.toLowerCase()),
      },
      initialState: { showColumnFilters: true },
    }}
  />
</Story>

{#snippet ageFilter(ctx: { column: MRT_Column<Employee> })}
  <label style="display: flex; align-items: center; gap: 0.5rem; font-weight: normal">
    Min age
    <input
      max="70"
      min="21"
      oninput={(e) => ctx.column.setFilterValue(+e.currentTarget.value || undefined)}
      type="number"
      value={(ctx.column.getFilterValue() as number) ?? ''}
    />
  </label>
{/snippet}

<Story name="Custom Filter Component">
  <MaterialSvelteTable
    options={{
      columns: [
        { accessorKey: 'firstName', header: 'First Name' },
        // the built-in input is replaced by this snippet
        { accessorKey: 'age', filterFn: 'greaterThanOrEqualTo', Filter: ageFilter, header: 'Age' },
      ],
      data: employees,
      initialState: { showColumnFilters: true },
    }}
  />
</Story>

<Story name="Customize Filter Text Fields">
  <MaterialSvelteTable
    options={{
      columns: [
        { accessorKey: 'firstName', filterTextFieldProps: { input$placeholder: 'Type a first name…' }, header: 'First Name' },
        { accessorKey: 'age', filterTextFieldProps: { type: 'number' }, filterVariant: 'range', header: 'Age' },
      ],
      data: employees,
      initialState: { showColumnFilters: true },
    }}
  />
</Story>

<Story name="Manual Filtering">
  <ManualFiltering />
</Story>

<Story name="External Set Filter Value">
  <ExternalFilterValue />
</Story>

<Story name="Initial Filters">
  <MaterialSvelteTable
    options={{
      columns,
      data: employees,
      initialState: {
        columnFilters: [{ id: 'state', value: 'Ohio' }],
        showColumnFilters: true,
      },
    }}
  />
</Story>
