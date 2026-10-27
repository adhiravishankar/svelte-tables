<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { ShadcnSvelteTable, type MRT_ColumnDef } from '../../src/lib';
  import { type Person, people } from '../data';
  import SortingStateManaged from './SortingStateManaged.svelte';

  const { Story } = defineMeta({
    title: 'Features/Sorting Examples',
  });

  const columns: MRT_ColumnDef<Person>[] = [
    { accessorKey: 'firstName', header: 'First Name' },
    { accessorKey: 'lastName', header: 'Last Name' },
    { accessorKey: 'address', header: 'Address' },
    { accessorKey: 'state', header: 'State' },
    { accessorKey: 'phoneNumber', header: 'Phone Number' },
  ];
</script>

<Story name="Sorting Enabled Default">
  <ShadcnSvelteTable options={{ columns, data: people }} />
</Story>

<Story name="Disable Sorting">
  <ShadcnSvelteTable options={{ columns, data: people, enableSorting: false }} />
</Story>

<Story name="Disable Sorting For Specific Columns">
  <ShadcnSvelteTable
    options={{
      columns: [
        { accessorKey: 'firstName', header: 'First Name' },
        { accessorKey: 'lastName', header: 'Last Name' },
        { accessorKey: 'address', enableSorting: false, header: 'Address' },
        { accessorKey: 'state', header: 'State' },
        { accessorKey: 'phoneNumber', enableSorting: false, header: 'Phone Number' },
      ],
      data: people,
    }}
  />
</Story>

<Story name="Disable Multi Sorting">
  <ShadcnSvelteTable options={{ columns, data: people, enableMultiSort: false }} />
</Story>

<Story name="Disable Sorting Removal">
  <ShadcnSvelteTable
    options={{ columns, data: people, enableSortingRemoval: false }}
  />
</Story>

<Story name="Sort Ranking">
  <ShadcnSvelteTable
    options={{
      columns: [{ ...columns[0], sortFn: 'fuzzy' }, ...columns.slice(1)],
      data: people,
      enableRowNumbers: true,
      initialState: { sorting: [{ desc: false, id: 'firstName' }] },
    }}
  />
</Story>

<Story name="Sorting State Managed">
  <SortingStateManaged {columns} data={people} />
</Story>
