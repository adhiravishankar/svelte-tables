<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { ShadcnSvelteTable } from '../../src/lib';
  import { makePeople, personColumns, people } from '../data';
  import PaginationStateManaged from './PaginationStateManaged.svelte';

  const { Story } = defineMeta({ title: 'Features/Pagination Examples' });

  const columns = personColumns;
  const moreData = makePeople(1000);
  const bigData = makePeople(10000);
</script>

<Story name="Pagination Enabled Default">
  <ShadcnSvelteTable options={{ columns, data: people }} />
</Story>

<Story name="Pagination Enabled Default More Data">
  <ShadcnSvelteTable options={{ columns, data: moreData }} />
</Story>

<Story name="Pagination Enabled Default Big Data">
  <ShadcnSvelteTable options={{ columns, data: bigData }} />
</Story>

<Story name="Pagination No Rows Per Page">
  <ShadcnSvelteTable
    options={{ columns, data: people, paginationProps: { showRowsPerPage: false } }}
  />
</Story>

<Story name="Pagination Customize Rows Per Page">
  <ShadcnSvelteTable
    options={{
      columns,
      data: moreData,
      initialState: { pagination: { pageIndex: 0, pageSize: 5 } },
      paginationProps: { rowsPerPageOptions: [5, 10, 100, 500] },
    }}
  />
</Story>

<Story name="Pagination Pages Display Mode">
  <ShadcnSvelteTable
    options={{ columns, data: moreData, paginationDisplayMode: 'pages' }}
  />
</Story>

<Story name="Pagination Pages Display Mode No Rows Per Page">
  <ShadcnSvelteTable
    options={{
      columns,
      data: moreData,
      paginationDisplayMode: 'pages',
      paginationProps: { showRowsPerPage: false },
    }}
  />
</Story>

<Story name="Pagination Disabled">
  <ShadcnSvelteTable options={{ columns, data: people, enablePagination: false }} />
</Story>

<Story name="Pagination Position Bottom">
  <ShadcnSvelteTable
    options={{ columns, data: people, positionPagination: 'bottom' }}
  />
</Story>

<Story name="Pagination Position Top">
  <ShadcnSvelteTable options={{ columns, data: people, positionPagination: 'top' }} />
</Story>

<Story name="Pagination Position Top And Bottom">
  <ShadcnSvelteTable options={{ columns, data: people, positionPagination: 'both' }} />
</Story>

<Story name="Pagination Position Top And Bottom No Internal Actions">
  <ShadcnSvelteTable
    options={{
      columns,
      data: people,
      enableToolbarInternalActions: false,
      positionPagination: 'both',
    }}
  />
</Story>

<Story name="Disabled Pagination Components">
  <ShadcnSvelteTable
    options={{ columns, data: people, paginationProps: { disabled: true } }}
  />
</Story>

<Story name="Pagination State Managed">
  <PaginationStateManaged />
</Story>
