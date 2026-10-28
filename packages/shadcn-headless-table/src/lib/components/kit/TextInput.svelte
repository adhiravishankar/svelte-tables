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

<div class="relative flex w-full items-center">
  {#if leading}
    <span class="pointer-events-none absolute inset-s-2.5 flex items-center opacity-60">
      {@render leading()}
    </span>
  {/if}
  <Input
    class={cn(leading && 'ps-8', className)}
    oninput={(event: Event) => oninput((event.currentTarget as HTMLInputElement).value)}
    {value}
    {...rest}
  />
</div>
