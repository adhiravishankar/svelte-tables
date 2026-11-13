<script lang="ts">
  import { cn } from '../../utils/cn';

  /** A native select, styled like the Bootstrap inputs. */
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
  class={cn('form-select form-select-sm', className)}
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
