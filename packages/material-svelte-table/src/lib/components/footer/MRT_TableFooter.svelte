<script lang="ts" generics="TData extends MRT_RowData">
  import type { HTMLAttributes } from 'svelte/elements';
  import type { MRT_RowData, MRT_TableInstance } from '../../types';
  import { isGridLayout, mergeStyles } from '../../utils/style.utils';
  import { parseFromValuesOrFunc } from '../../utils/utils';
  import MRT_TableFooterRow from './MRT_TableFooterRow.svelte';

  let {
    table,
    ...rest
  }: { table: MRT_TableInstance<TData> } & HTMLAttributes<HTMLTableSectionElement> =
    $props();

  const footerProps = $derived({
    ...parseFromValuesOrFunc(table.options.tableFooterProps, { table }),
    ...rest,
  });

  const stickFooter = $derived(
    (table.mrtState.isFullScreen || table.options.enableStickyFooter) &&
      table.options.enableStickyFooter !== false,
  );

  const footerGroups = $derived(table.getFooterGroups());

  // if there is no footer content at all, skip the footer
  const hasFooterContent = $derived(
    footerGroups.some((footerGroup) =>
      footerGroup.headers?.some(
        (header) =>
          (typeof header.column.columnDef.footer === 'string' &&
            !!header.column.columnDef.footer) ||
          header.column.columnDef.Footer,
      ),
    ),
  );
</script>

{#if hasFooterContent}
  <tfoot
    {...footerProps}
    bind:this={table.refs.tableFooterRef.current}
    class={['mrt-footer', stickFooter && 'mrt-footer-sticky', footerProps.class]}
    style={mergeStyles(
      {
        bottom: stickFooter ? 0 : undefined,
        display: isGridLayout(table.options.layoutMode) ? 'grid' : undefined,
        opacity: stickFooter ? 0.97 : undefined,
        position: stickFooter ? 'sticky' : 'relative',
        zIndex: stickFooter ? 1 : undefined,
      },
      footerProps.style,
    )}
  >
    {#each footerGroups as footerGroup (footerGroup.id)}
      <MRT_TableFooterRow {footerGroup} {table} />
    {/each}
  </tfoot>
{/if}

<style>
  .mrt-footer-sticky {
    outline: 1px solid var(--mrt-divider);
  }
</style>
