<script lang="ts" generics="TData extends MRT_RowData">
  import type { HTMLAttributes } from 'svelte/elements';
  import type { MRT_RowData, MRT_TableInstance } from '../../types';
  import { mergeStyles } from '../../utils/style.utils';
  import { attachRef } from '../../utils/refs';
  import { parseFromValuesOrFunc } from '../../utils/utils';
  import MRT_CellActionMenu from '../menus/MRT_CellActionMenu.svelte';
  import MRT_EditRowModal from '../modals/MRT_EditRowModal.svelte';
  import MRT_Table from './MRT_Table.svelte';
  import MRT_TableLoadingOverlay from './MRT_TableLoadingOverlay.svelte';

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

  const createModalOpen = $derived(
    table.options.createDisplayMode === 'modal' && !!table.mrtState.creatingRow,
  );
  const editModalOpen = $derived(
    table.options.editDisplayMode === 'modal' && !!table.mrtState.editingRow,
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
  {#if loading}
    <MRT_TableLoadingOverlay {table} />
  {/if}
  <MRT_Table {table} />
  {#if createModalOpen || editModalOpen}
    <MRT_EditRowModal {table} />
  {/if}
  {#if table.options.enableCellActions && table.mrtState.actionCell}
    <MRT_CellActionMenu {table} />
  {/if}
</div>

<style>
  .mrt-table-container {
    max-width: 100%;
    overflow: auto;
    position: relative;
    width: 100%;
  }
</style>
