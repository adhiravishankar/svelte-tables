<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { MaterialSvelteTable } from '../../src/lib';
  import { employees, personColumns, people } from '../data';
  import ManualSelection from './ManualSelection.svelte';

  const { Story } = defineMeta({ title: 'Features/Selection Examples' });

  const columns = personColumns;
</script>

<Story name="Selection Enabled">
  <MaterialSvelteTable options={{ columns, data: people, enableRowSelection: true }} />
</Story>

<Story name="Disable Select All">
  <MaterialSvelteTable
    options={{ columns, data: people, enableRowSelection: true, enableSelectAll: false }}
  />
</Story>

<Story name="Selection Enabled Grid">
  <MaterialSvelteTable
    options={{ columns, data: people, enableRowSelection: true, layoutMode: 'grid' }}
  />
</Story>

<Story name="Selection Enabled Grid No Grow">
  <MaterialSvelteTable
    options={{ columns, data: people, enableRowSelection: true, layoutMode: 'grid-no-grow' }}
  />
</Story>

<Story name="Batch Selection Disabled">
  <MaterialSvelteTable
    options={{
      columns,
      data: people,
      enableBatchRowSelection: false,
      enableRowSelection: true,
    }}
  />
</Story>

<Story name="Selection Enabled Conditionally">
  <MaterialSvelteTable
    options={{
      columns: [...columns, { accessorKey: 'gender', header: 'Gender' }],
      data: employees,
      // only women can be selected
      enableRowSelection: (row) => row.original.gender === 'Female',
    }}
  />
</Story>

<Story name="Selection Enabled Conditionally With Initial">
  <MaterialSvelteTable
    options={{
      columns: [...columns, { accessorKey: 'gender', header: 'Gender' }],
      data: employees,
      enableRowSelection: (row) => row.original.gender === 'Female',
      initialState: { rowSelection: { '0': true, '1': true } },
    }}
  />
</Story>

<Story name="Selection Enabled With Row Click">
  <MaterialSvelteTable
    options={{
      columns,
      data: people,
      enableRowSelection: true,
      tableBodyRowProps: ({ row, table }) => ({
        onclick: () => row.toggleSelected(),
        style: 'cursor: pointer',
      }),
    }}
  />
</Story>

<Story name="Manual Selection">
  <ManualSelection />
</Story>

<Story name="Select All Mode All">
  <MaterialSvelteTable
    options={{ columns, data: people, enableRowSelection: true, selectAllMode: 'all' }}
  />
</Story>

<Story name="Select All Mode Page">
  <MaterialSvelteTable
    options={{ columns, data: people, enableRowSelection: true, selectAllMode: 'page' }}
  />
</Story>

<Story name="Single Selection Radio">
  <MaterialSvelteTable
    options={{
      columns,
      data: people,
      enableMultiRowSelection: false,
      enableRowSelection: true,
    }}
  />
</Story>

<Story name="Single Selection Radio With Row Click">
  <MaterialSvelteTable
    options={{
      columns,
      data: people,
      enableMultiRowSelection: false,
      enableRowSelection: true,
      tableBodyRowProps: ({ row }) => ({
        onclick: () => row.toggleSelected(),
        style: 'cursor: pointer',
      }),
    }}
  />
</Story>

<Story name="Alert Banner Bottom">
  <MaterialSvelteTable
    options={{
      columns,
      data: people,
      enableRowSelection: true,
      positionToolbarAlertBanner: 'bottom',
    }}
  />
</Story>

<Story name="Alert Banner Head Overlay">
  <MaterialSvelteTable
    options={{
      columns,
      data: people,
      enableRowSelection: true,
      positionToolbarAlertBanner: 'head-overlay',
    }}
  />
</Story>

<Story name="Multi Select Row With Hold Shift">
  <MaterialSvelteTable
    options={{ columns, data: people, enableRowSelection: true }}
  />
</Story>
