<script lang="ts" module>
  import { cn, type WithElementRef } from '../../../utils/cn.js';
  import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';

  export type ButtonVariant =
    | 'default'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'destructive'
    | 'link';
  export type ButtonSize =
    | 'default'
    | 'xs'
    | 'sm'
    | 'lg'
    | 'icon'
    | 'icon-xs'
    | 'icon-sm'
    | 'icon-lg';

  const variantClass: Record<ButtonVariant, string> = {
    default: 'btn-primary',
    outline: 'btn-outline-secondary',
    secondary: 'btn-secondary',
    ghost: 'mrt-btn-ghost',
    destructive: 'mrt-btn-destructive',
    link: 'btn-link',
  };

  const sizeClass: Record<ButtonSize, string> = {
    default: '',
    xs: 'btn-sm mrt-btn-xs',
    sm: 'btn-sm',
    lg: 'btn-lg',
    icon: 'mrt-btn-icon',
    'icon-xs': 'mrt-btn-icon mrt-btn-icon-xs',
    'icon-sm': 'mrt-btn-icon mrt-btn-icon-sm',
    'icon-lg': 'mrt-btn-icon mrt-btn-icon-lg',
  };

  export const buttonVariants = ({
    variant = 'default',
    size = 'default',
  }: { variant?: ButtonVariant; size?: ButtonSize } = {}) =>
    cn('btn mrt-btn', variantClass[variant], sizeClass[size]);

  export type ButtonProps = WithElementRef<HTMLButtonAttributes> &
    WithElementRef<HTMLAnchorAttributes> & {
      variant?: ButtonVariant;
      size?: ButtonSize;
    };
</script>

<script lang="ts">
  let {
    class: className,
    variant = 'default',
    size = 'default',
    ref = $bindable(null),
    href = undefined,
    type = 'button',
    disabled,
    children,
    ...restProps
  }: ButtonProps = $props();
</script>

{#if href}
  <a
    bind:this={ref}
    data-slot="button"
    class={cn(buttonVariants({ variant, size }), className)}
    href={disabled ? undefined : href}
    aria-disabled={disabled}
    role={disabled ? 'link' : undefined}
    tabindex={disabled ? -1 : undefined}
    {...restProps}
  >
    {@render children?.()}
  </a>
{:else}
  <button
    bind:this={ref}
    data-slot="button"
    class={cn(buttonVariants({ variant, size }), className)}
    {type}
    {disabled}
    {...restProps}
  >
    {@render children?.()}
  </button>
{/if}

<style>
  /*
   * Bootstrap ships variant classes for primary, secondary, outline, and
   * link, but not for a borderless ghost button or a soft destructive one,
   * and no square icon-button sizing. These fill those gaps with Bootstrap's
   * own variables so they still follow the app's theme and color mode.
   */
  :global(.mrt-btn) {
    align-items: center;
    display: inline-flex;
    gap: 0.375rem;
    justify-content: center;
  }
  :global(.mrt-btn-ghost) {
    background-color: transparent;
    border-color: transparent;
    color: inherit;
  }
  :global(.mrt-btn-ghost:hover:not(:disabled)) {
    background-color: var(--bs-tertiary-bg);
    border-color: transparent;
    color: inherit;
  }
  :global(.mrt-btn-destructive) {
    background-color: color-mix(in srgb, var(--bs-danger) 10%, transparent);
    border-color: transparent;
    color: var(--bs-danger);
  }
  :global(.mrt-btn-destructive:hover:not(:disabled)) {
    background-color: color-mix(in srgb, var(--bs-danger) 20%, transparent);
    border-color: transparent;
    color: var(--bs-danger);
  }
  :global(.mrt-btn-xs) {
    font-size: 0.75rem;
    padding: 0.125rem 0.5rem;
  }
  :global(.mrt-btn-icon) {
    height: 2rem;
    padding: 0;
    width: 2rem;
  }
  :global(.mrt-btn-icon-xs) {
    height: 1.5rem;
    width: 1.5rem;
  }
  :global(.mrt-btn-icon-sm) {
    height: 1.75rem;
    width: 1.75rem;
  }
  :global(.mrt-btn-icon-lg) {
    height: 2.25rem;
    width: 2.25rem;
  }
</style>
