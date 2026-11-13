<script lang="ts">
  import { getContext } from 'svelte';
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { cn, type WithElementRef } from '../../../utils/cn.js';
  import { floatingAnchor } from '../../../utils/floatingAnchor.js';
  import type { MRT_PopoverContext } from './context.js';

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

  const popover = getContext<MRT_PopoverContext | undefined>('mrt-popover');
</script>

<div
  bind:this={ref}
  data-slot="popover-content"
  role="dialog"
  class={cn('popover bs-popover-auto show mrt-popover', className)}
  {@attach floatingAnchor({ anchor: customAnchor, side, align, onDismiss: () => popover?.close() })}
  {...restProps}
>
  <div class="popover-body">
    {@render children?.()}
  </div>
</div>

<style>
  :global(.mrt-popover) {
    max-width: none;
    z-index: 1060;
  }
</style>
