<script lang="ts">
  import { cn, type WithElementRef } from '../../../utils/cn.js';
  import type { HTMLButtonAttributes } from 'svelte/elements';

  let {
    ref = $bindable(null),
    class: className,
    checked = $bindable(false),
    disabled = false,
    onCheckedChange,
    closeOnSelect: _closeOnSelect = false,
    children,
    ...restProps
  }: WithElementRef<HTMLButtonAttributes> & {
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
    /** Accepted for API parity - these checkbox items never auto-close. */
    closeOnSelect?: boolean;
  } = $props();

  function toggle() {
    checked = !checked;
    onCheckedChange?.(checked);
  }
</script>

<button
  bind:this={ref}
  type="button"
  data-slot="dropdown-menu-checkbox-item"
  class={cn('dropdown-item mrt-dropdown-item', className)}
  {disabled}
  onclick={toggle}
  {...restProps}
>
  <input
    class="form-check-input"
    type="checkbox"
    {checked}
    readonly
    tabindex={-1}
    style="pointer-events: none"
  />
  {@render children?.()}
</button>
