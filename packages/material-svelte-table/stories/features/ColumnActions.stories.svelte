<script module lang="ts">
  import { Separator } from '@smui/list';
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { MRT_ActionMenuItem, MaterialSvelteTable, type MRT_Column, type MRT_TableInstance } from '../../src/lib';
  import { type Person, people, personColumns } from '../data';

  const { Story } = defineMeta({ title: 'Features/Column Actions Examples' });

  const columns = personColumns;
</script>

{#snippet logItem(ctx: {
  closeMenu: () => void;
  column: MRT_Column<Person>;
  table: MRT_TableInstance<Person>;
})}
  <MRT_ActionMenuItem
    label={`Log ${ctx.column.columnDef.header}`}
    onclick={() => {
      console.info('column', ctx.column.id);
      ctx.closeMenu();
    }}
    table={ctx.table}
  />
{/snippet}

{#snippet withBuiltIns(ctx: {
  closeMenu: () => void;
  column: MRT_Column<Person>;
  internalColumnMenuItems: import('svelte').Snippet[];
  table: MRT_TableInstance<Person>;
})}
  {#each ctx.internalColumnMenuItems as item}
    {@render item()}
  {/each}
  <Separator />
  {@render logItem(ctx)}
{/snippet}

<Story name="Column Actions Enabled Default">
  <MaterialSvelteTable options={{ columns, data: people }} />
</Story>

<Story name="Column Actions Disabled">
  <MaterialSvelteTable options={{ columns, data: people, enableColumnActions: false }} />
</Story>

<Story name="Column Actions Disabled Per Column">
  <MaterialSvelteTable
    options={{
      columns: [
        { accessorKey: 'firstName', header: 'First Name' },
        { accessorKey: 'lastName', enableColumnActions: false, header: 'Last Name' },
        { accessorKey: 'state', header: 'State' },
      ],
      data: people,
    }}
  />
</Story>

<Story name="Column Actions Enabled Per Column">
  <MaterialSvelteTable
    options={{
      columns: [
        { accessorKey: 'firstName', enableColumnActions: true, header: 'First Name' },
        { accessorKey: 'lastName', header: 'Last Name' },
        { accessorKey: 'state', enableColumnActions: true, header: 'State' },
      ],
      data: people,
      enableColumnActions: false,
    }}
  />
</Story>

<Story name="Custom Column Actions">
  <MaterialSvelteTable
    options={{ columnActionsMenuItems: withBuiltIns, columns, data: people }}
  />
</Story>

<Story name="Custom Column Actions Per Column">
  <MaterialSvelteTable
    options={{
      columns: [
        { accessorKey: 'firstName', columnActionsMenuItems: logItem, header: 'First Name (custom)' },
        { accessorKey: 'lastName', header: 'Last Name' },
      ],
      data: people,
    }}
  />
</Story>
