<script lang="ts">
  import type { Snippet } from 'svelte';
  import { Button } from '../ui/button';
  import * as DropdownMenu from '../ui/dropdown-menu';

  /** The show/hide columns menu: a button that opens a checklist. */
  let {
    columns,
    icon,
    label,
    ontoggle,
  }: {
    columns: { id: string; header: string; visible: boolean; canHide: boolean }[];
    icon: Snippet;
    /** Accessible name and tooltip of the button. */
    label: string;
    ontoggle: (id: string, visible: boolean) => void;
  } = $props();
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger>
    {#snippet child({ props })}
      <Button {...props} aria-label={label} size="icon-sm" title={label} variant="ghost">
        {@render icon()}
      </Button>
    {/snippet}
  </DropdownMenu.Trigger>
  <DropdownMenu.Content align="end">
    {#each columns as column (column.id)}
      <DropdownMenu.CheckboxItem
        checked={column.visible}
        closeOnSelect={false}
        disabled={!column.canHide}
        onCheckedChange={(value) => ontoggle(column.id, value)}
      >
        {column.header}
      </DropdownMenu.CheckboxItem>
    {/each}
  </DropdownMenu.Content>
</DropdownMenu.Root>
