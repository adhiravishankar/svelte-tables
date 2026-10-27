<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { MaterialSvelteTable, type MRT_ColumnDef } from '../../src/lib';
  import { type Person, people } from '../data';

  const { Story } = defineMeta({ title: 'Features/Header Group Examples' });

  const grouped: MRT_ColumnDef<Person>[] = [
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
        { accessorKey: 'phoneNumber', header: 'Phone Number' },
      ],
      header: 'Contact',
    },
  ];

  const withFooters: MRT_ColumnDef<Person>[] = [
    {
      columns: [
        { accessorKey: 'firstName', footer: 'First', header: 'First Name' },
        { accessorKey: 'lastName', footer: 'Last', header: 'Last Name' },
      ],
      footer: 'Name',
      header: 'Name',
    },
    {
      columns: [
        { accessorKey: 'address', footer: 'Address', header: 'Address' },
        { accessorKey: 'state', footer: 'State', header: 'State' },
      ],
      footer: 'Location',
      header: 'Location',
    },
  ];

  const deep: MRT_ColumnDef<Person>[] = [
    { accessorKey: 'firstName', header: 'First Name' },
    {
      columns: [
        {
          columns: [
            { accessorKey: 'address', header: 'Address' },
            { accessorKey: 'state', header: 'State' },
          ],
          header: 'Home',
        },
        { accessorKey: 'phoneNumber', header: 'Phone Number' },
      ],
      header: 'Contact',
    },
  ];
</script>

<Story name="Header Groups">
  <MaterialSvelteTable options={{ columns: grouped, data: people }} />
</Story>

<Story name="Header Groups With Sticky Header">
  <MaterialSvelteTable
    options={{ columns: grouped, data: people, enableStickyHeader: true }}
  />
</Story>

<Story name="Header And Footer Groups">
  <MaterialSvelteTable options={{ columns: withFooters, data: people }} />
</Story>

<Story name="Header Groups With Column Pinning">
  <MaterialSvelteTable
    options={{
      columns: grouped,
      data: people,
      enableColumnPinning: true,
    }}
  />
</Story>

<Story name="Header Groups With Column Resizing">
  <MaterialSvelteTable
    options={{ columns: grouped, data: people, enableColumnResizing: true }}
  />
</Story>

<Story name="Mixed Header Groups">
  <MaterialSvelteTable
    options={{
      columns: [
        { accessorKey: 'firstName', header: 'First Name' },
        ...grouped.slice(1),
      ],
      data: people,
    }}
  />
</Story>

<Story name="Deep Mixed Header Groups">
  <MaterialSvelteTable options={{ columns: deep, data: people }} />
</Story>

<Story name="Header Groups With Row Virtualization">
  <MaterialSvelteTable
    options={{
      columns: grouped,
      data: people,
      enablePagination: false,
      enableRowVirtualization: true,
    }}
  />
</Story>
