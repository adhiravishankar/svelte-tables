<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cn } from '../../utils/cn';
  import { Input } from '../ui/input';

  /**
   * The text field used across MRT: a Bootstrap `Input` with optional leading
   * and trailing adornments. Every other prop is passed on to the `<input>`.
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

<div class={cn('position-relative d-flex w-100 align-items-center', wrapperClass)}>
  {#if leading}
    <span class="position-absolute start-0 d-flex align-items-center mrt-textfield-adornment">
      {@render leading()}
    </span>
  {/if}
  <Input
    bind:ref
    class={cn(
      variant === 'standard' && 'mrt-textfield-standard',
      leading && 'mrt-textfield-has-leading',
      trailing && 'mrt-textfield-has-trailing',
      className,
    )}
    {...rest}
  />
  {#if trailing}
    <span class="position-absolute end-0 d-flex align-items-center mrt-textfield-adornment">
      {@render trailing()}
    </span>
  {/if}
</div>

<style>
  :global(.mrt-textfield-adornment) {
    z-index: 1;
  }
  :global(.mrt-textfield-standard) {
    background-color: transparent;
    border: 0;
    border-bottom: 1px solid var(--border);
    border-radius: 0;
    box-shadow: none;
    padding-inline: 0;
  }
  :global(.mrt-textfield-standard:focus) {
    box-shadow: none;
  }
  :global(.mrt-textfield-has-leading) {
    padding-inline-start: 2.25rem;
  }
  :global(.mrt-textfield-has-trailing) {
    padding-inline-end: 2.25rem;
  }
</style>
