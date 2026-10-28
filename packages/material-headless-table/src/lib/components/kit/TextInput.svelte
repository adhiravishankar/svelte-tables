<script lang="ts">
  import Textfield from '@smui/textfield';
  import type { Snippet } from 'svelte';

  /** A text field with an optional leading adornment. Other props go to the `<input>`. */
  let {
    leading,
    oninput,
    type = 'text',
    value = '',
    ...rest
  }: {
    leading?: Snippet;
    oninput: (value: string) => void;
    type?: string;
    value?: string;
    [key: string]: any;
  } = $props();

  const inputProps = $derived(
    Object.fromEntries(Object.entries(rest).map(([name, prop]) => ['input$' + name, prop])),
  );
</script>

<Textfield
  class="hdt-kit-textfield"
  noLabel
  type={type as any}
  {value}
  variant="outlined"
  input$autocomplete="off"
  input$oninput={(event: Event) => oninput((event.target as HTMLInputElement).value)}
  {...inputProps}
>
  {#snippet leadingIcon()}
    {#if leading}{@render leading()}{/if}
  {/snippet}
</Textfield>

<style>
  :global(.hdt-kit-textfield) {
    height: 2.25rem;
    width: 100%;
  }
</style>
