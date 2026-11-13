<script lang="ts">
  import { cn, type WithElementRef } from '../../../utils/cn.js';
  import type { HTMLButtonAttributes } from 'svelte/elements';

  let {
    ref = $bindable(null),
    class: className,
    disabled = false,
    variant = 'default',
    onclick,
    onSelect,
    closeOnSelect: _closeOnSelect = true,
    children,
    ...restProps
  }: WithElementRef<HTMLButtonAttributes> & {
    variant?: 'default' | 'destructive';
    /** Fires alongside `onclick`; either (or both) may be given. */
    onSelect?: (event: MouseEvent) => void;
    /**
     * Accepted for API parity with the shadcn/bits-ui version. Every caller
     * in this library closes its menu explicitly from `onclick`/`onSelect`,
     * so items here never auto-close - this is unused but kept so call
     * sites that pass it don't need to change.
     */
    closeOnSelect?: boolean;
  } = $props();
</script>

<button
  bind:this={ref}
  type="button"
  data-slot="dropdown-menu-item"
  data-variant={variant}
  class={cn('dropdown-item mrt-dropdown-item', variant === 'destructive' && 'text-danger', className)}
  {disabled}
  onclick={(event) => {
    onclick?.(event);
    onSelect?.(event);
  }}
  {...restProps}
>
  {@render children?.()}
</button>

<style>
  :global(.mrt-dropdown-item) {
    align-items: center;
    display: flex;
    gap: 0.5rem;
    width: 100%;
  }
</style>
