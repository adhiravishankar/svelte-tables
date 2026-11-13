<script lang="ts">
  import type { WithElementRef } from '../../../utils/cn.js';
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
  data-slot="dropdown-menu-group"
  role="group"
  class={className}
  {...restProps}
>
  {@render children?.()}
</div>
