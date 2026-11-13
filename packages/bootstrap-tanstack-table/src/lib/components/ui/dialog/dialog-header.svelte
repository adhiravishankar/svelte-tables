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
  data-slot="dialog-header"
  class={cn('modal-header mrt-dialog-header', className)}
  {...restProps}
>
  {@render children?.()}
</div>

<style>
  /* No border or close button by default - MRT renders its own close button
     and the border inside `modal-content`. */
  :global(.mrt-dialog-header) {
    border-bottom: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
</style>
