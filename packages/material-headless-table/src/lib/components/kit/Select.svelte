<script lang="ts">
  /** A native select, styled to sit next to the Material text fields. */
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
  class="hdt-kit-select {className ?? ''}"
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

<style>
  .hdt-kit-select {
    background: transparent;
    border: 0;
    border-bottom: 1px solid var(--hdt-border, currentColor);
    color: inherit;
    font: inherit;
    min-width: 0;
    padding: 6px 0;
    width: 100%;
  }
</style>
