<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { MaterialSvelteTable } from '../../src/lib';
  import { people, personColumns } from '../data';

  const { Story } = defineMeta({ title: 'Features/Column Resizing Examples' });

  const columns = personColumns;
  const resizing = { columns, data: people, enableColumnResizing: true } as const;
</script>

<Story name="Column Resizing Enabled Default On Change">
  <MaterialSvelteTable options={resizing} />
</Story>

<Story name="Column Resizing Enabled Default On Change RTL">
  <div dir="rtl">
    <MaterialSvelteTable options={{ ...resizing, columnResizeDirection: 'rtl' }} />
  </div>
</Story>

<Story name="Column Resizing Enabled Default On Change Grid">
  <MaterialSvelteTable options={{ ...resizing, layoutMode: 'grid' }} />
</Story>

<Story name="Column Resizing Enabled Default On Change Semantic">
  <MaterialSvelteTable options={{ ...resizing, layoutMode: 'semantic' }} />
</Story>

<Story name="Column Resizing Enabled No Column Actions">
  <MaterialSvelteTable options={{ ...resizing, enableColumnActions: false }} />
</Story>

<Story name="Column Resizing Disabled Some Columns">
  <MaterialSvelteTable
    options={{
      ...resizing,
      columns: [
        { accessorKey: 'firstName', header: 'First Name' },
        { accessorKey: 'lastName', enableResizing: false, header: 'Last Name (fixed)' },
        { accessorKey: 'state', header: 'State' },
        { accessorKey: 'phoneNumber', header: 'Phone Number' },
      ],
    }}
  />
</Story>

<Story name="Column Resizing Enabled On End">
  <MaterialSvelteTable options={{ ...resizing, columnResizeMode: 'onEnd' }} />
</Story>

<Story name="Column Resizing Enabled On End RTL">
  <div dir="rtl">
    <MaterialSvelteTable
      options={{ ...resizing, columnResizeDirection: 'rtl', columnResizeMode: 'onEnd' }}
    />
  </div>
</Story>

<Story name="Column Resizing Custom Default Widths">
  <MaterialSvelteTable
    options={{
      ...resizing,
      columns: [
        { accessorKey: 'firstName', header: 'First Name', size: 100 },
        { accessorKey: 'lastName', header: 'Last Name', size: 300 },
        { accessorKey: 'state', header: 'State', size: 200 },
        { accessorKey: 'phoneNumber', header: 'Phone Number', maxSize: 400, minSize: 150, size: 250 },
      ],
    }}
  />
</Story>

<Story name="Column Resizing With Pinning">
  <MaterialSvelteTable
    options={{
      ...resizing,
      enableColumnPinning: true,
      initialState: { columnPinning: { end: [], start: ['firstName'] } },
    }}
  />
</Story>

<Story name="Column Resizing With Header Groups">
  <MaterialSvelteTable
    options={{
      ...resizing,
      columns: [
        {
          columns: [
            { accessorKey: 'firstName', header: 'First Name' },
            { accessorKey: 'lastName', header: 'Last Name' },
          ],
          header: 'Name',
        },
        {
          columns: [
            { accessorKey: 'address', header: 'Address' },
            { accessorKey: 'state', header: 'State' },
          ],
          header: 'Location',
        },
      ],
    }}
  />
</Story>

<Story name="Column Resizing Layout Grid Grow">
  <MaterialSvelteTable options={{ ...resizing, layoutMode: 'grid' }} />
</Story>
