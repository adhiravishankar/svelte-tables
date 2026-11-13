<script lang="ts">
  import { setContext } from 'svelte';
  import type { Snippet } from 'svelte';
  import type { MRT_DialogContext } from './context.js';

  let {
    open = $bindable(false),
    onOpenChange,
    children,
  }: {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    children?: Snippet;
  } = $props();

  function setOpen(value: boolean) {
    open = value;
    onOpenChange?.(value);
  }

  setContext<MRT_DialogContext>('mrt-dialog', {
    get open() {
      return open;
    },
    close: () => setOpen(false),
    setOpen,
  });
</script>

{@render children?.()}
