<script lang="ts">
  import IconButton from '@smui/icon-button';
  import type { Snippet } from 'svelte';

  /**
   * The icon button used across MRT: an SMUI `IconButton` with a native
   * tooltip (`title`) and an accessible label.
   */
  let {
    children,
    disabled = false,
    label,
    onclick,
    size = 'normal',
    title,
    ...rest
  }: {
    children: Snippet;
    disabled?: boolean;
    /** Accessible name. Also used as the tooltip unless `title` is set. */
    label: string;
    onclick?: (event: MouseEvent) => void;
    size?: 'button' | 'mini' | 'normal';
    title?: string;
    [key: string]: any;
  } = $props();
</script>

<span class="mrt-icon-button" title={title ?? label}>
  <IconButton {...rest} aria-label={label} {disabled} {onclick} {size}>
    {@render children()}
  </IconButton>
</span>

<style>
  .mrt-icon-button {
    display: inline-flex;
  }
</style>
