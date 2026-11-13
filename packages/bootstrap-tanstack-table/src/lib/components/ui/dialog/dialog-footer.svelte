<script lang="ts">
  import { getContext } from 'svelte';
  import { cn, type WithElementRef } from '../../../utils/cn.js';
  import { Button } from '../button/index.js';
  import type { HTMLAttributes } from 'svelte/elements';
  import type { MRT_DialogContext } from './context.js';

  let {
    ref = $bindable(null),
    class: className,
    children,
    showCloseButton = false,
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
    showCloseButton?: boolean;
  } = $props();

  const dialog = getContext<MRT_DialogContext | undefined>('mrt-dialog');
</script>

<div
  bind:this={ref}
  data-slot="dialog-footer"
  class={cn('modal-footer mrt-dialog-footer', className)}
  {...restProps}
>
  {@render children?.()}
  {#if showCloseButton}
    <Button variant="outline" onclick={() => dialog?.close()}>Close</Button>
  {/if}
</div>

<style>
  :global(.mrt-dialog-footer) {
    border-top: 1px solid var(--border);
  }
</style>
