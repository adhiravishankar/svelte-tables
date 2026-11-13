<script lang="ts">
  import type { Snippet } from 'svelte';
  import { Button } from '../ui/button';

  /** A button. The only UI-library-specific part is this kit folder. */
  let {
    children,
    icon = false,
    variant = 'ghost',
    ...rest
  }: {
    children: Snippet;
    /** A square button that holds just an icon. */
    icon?: boolean;
    variant?: 'ghost' | 'outline' | 'primary';
    [key: string]: any;
  } = $props();
</script>

<Button
  {...rest}
  size={icon ? 'icon-sm' : 'sm'}
  variant={variant === 'primary' ? 'default' : variant}
>
  {@render children()}
</Button>
