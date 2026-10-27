<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { MaterialSvelteTable } from '../../src/lib';
  import { employees, employeeColumns } from '../data';
  import Reloading from './Reloading.svelte';

  const { Story } = defineMeta({ title: 'Features/Loading Examples' });

  const columns = employeeColumns;
  const data = employees.slice(0, 20);
</script>

<Story name="Loading">
  <MaterialSvelteTable options={{ columns, data: [], state: { isLoading: true } }} />
</Story>

<Story name="Loading With Some Data">
  <MaterialSvelteTable options={{ columns, data, state: { isLoading: true } }} />
</Story>

<Story name="Loading With Progress Bars">
  <MaterialSvelteTable
    options={{ columns, data, state: { showProgressBars: true } }}
  />
</Story>

<Story name="Loading With Progress Bars No Overlay">
  <MaterialSvelteTable
    options={{
      columns,
      data,
      state: { showLoadingOverlay: false, showProgressBars: true },
    }}
  />
</Story>

<Story name="Loading With Selection">
  <MaterialSvelteTable
    options={{ columns, data, enableRowSelection: true, state: { isLoading: true } }}
  />
</Story>

<Story name="Skeleton Display Columns">
  <MaterialSvelteTable
    options={{
      columns,
      data: [],
      enableRowNumbers: true,
      enableRowSelection: true,
      state: { showSkeletons: true },
    }}
  />
</Story>

<Story name="Only Top Progress Bar">
  <MaterialSvelteTable
    options={{
      columns,
      data,
      enableBottomToolbar: false,
      state: { showProgressBars: true },
    }}
  />
</Story>

<Story name="Reloading Example">
  <Reloading />
</Story>
