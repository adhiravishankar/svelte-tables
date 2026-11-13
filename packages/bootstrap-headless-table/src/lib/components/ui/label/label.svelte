<script lang="ts">
  import { cn, type WithElementRef } from '../../../utils/cn.js';
  import type { HTMLLabelAttributes } from 'svelte/elements';

  let {
    ref = $bindable(null),
    class: className,
    children,
    ...restProps
  }: WithElementRef<HTMLLabelAttributes> = $props();
</script>

<label
  bind:this={ref}
  data-slot="label"
  class={cn('form-label mrt-label', className)}
  {...restProps}
>
  {@render children?.()}
</label>

<style>
  /* Bootstrap's `form-label` is block-level and margin-bottom; MRT uses
     labels as inline wrappers around a control plus its text. */
  :global(.mrt-label) {
    align-items: center;
    display: inline-flex;
    gap: 0.5rem;
    margin-bottom: 0;
  }
</style>
