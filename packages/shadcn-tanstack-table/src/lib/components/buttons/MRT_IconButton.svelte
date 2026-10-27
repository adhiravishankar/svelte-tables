<script lang="ts">
  import type { Snippet } from 'svelte';
  import { Button } from '../ui/button';

  /**
   * The icon button used across MRT: a shadcn icon `Button` with a native
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
  <Button
    {...rest}
    aria-label={label}
    {disabled}
    {onclick}
    size={size === 'mini' ? 'icon-sm' : 'icon'}
    variant="ghost"
  >
    {@render children()}
  </Button>
</span>

<style>
  .mrt-icon-button {
    display: inline-flex;
  }
</style>
