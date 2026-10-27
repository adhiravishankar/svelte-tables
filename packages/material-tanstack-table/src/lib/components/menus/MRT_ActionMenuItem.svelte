<script lang="ts" generics="TData extends MRT_RowData">
  import { Graphic, Item, Text } from '@smui/list';
  import type { Snippet } from 'svelte';
  import type { MRT_RowData, MRT_TableInstance } from '../../types';

  let {
    icon,
    label,
    onOpenSubMenu,
    table,
    ...rest
  }: {
    icon?: Snippet;
    label: string;
    onOpenSubMenu?: (event: Event) => void;
    table: MRT_TableInstance<TData>;
    [key: string]: any;
  } = $props();

  const ArrowRightIcon = $derived(table.options.icons.ArrowRightIcon);
</script>

<Item class="mrt-action-menu-item" tabindex={0} {...rest}>
  <span class="mrt-action-menu-item-label">
    {#if icon}
      <Graphic>{@render icon()}</Graphic>
    {/if}
    <Text>{label}</Text>
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
</Item>

<style>
  :global(.mrt-action-menu-item) {
    justify-content: space-between;
    min-width: 120px;
  }
  .mrt-action-menu-item-label {
    align-items: center;
    display: flex;
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
