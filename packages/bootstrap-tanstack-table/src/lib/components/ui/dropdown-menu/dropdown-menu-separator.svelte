<script lang="ts">
  import { cn, type WithElementRef } from '../../../utils/cn.js';
  import type { HTMLAttributes } from 'svelte/elements';

  let {
    ref = $bindable(null),
    class: className,
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLHRElement>> = $props();
</script>

<hr
  bind:this={ref}
  data-slot="dropdown-menu-separator"
  class={cn('dropdown-divider', className)}
  {...restProps}
/>
