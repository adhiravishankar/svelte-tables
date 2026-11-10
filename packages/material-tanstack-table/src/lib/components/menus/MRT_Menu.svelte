<script lang="ts" generics="TData extends MRT_RowData">
  import List from '@smui/list';
  import Menu from '@smui/menu';
  import type { Snippet } from 'svelte';
  import type { MRT_RowData, MRT_TableInstance } from '../../types';

  /**
   * The menu surface used by every MRT menu: an SMUI `Menu` anchored to an
   * element, styled with the MRT menu background and table density. Menu items
   * go inside as `MRT_ActionMenuItem`s or SMUI list `Item`s.
   */
  let {
    anchorEl,
    children,
    onclose,
    table,
    ...rest
  }: {
    anchorEl: HTMLElement | null;
    children: Snippet;
    onclose: () => void;
    table: MRT_TableInstance<TData>;
    [key: string]: any;
  } = $props();

  const dense = $derived(table.mrtState.density === 'compact');
  const open = $derived(!!anchorEl);

  /**
   * Moves the menu out of the table DOM and into `document.body`. Inside the
   * table it is trapped in the sticky header's stacking context and drawn
   * underneath body cells.
   */
  function portal(node: HTMLElement) {
    document.body.appendChild(node);
    return () => node.remove();
  }
</script>

{#if anchorEl}
  <div {@attach portal}>
    <Menu
      {open}
      fixed
      anchor={false}
      anchorElement={anchorEl}
      anchorCorner="BOTTOM_START"
      onSMUIMenuSurfaceClosed={onclose}
      onclick={(event: MouseEvent) => event.stopPropagation()}
      style="background-color: {table.options.mrtTheme
        .menuBackgroundColor}; z-index: 1400"
      {...rest}
    >
      <List {dense}>
        {@render children()}
      </List>
    </Menu>
  </div>
{/if}
