<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { ShadcnSvelteTable } from '../../src/lib';
  import { people, personColumns } from '../data';

  const { Story } = defineMeta({ title: 'Features/Search Examples' });

  const columns = personColumns;
</script>

<Story name="Search Enabled Default">
  <ShadcnSvelteTable options={{ columns, data: people }} />
</Story>

<Story name="Search Initial State">
  <ShadcnSvelteTable
    options={{
      columns,
      data: people,
      initialState: { globalFilter: 'Smith', showGlobalFilter: true },
    }}
  />
</Story>

<Story name="Search Contains">
  <ShadcnSvelteTable
    options={{ columns, data: people, globalFilterFn: 'contains' }}
  />
</Story>

<Story name="Custom Global Filter Fn">
  <ShadcnSvelteTable
    options={{
      columns,
      data: people,
      // only the first letter of any visible column has to match
      filterFns: {
        firstLetter: (row: any, columnId: string, value: string) =>
          String(row.getValue(columnId)).toLowerCase().startsWith(value.toLowerCase()),
      },
      globalFilterFn: 'firstLetter',
    }}
  />
</Story>

<Story name="Search Global Filter Modes">
  <ShadcnSvelteTable
    options={{ columns, data: people, enableGlobalFilterModes: true }}
  />
</Story>

<Story name="Search Global Filter Mode Options">
  <ShadcnSvelteTable
    options={{
      columns,
      data: people,
      enableGlobalFilterModes: true,
      globalFilterModeOptions: ['fuzzy', 'startsWith'],
    }}
  />
</Story>

<Story name="Search Ranked Results Enabled By Default">
  <ShadcnSvelteTable
    options={{ columns, data: people, initialState: { showGlobalFilter: true } }}
  />
</Story>

<Story name="Search Disable Ranked Results">
  <ShadcnSvelteTable
    options={{
      columns,
      data: people,
      enableGlobalFilterRankedResults: false,
      initialState: { showGlobalFilter: true },
    }}
  />
</Story>

<Story name="Show Search Right Box By Default">
  <ShadcnSvelteTable
    options={{ columns, data: people, initialState: { showGlobalFilter: true } }}
  />
</Story>

<Story name="Show Search Box Left By Default">
  <ShadcnSvelteTable
    options={{
      columns,
      data: people,
      initialState: { showGlobalFilter: true },
      positionGlobalFilter: 'left',
    }}
  />
</Story>

<Story name="Show Search Box Left By Default With Selection">
  <ShadcnSvelteTable
    options={{
      columns,
      data: people,
      enableRowSelection: true,
      initialState: { showGlobalFilter: true },
      positionGlobalFilter: 'left',
    }}
  />
</Story>

<Story name="Just A Search Box">
  <ShadcnSvelteTable
    options={{
      columns,
      data: people,
      enableBottomToolbar: false,
      enableColumnActions: false,
      enableColumnFilters: false,
      enablePagination: false,
      enableSorting: false,
      enableTableHead: false,
      initialState: { showGlobalFilter: true },
    }}
  />
</Story>

<Story name="Search Disabled">
  <ShadcnSvelteTable options={{ columns, data: people, enableGlobalFilter: false }} />
</Story>

<Story name="Customize Search Text Box">
  <ShadcnSvelteTable
    options={{
      columns,
      data: people,
      initialState: { showGlobalFilter: true },
      searchTextFieldProps: { placeholder: 'Search every column…' },
    }}
  />
</Story>
