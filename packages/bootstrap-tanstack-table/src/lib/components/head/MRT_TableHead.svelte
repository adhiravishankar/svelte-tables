<script lang="ts" generics="TData extends MRT_RowData">
  import type { HTMLAttributes } from 'svelte/elements';
  import type { MRT_RowData, MRT_TableInstance } from '../../types';
  import { isGridLayout, mergeStyles } from '../../utils/style.utils';
  import { attachRef } from '../../utils/refs';
  import { parseFromValuesOrFunc } from '../../utils/utils';
  import MRT_ToolbarAlertBanner from '../toolbar/MRT_ToolbarAlertBanner.svelte';
  import MRT_TableHeadRow from './MRT_TableHeadRow.svelte';

  let {
    table,
    ...rest
  }: { table: MRT_TableInstance<TData> } & HTMLAttributes<HTMLTableSectionElement> =
    $props();

  const headProps = $derived({
    ...parseFromValuesOrFunc(table.options.tableHeadProps, { table }),
    ...rest,
  });

  const grid = $derived(isGridLayout(table.options.layoutMode));
  const stickyHeader = $derived(
    table.options.enableStickyHeader || table.mrtState.isFullScreen,
  );
  const showAlertBanner = $derived(
    table.options.positionToolbarAlertBanner === 'head-overlay' &&
      (table.mrtState.showAlertBanner ||
        table.getSelectedRowModel().rows.length > 0),
  );
</script>

<thead
  {...headProps}
  {@attach attachRef(table.refs.tableHeadRef)}
  class={['mrt-head', headProps.class]}
  style={mergeStyles(
    {
      display: grid ? 'grid' : undefined,
      opacity: 0.97,
      position: stickyHeader ? 'sticky' : 'relative',
      top: stickyHeader && grid ? 0 : undefined,
      zIndex: stickyHeader ? 2 : undefined,
    },
    headProps.style,
  )}
>
  {#if showAlertBanner}
    <tr style={mergeStyles({ display: grid ? 'grid' : undefined })}>
      <th
        colspan={table.getVisibleLeafColumns().length}
        style={mergeStyles({ display: grid ? 'grid' : undefined, padding: 0 })}
      >
        <MRT_ToolbarAlertBanner {table} />
      </th>
    </tr>
  {:else}
    {#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
      <MRT_TableHeadRow {headerGroup} {table} />
    {/each}
  {/if}
</thead>
