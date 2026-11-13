<script lang="ts">
  import { cn } from '../../../utils/cn.js';
  import type { HTMLInputAttributes } from 'svelte/elements';

  let {
    ref = $bindable(null),
    checked = $bindable(false),
    indeterminate = $bindable(false),
    class: className,
    onCheckedChange,
    ...restProps
  }: Omit<HTMLInputAttributes, 'type' | 'checked'> & {
    ref?: HTMLInputElement | null;
    checked?: boolean;
    indeterminate?: boolean;
    onCheckedChange?: (checked: boolean) => void;
  } = $props();

  // `indeterminate` is a DOM property, not an HTML attribute, so it has to be
  // set imperatively - this attachment keeps it in sync with the prop.
  function syncIndeterminate(node: HTMLInputElement) {
    node.indeterminate = indeterminate;
  }
</script>

<input
  bind:this={ref}
  type="checkbox"
  data-slot="checkbox"
  class={cn('form-check-input', className)}
  bind:checked
  {@attach syncIndeterminate}
  onchange={(event) => {
    checked = (event.currentTarget as HTMLInputElement).checked;
    onCheckedChange?.(checked);
  }}
  {...restProps}
/>
