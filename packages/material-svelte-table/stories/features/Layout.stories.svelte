<script module lang="ts">
  import Button, { Label } from '@smui/button';
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { MaterialSvelteTable, type MRT_TableInstance } from '../../src/lib';
  import { type Employee, employees, employeeColumns } from '../data';
  import ControlledFullScreen from './ControlledFullScreen.svelte';

  // Layout modes, toolbars, density and full screen
  const { Story } = defineMeta({ title: 'Features/Layout And Toolbar Examples' });

  const columns = employeeColumns;
  const data = employees.slice(0, 25);
</script>

{#snippet title()}
  <h3 style="margin: 0">Employees</h3>
{/snippet}

{#snippet topActions(ctx: { table: MRT_TableInstance<Employee> })}
  <div style="display: flex; gap: 0.5rem">
    <Button variant="raised"><Label>Create</Label></Button>
    <Button
      disabled={ctx.table.getSelectedRowModel().rows.length === 0}
      variant="outlined"
    >
      <Label>Delete selected ({ctx.table.getSelectedRowModel().rows.length})</Label>
    </Button>
  </div>
{/snippet}

{#snippet bottomActions()}
  <span>Rows are updated nightly</span>
{/snippet}

<!-- layout mode -->
<Story name="Default Semantic">
  <MaterialSvelteTable options={{ columns, data }} />
</Story>

<Story name="Grid">
  <MaterialSvelteTable options={{ columns, data, layoutMode: 'grid' }} />
</Story>

<Story name="Grid No Grow">
  <MaterialSvelteTable options={{ columns, data, layoutMode: 'grid-no-grow' }} />
</Story>

<Story name="Grid With Resizing">
  <MaterialSvelteTable
    options={{ columns, data, enableColumnResizing: true, layoutMode: 'grid' }}
  />
</Story>

<Story name="Grid No Grow With Resizing">
  <MaterialSvelteTable
    options={{ columns, data, enableColumnResizing: true, layoutMode: 'grid-no-grow' }}
  />
</Story>

<!-- toolbars -->
<Story name="Toolbar Enabled Default">
  <MaterialSvelteTable options={{ columns, data }} />
</Story>

<Story name="Top Toolbar Hidden">
  <MaterialSvelteTable options={{ columns, data, enableTopToolbar: false }} />
</Story>

<Story name="Bottom Toolbar Hidden">
  <MaterialSvelteTable options={{ columns, data, enableBottomToolbar: false }} />
</Story>

<Story name="No Toolbars">
  <MaterialSvelteTable
    options={{ columns, data, enableBottomToolbar: false, enableTopToolbar: false }}
  />
</Story>

<Story name="Hide Toolbar Internal Actions">
  <MaterialSvelteTable
    options={{ columns, data, enableToolbarInternalActions: false }}
  />
</Story>

<Story name="Table Title">
  <MaterialSvelteTable options={{ columns, data, topToolbarCustomActions: title }} />
</Story>

<Story name="Custom Top Toolbar Actions">
  <MaterialSvelteTable
    options={{ columns, data, enableRowSelection: true, topToolbarCustomActions: topActions }}
  />
</Story>

<Story name="Custom Bottom Toolbar Actions">
  <MaterialSvelteTable
    options={{ bottomToolbarCustomActions: bottomActions, columns, data }}
  />
</Story>

<Story name="Toolbar Alert Banner Bottom">
  <MaterialSvelteTable
    options={{
      columns,
      data,
      enableRowSelection: true,
      positionToolbarAlertBanner: 'bottom',
    }}
  />
</Story>

<!-- density / full screen -->
<Story name="Dense Padding Toggle Enabled Default">
  <MaterialSvelteTable options={{ columns, data }} />
</Story>

<Story name="Dense Padding Disabled">
  <MaterialSvelteTable options={{ columns, data, enableDensityToggle: false }} />
</Story>

<Story name="Default To Dense Padding">
  <MaterialSvelteTable
    options={{ columns, data, initialState: { density: 'compact' } }}
  />
</Story>

<Story name="Full Screen Toggle Enabled Default">
  <MaterialSvelteTable options={{ columns, data }} />
</Story>

<Story name="Disable Full Screen Toggle">
  <MaterialSvelteTable options={{ columns, data, enableFullScreenToggle: false }} />
</Story>

<Story name="Default Full Screen On">
  <MaterialSvelteTable
    options={{ columns, data, initialState: { isFullScreen: true } }}
  />
</Story>

<Story name="Controlled Full Screen">
  <ControlledFullScreen />
</Story>
