<script lang="ts">
  import { cn } from '../../../utils/cn.js';
  import type { WithElementRef } from '../../../utils/cn.js';
  import type { HTMLAttributes } from 'svelte/elements';

  let {
    ref = $bindable(null),
    class: className,
    max = 100,
    value,
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
    max?: number;
    value?: number;
  } = $props();
</script>

<div
  bind:this={ref}
  data-slot="progress"
  class={cn('progress mrt-progress', className)}
  role="progressbar"
  aria-valuemin={0}
  aria-valuemax={max}
  aria-valuenow={value}
  {...restProps}
>
  <div
    data-slot="progress-indicator"
    class="progress-bar"
    style="width: {(100 * (value ?? 0)) / (max ?? 1)}%"
  ></div>
</div>

<style>
  :global(.mrt-progress) {
    height: 0.25rem;
  }
</style>
