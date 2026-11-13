<script lang="ts">
  import { getContext } from 'svelte';
  import type { HTMLButtonAttributes } from 'svelte/elements';
  import type { WithElementRef } from '../../../utils/cn.js';
  import type { MRT_DialogContext } from './context.js';

  let {
    ref = $bindable(null),
    type = 'button',
    onclick,
    ...restProps
  }: WithElementRef<HTMLButtonAttributes> = $props();

  const dialog = getContext<MRT_DialogContext | undefined>('mrt-dialog');
</script>

<button
  bind:this={ref}
  data-slot="dialog-trigger"
  {type}
  onclick={(event) => {
    onclick?.(event);
    dialog?.setOpen(true);
  }}
  {...restProps}
></button>
