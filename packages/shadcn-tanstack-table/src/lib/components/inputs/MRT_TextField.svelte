<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cn } from '../../utils/cn';
  import { Input } from '../ui/input';

  /**
   * The text field used across MRT: a shadcn `Input` with optional leading and
   * trailing adornments. Every other prop is passed on to the `<input>`.
   */
  let {
    class: className,
    leading,
    ref = $bindable(null),
    trailing,
    variant = 'outlined',
    wrapperClass,
    ...rest
  }: {
    class?: string;
    leading?: Snippet;
    ref?: HTMLInputElement | null;
    trailing?: Snippet;
    /** `standard` is a borderless, underlined field for inline use in cells. */
    variant?: 'outlined' | 'standard';
    wrapperClass?: string;
    [key: string]: any;
  } = $props();
</script>

<div class={cn('relative flex w-full items-center', wrapperClass)}>
  {#if leading}
    <span class="absolute inset-s-0 z-10 flex items-center">{@render leading()}</span>
  {/if}
  <Input
    bind:ref
    class={cn(
      variant === 'standard' &&
        'rounded-none border-0 border-b bg-transparent px-0 shadow-none focus-visible:ring-0',
      leading && 'ps-9',
      trailing && 'pe-9',
      className,
    )}
    {...rest}
  />
  {#if trailing}
    <span class="absolute inset-e-0 z-10 flex items-center">{@render trailing()}</span>
  {/if}
</div>
