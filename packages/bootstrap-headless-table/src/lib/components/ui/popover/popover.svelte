<script lang="ts">
  import { setContext } from 'svelte';
  import type { Snippet } from 'svelte';
  import type { MRT_PopoverContext } from './context.js';

  let {
    open = $bindable(false),
    onOpenChange,
    children,
  }: {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    children?: Snippet;
  } = $props();

  function close() {
    open = false;
    onOpenChange?.(false);
  }

  setContext<MRT_PopoverContext>('mrt-popover', {
    get open() {
      return open;
    },
    close,
  });
</script>

{@render children?.()}
