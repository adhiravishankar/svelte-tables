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

  let anchorEl = $state<HTMLElement | null>(null);
  let open = $state(false);
</script>

<Button
  aria-label={label}
  bind:ref={anchorEl}
  onclick={() => (open = !open)}
  size="icon-sm"
  title={label}
  variant="ghost"
>
  {@render icon()}
</Button>

{#if open && anchorEl}
  <DropdownMenu.Root open onOpenChange={(value) => (open = value)}>
    <DropdownMenu.Content align="end" customAnchor={anchorEl}>
      {#each columns as column (column.id)}
        <DropdownMenu.CheckboxItem
          checked={column.visible}
          disabled={!column.canHide}
          onCheckedChange={(value) => ontoggle(column.id, value)}
        >
          {column.header}
        </DropdownMenu.CheckboxItem>
      {/each}
    </DropdownMenu.Content>
  </DropdownMenu.Root>
{/if}
