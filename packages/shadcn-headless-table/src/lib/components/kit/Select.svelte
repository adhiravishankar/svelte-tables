<script lang="ts">
  import { cn } from '../../utils/cn';

  /** A native select, styled like the shadcn inputs. */
  let {
    class: className,
    label,
    onchange,
    options,
    placeholder,
    value,
  }: {
    class?: string;
    /** Accessible name. */
    label: string;
    onchange: (value: string) => void;
    options: { label: string; value: string | number | boolean }[];
    /** Shown for the empty choice. */
    placeholder?: string;
    value: string | number | boolean | undefined;
  } = $props();
</script>

<select
  aria-label={label}
  class={cn(
    'border-input dark:bg-input/30 focus-visible:border-ring focus-visible:ring-ring/50 h-8 w-full min-w-0 rounded-lg border bg-transparent px-2 text-sm outline-none focus-visible:ring-3',
    className,
  )}
  onchange={(event) => onchange(event.currentTarget.value)}
  onclick={(event) => event.stopPropagation()}
  value={value === undefined ? '' : String(value)}
>
  {#if placeholder !== undefined}
    <option value="">{placeholder}</option>
  {/if}
  {#each options as option (option.value)}
    <option value={String(option.value)}>{option.label}</option>
  {/each}
</select>
