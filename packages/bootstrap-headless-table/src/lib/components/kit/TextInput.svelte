<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cn } from '../../utils/cn';
  import { Input } from '../ui/input';

  /** A text field with an optional leading adornment. */
  let {
    class: className,
    leading,
    oninput,
    value = '',
    ...rest
  }: {
    class?: string;
    leading?: Snippet;
    oninput: (value: string) => void;
    value?: string;
    [key: string]: any;
  } = $props();
</script>

<div class="position-relative d-flex w-100 align-items-center">
  {#if leading}
    <span class="position-absolute start-0 d-flex align-items-center mrt-textinput-leading">
      {@render leading()}
    </span>
  {/if}
  <Input
    class={cn(leading && 'mrt-textinput-has-leading', className)}
    oninput={(event: Event) => oninput((event.currentTarget as HTMLInputElement).value)}
    {value}
    {...rest}
  />
</div>

<style>
  :global(.mrt-textinput-leading) {
    margin-inline-start: 0.625rem;
    opacity: 0.6;
    pointer-events: none;
    z-index: 1;
  }
  :global(.mrt-textinput-has-leading) {
    padding-inline-start: 2rem;
  }
</style>
