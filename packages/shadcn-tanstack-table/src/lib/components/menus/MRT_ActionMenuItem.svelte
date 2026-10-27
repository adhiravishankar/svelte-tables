<script lang="ts" generics="TData extends MRT_RowData">
  import type { Snippet } from 'svelte';
  import type { MRT_RowData, MRT_TableInstance } from '../../types';
  import * as DropdownMenu from '../ui/dropdown-menu';

  let {
    activated = false,
    icon,
    label,
    onOpenSubMenu,
    table,
    ...rest
  }: {
    /** Highlights the item as the current choice. */
    activated?: boolean;
    icon?: Snippet;
    label: string;
    onOpenSubMenu?: (event: Event) => void;
    table: MRT_TableInstance<TData>;
    [key: string]: any;
  } = $props();

  const ArrowRightIcon = $derived(table.options.icons.ArrowRightIcon);
</script>

<DropdownMenu.Item
  class="mrt-action-menu-item {activated ? 'bg-accent' : ''}"
  {...rest}
>
  <span class="mrt-action-menu-item-label">
    {#if icon}
      <span class="mrt-action-menu-item-icon">{@render icon()}</span>
    {/if}
    <span>{label}</span>
  </span>
  {#if onOpenSubMenu}
    <button
      aria-label="Open submenu"
      class="mrt-submenu-button"
      onclick={onOpenSubMenu}
      onmouseenter={onOpenSubMenu}
      type="button"
    >
      <ArrowRightIcon />
    </button>
  {/if}
</DropdownMenu.Item>

<style>
  :global(.mrt-action-menu-item) {
    justify-content: space-between;
    min-width: 120px;
  }
  .mrt-action-menu-item-label {
    align-items: center;
    display: flex;
    gap: 0.75rem;
  }
  .mrt-action-menu-item-icon {
    display: inline-flex;
  }
  .mrt-submenu-button {
    background: none;
    border: 0;
    color: inherit;
    cursor: pointer;
    display: inline-flex;
    padding: 0;
  }
</style>
