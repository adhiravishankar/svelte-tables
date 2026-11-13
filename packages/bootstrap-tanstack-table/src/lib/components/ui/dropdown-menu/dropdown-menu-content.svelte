<script lang="ts">
  import { getContext } from 'svelte';
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { cn, type WithElementRef } from '../../../utils/cn.js';
  import { floatingAnchor } from '../../../utils/floatingAnchor.js';
  import type { MRT_DropdownMenuContext } from './context.js';

  let {
    ref = $bindable(null),
    class: className,
    customAnchor,
    side = 'bottom',
    align = 'start',
    children,
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
    customAnchor: HTMLElement;
    side?: 'bottom' | 'right';
    align?: 'start' | 'end';
    children?: Snippet;
  } = $props();

  const menu = getContext<MRT_DropdownMenuContext | undefined>('mrt-dropdown-menu');
</script>

<div
  bind:this={ref}
  data-slot="dropdown-menu-content"
  role="menu"
  class={cn('dropdown-menu show mrt-dropdown-menu', className)}
  {@attach floatingAnchor({ anchor: customAnchor, side, align, onDismiss: () => menu?.close() })}
  {...restProps}
>
  {@render children?.()}
</div>

<style>
  :global(.mrt-dropdown-menu) {
    max-height: 70vh;
    overflow-y: auto;
    z-index: 1060;
  }
</style>
