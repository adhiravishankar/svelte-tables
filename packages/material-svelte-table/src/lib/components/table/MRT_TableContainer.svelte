<script lang="ts" generics="TData extends MRT_RowData">
  import type { HTMLAttributes } from 'svelte/elements';
  import type { MRT_RowData, MRT_TableInstance } from '../../types';
  import { mergeStyles } from '../../utils/style.utils';
  import { attachRef } from '../../utils/refs';
  import { parseFromValuesOrFunc } from '../../utils/utils';
  import MRT_Table from './MRT_Table.svelte';

  let {
    table,
    ...rest
  }: { table: MRT_TableInstance<TData> } & HTMLAttributes<HTMLDivElement> =
    $props();

  const containerProps = $derived({
    ...parseFromValuesOrFunc(table.options.tableContainerProps, { table }),
    ...rest,
  });

  const loading = $derived(
    table.mrtState.showLoadingOverlay !== false &&
      (table.mrtState.isLoading || table.mrtState.showLoadingOverlay),
  );

  // Sticky headers and full screen need to know the height taken by the toolbars.
  let totalToolbarHeight = $state(0);
  $effect(() => {
    // re-measure when anything that can change the toolbars' size changes
    void table.mrtState.density;
    void table.mrtState.showAlertBanner;
    void table.mrtState.showColumnFilters;
    void table.mrtState.isFullScreen;
    void table.atoms.rowSelection.get();
    totalToolbarHeight =
      (table.refs.topToolbarRef.current?.offsetHeight ?? 0) +
      (table.refs.bottomToolbarRef.current?.offsetHeight ?? 0);
  });
</script>

<div
  aria-busy={loading}
  aria-describedby={loading ? 'mrt-progress' : undefined}
  {...containerProps}
  {@attach attachRef(table.refs.tableContainerRef)}
  class={['mrt-table-container', containerProps.class]}
  style={mergeStyles(
    {
      maxHeight: table.mrtState.isFullScreen
        ? `calc(100vh - ${totalToolbarHeight}px)`
        : table.options.enableStickyHeader
          ? `clamp(350px, calc(100vh - ${totalToolbarHeight}px), 9999px)`
          : undefined,
    },
    containerProps.style,
  )}
>
  <MRT_Table {table} />
</div>

<style>
  .mrt-table-container {
    max-width: 100%;
    overflow: auto;
    position: relative;
    width: 100%;
  }
</style>
