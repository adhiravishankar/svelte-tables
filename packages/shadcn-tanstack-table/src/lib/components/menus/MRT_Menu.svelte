<script lang="ts" generics="TData extends MRT_RowData">
  import type { Snippet } from 'svelte';
  import type { MRT_RowData, MRT_TableInstance } from '../../types';
  import * as DropdownMenu from '../ui/dropdown-menu';

  /**
   * The menu surface used by every MRT menu: a shadcn `DropdownMenu` anchored
   * to an element, styled with the MRT menu background and table density. Menu
   * items go inside as `MRT_ActionMenuItem`s or `DropdownMenu.Item`s.
   */
  let {
    anchorCorner = 'BOTTOM_START',
    anchorEl,
    children,
    onclose,
    table,
    ...rest
  }: {
    anchorCorner?: 'BOTTOM_END' | 'BOTTOM_START' | 'TOP_END' | 'TOP_START';
    anchorEl: HTMLElement | null;
    children: Snippet;
    onclose: () => void;
    table: MRT_TableInstance<TData>;
    [key: string]: any;
  } = $props();

  const side = $derived(anchorCorner === 'TOP_END' ? 'right' : 'bottom');
  const align = $derived(anchorCorner === 'BOTTOM_END' ? 'end' : 'start');
</script>

{#if anchorEl}
  <DropdownMenu.Root open onOpenChange={(open) => !open && onclose()}>
    <DropdownMenu.Content
      {align}
      customAnchor={anchorEl}
      {side}
      onclick={(event: MouseEvent) => event.stopPropagation()}
      style="background-color: {table.options.mrtTheme.menuBackgroundColor}; width: auto"
      {...rest}
    >
      {@render children()}
    </DropdownMenu.Content>
  </DropdownMenu.Root>
{/if}
