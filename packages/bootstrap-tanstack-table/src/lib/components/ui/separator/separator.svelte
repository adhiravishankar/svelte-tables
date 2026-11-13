<script lang="ts">
  import { cn, type WithElementRef } from '../../../utils/cn.js';
  import type { HTMLAttributes } from 'svelte/elements';

  let {
    ref = $bindable(null),
    class: className,
    orientation = 'horizontal',
    'data-slot': dataSlot = 'separator',
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
    orientation?: 'horizontal' | 'vertical';
  } = $props();
</script>

{#if orientation === 'vertical'}
  <div
    bind:this={ref}
    data-slot={dataSlot}
    class={cn('vr', className)}
    {...restProps}
  ></div>
{:else}
  <hr bind:this={ref} data-slot={dataSlot} class={cn('mrt-separator', className)} {...restProps} />
{/if}

<style>
  :global(.mrt-separator) {
    border-top-color: var(--border);
    margin: 0;
    opacity: 1;
  }
</style>
