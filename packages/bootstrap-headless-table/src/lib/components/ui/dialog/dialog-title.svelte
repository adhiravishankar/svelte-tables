<script lang="ts">
  import { cn, type WithElementRef } from '../../../utils/cn.js';
  import type { HTMLAttributes } from 'svelte/elements';

  let {
    ref = $bindable(null),
    class: className,
    children,
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLHeadingElement>> = $props();
</script>

<h2 bind:this={ref} data-slot="dialog-title" class={cn('modal-title', className)} {...restProps}>
  {@render children?.()}
</h2>
