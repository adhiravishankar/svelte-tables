<script lang="ts">
  import { cn } from '../../../utils/cn.js';
  import type { HTMLInputAttributes } from 'svelte/elements';

  let {
    ref = $bindable(null),
    class: className,
    checked = $bindable(false),
    onCheckedChange,
    ...restProps
  }: Omit<HTMLInputAttributes, 'type' | 'checked'> & {
    ref?: HTMLInputElement | null;
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
  } = $props();
</script>

<!-- Bootstrap's switch styling (`.form-switch .form-check-input`) requires a
     `.form-switch` ancestor, so the wrapper is part of the primitive rather
     than left to callers. -->
<div class="form-check form-switch mb-0 p-0 mrt-switch-wrapper">
  <input
    bind:this={ref}
    type="checkbox"
    role="switch"
    data-slot="switch"
    class={cn('form-check-input', className)}
    bind:checked
    onchange={(event) => {
      checked = (event.currentTarget as HTMLInputElement).checked;
      onCheckedChange?.(checked);
    }}
    {...restProps}
  />
</div>

<style>
  :global(.mrt-switch-wrapper) {
    display: inline-flex;
    min-height: 0;
  }
  :global(.mrt-switch-wrapper .form-check-input) {
    float: none;
    margin-inline-start: 0;
  }
</style>
