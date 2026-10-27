<script lang="ts" generics="TData extends MRT_RowData">
  import type { HTMLAttributes } from 'svelte/elements';
  import type { MRT_RowData, MRT_TableInstance } from '../../types';
  import { mergeStyles } from '../../utils/style.utils';
  import { attachRef } from '../../utils/refs';
  import { parseFromValuesOrFunc } from '../../utils/utils';
  import MRT_BottomToolbar from '../toolbar/MRT_BottomToolbar.svelte';
  import MRT_TopToolbar from '../toolbar/MRT_TopToolbar.svelte';
  import MRT_TableContainer from './MRT_TableContainer.svelte';

  let {
    table,
    ...rest
  }: { table: MRT_TableInstance<TData> } & HTMLAttributes<HTMLDivElement> =
    $props();

  const paperProps = $derived({
    ...parseFromValuesOrFunc(table.options.tablePaperProps, { table }),
    ...rest,
  });
  const isFullScreen = $derived(table.mrtState.isFullScreen);
</script>

<div
  role="presentation"
  onkeydown={(e) => e.key === 'Escape' && table.setIsFullScreen(false)}
  {...paperProps}
  {@attach attachRef(table.refs.tablePaperRef)}
  class={['mrt-paper', isFullScreen && 'mrt-paper-fullscreen', paperProps.class]}
  style={mergeStyles(
    {
      '--mrt-match-highlight': table.options.mrtTheme.matchHighlightColor,
      backgroundColor: table.options.mrtTheme.baseBackgroundColor,
    },
    paperProps.style,
  )}
>
  {#if table.options.enableTopToolbar}
    {#if table.options.topToolbar}
      {@render table.options.topToolbar({ table })}
    {:else}
      <MRT_TopToolbar {table} />
    {/if}
  {/if}
  <MRT_TableContainer {table} />
  {#if table.options.enableBottomToolbar}
    {#if table.options.bottomToolbar}
      {@render table.options.bottomToolbar({ table })}
    {:else}
      <MRT_BottomToolbar {table} />
    {/if}
  {/if}
</div>

<style>
  .mrt-paper {
    --mrt-divider: color-mix(
      in srgb,
      var(--mdc-theme-on-surface, #000) 12%,
      transparent
    );
    --mrt-text-secondary: color-mix(
      in srgb,
      var(--mdc-theme-on-surface, #000) 60%,
      transparent
    );
    border-radius: 4px;
    box-shadow:
      0 3px 1px -2px rgba(0, 0, 0, 0.2),
      0 2px 2px 0 rgba(0, 0, 0, 0.14),
      0 1px 5px 0 rgba(0, 0, 0, 0.12);
    color: var(--mdc-theme-on-surface, rgba(0, 0, 0, 0.87));
    overflow: hidden;
    transition: all 100ms ease-in-out;
  }
  .mrt-paper-fullscreen {
    border-radius: 0;
    bottom: 0;
    height: 100dvh;
    left: 0;
    margin: 0;
    max-height: 100dvh;
    max-width: 100dvw;
    padding: 0;
    position: fixed;
    right: 0;
    top: 0;
    width: 100dvw;
    z-index: 1300;
  }
</style>
