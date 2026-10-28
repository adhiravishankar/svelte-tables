<script lang="ts">
  import FormField from '@smui/form-field';
  import IconButton from '@smui/icon-button';
  import Menu from '@smui/menu';
  import Switch from '@smui/switch';
  import type { Snippet } from 'svelte';

  /** The show/hide columns menu: a button that opens a list of switches. */
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

  let anchor = $state<HTMLElement | null>(null);
  let open = $state(false);
</script>

<span bind:this={anchor} class="hdt-kit-menu-anchor" title={label}>
  <IconButton aria-label={label} onclick={() => (open = !open)} size="button">
    {@render icon()}
  </IconButton>
</span>

{#if anchor && open}
  <Menu
    anchorCorner="BOTTOM_END"
    anchorElement={anchor}
    fixed
    open
    onSMUIMenuSurfaceClosed={() => (open = false)}
  >
    <div class="hdt-kit-menu-list">
      {#each columns as column (column.id)}
        <div class="hdt-kit-menu-item">
          <FormField>
            <Switch
              checked={column.visible}
              disabled={!column.canHide}
              onSMUISwitchChange={() => ontoggle(column.id, !column.visible)}
            />
            {#snippet label()}{column.header}{/snippet}
          </FormField>
        </div>
      {/each}
    </div>
  </Menu>
{/if}

<style>
  .hdt-kit-menu-anchor {
    display: inline-flex;
    position: relative;
  }
  .hdt-kit-menu-list {
    max-height: 20rem;
    overflow-y: auto;
    padding: 0.25rem 1rem;
  }
  .hdt-kit-menu-item {
    padding-block: 0.125rem;
  }
</style>
