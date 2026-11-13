<script lang="ts">
  import { getContext } from 'svelte';
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { cn, type WithElementRef } from '../../../utils/cn.js';
  import { Button } from '../button/index.js';
  import CloseIcon from '../../../icons/CloseIcon.svelte';
  import type { MRT_DialogContext } from './context.js';

  let {
    ref = $bindable(null),
    class: className,
    children,
    showCloseButton = true,
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
    children?: Snippet;
    showCloseButton?: boolean;
  } = $props();

  const dialog = getContext<MRT_DialogContext | undefined>('mrt-dialog');

  function onkeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') dialog?.close();
  }

  function onBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) dialog?.close();
  }

  function autofocus(node: HTMLElement) {
    node.querySelector<HTMLElement>('input, textarea, button, [tabindex]')?.focus();
  }
</script>

<svelte:window {onkeydown} />

<div class="modal-backdrop fade show" data-slot="dialog-overlay"></div>
<!-- Escape is handled by the window listener above -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div
  class="modal fade show d-block mrt-dialog"
  tabindex="-1"
  role="dialog"
  aria-modal="true"
  onclick={onBackdropClick}
>
  <div class="modal-dialog modal-dialog-centered" role="presentation">
    <div
      bind:this={ref}
      data-slot="dialog-content"
      class={cn('modal-content', className)}
      {@attach autofocus}
      {...restProps}
    >
      {@render children?.()}
      {#if showCloseButton}
        <Button
          variant="ghost"
          class="mrt-dialog-close"
          size="icon-sm"
          onclick={() => dialog?.close()}
        >
          <CloseIcon />
          <span class="visually-hidden">Close</span>
        </Button>
      {/if}
    </div>
  </div>
</div>

<style>
  :global(.mrt-dialog) {
    overflow-y: auto;
  }
  :global(.mrt-dialog .modal-content) {
    position: relative;
  }
  :global(.mrt-dialog-close) {
    position: absolute;
    right: 0.5rem;
    top: 0.5rem;
  }
</style>
