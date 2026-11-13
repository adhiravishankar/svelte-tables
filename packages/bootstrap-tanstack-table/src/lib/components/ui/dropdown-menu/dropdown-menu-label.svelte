<script lang="ts">
  import { cn, type WithElementRef } from '../../../utils/cn.js';
  import type { HTMLAttributes } from 'svelte/elements';

  let {
    ref = $bindable(null),
    class: className,
    children,
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();
</script>

<div
  bind:this={ref}
  data-slot="dropdown-menu-label"
  class={cn('dropdown-header mrt-dropdown-menu-label', className)}
  {...restProps}
>
  {@render children?.()}
</div>

<style>
  :global(.mrt-dropdown-menu-label) {
    padding-inline: 0.75rem;
  }
</style>
