<script lang="ts">
  import Button, { Label } from '@smui/button';
  import IconButton from '@smui/icon-button';
  import type { Snippet } from 'svelte';

  /** A button. The only UI-library-specific part is this kit folder. */
  let {
    children,
    icon = false,
    title,
    variant = 'ghost',
    ...rest
  }: {
    children: Snippet;
    /** A square button that holds just an icon. */
    icon?: boolean;
    title?: string;
    variant?: 'ghost' | 'outline' | 'primary';
    [key: string]: any;
  } = $props();
</script>

{#if icon}
  <span class="hdt-kit-icon-button" {title}>
    <IconButton {...rest} size="button">
      {@render children()}
    </IconButton>
  </span>
{:else}
  <Button {...rest} variant={variant === 'primary' ? 'unelevated' : variant === 'outline' ? 'outlined' : 'text'}>
    <Label>{@render children()}</Label>
  </Button>
{/if}

<style>
  .hdt-kit-icon-button {
    display: inline-flex;
  }
</style>
