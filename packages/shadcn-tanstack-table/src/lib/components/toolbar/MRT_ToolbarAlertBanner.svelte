<script lang="ts" generics="TData extends MRT_RowData">
  import { Button } from '../ui/button';
  import type { HTMLAttributes } from 'svelte/elements';
  import type { MRT_RowData, MRT_TableInstance } from '../../types';
  import { getMRT_SelectAllHandler } from '../../utils/row.utils';
  import { mergeStyles } from '../../utils/style.utils';
  import { parseFromValuesOrFunc } from '../../utils/utils';

  let {
    stackAlertBanner = false,
    table,
    ...rest
  }: {
    stackAlertBanner?: boolean;
    table: MRT_TableInstance<TData>;
  } & HTMLAttributes<HTMLDivElement> = $props();

  const alertProps = $derived({
    ...parseFromValuesOrFunc(table.options.toolbarAlertBannerProps, { table }),
    ...rest,
  });
  const { localization } = $derived(table.options);
  const density = $derived(table.mrtState.density);
  const grouping = $derived(table.atoms.grouping.get());

  const totalRowCount = $derived(
    table.options.rowCount ?? table.getCoreRowModel().rows.length,
  );
  const selectedRowCount = $derived(
    table.options.manualPagination
      ? Object.values(table.atoms.rowSelection.get()).filter(Boolean).length
      : table.getFilteredSelectedRowModel().rows.length,
  );

  const hasSelectedAlert = $derived(selectedRowCount > 0);
  const hasGroupedAlert = $derived(grouping.length > 0);
  const open = $derived(
    table.mrtState.showAlertBanner || hasSelectedAlert || hasGroupedAlert,
  );

  const padding = $derived(
    table.options.positionToolbarAlertBanner !== 'head-overlay'
      ? '0.5rem 1rem'
      : density === 'spacious'
        ? '0.75rem 1.25rem'
        : density === 'comfortable'
          ? '0.5rem 0.75rem'
          : '0.25rem 0.5rem',
  );
</script>

{#snippet selectedAlert()}
  <span class="mrt-alert-selected">
    {localization.selectedCountOfRowCountRowsSelected
      ?.replace('{selectedCount}', selectedRowCount.toLocaleString(localization.language))
      ?.replace('{rowCount}', totalRowCount.toLocaleString(localization.language))}
    <Button
      onclick={(event: MouseEvent) =>
        getMRT_SelectAllHandler({ table })(event, false, true)}
      size="sm"
      variant="ghost"
    >
      {localization.clearSelection}
    </Button>
  </span>
{/snippet}

{#snippet groupedAlert()}
  <span>
    {localization.groupedBy}{' '}
    {#each grouping as columnId, index (`${index}-${columnId}`)}
      {index > 0 ? localization.thenBy : ''}
      <span class="mrt-chip">
        {table.getColumn(columnId).columnDef.header}
        <button
          aria-label="Remove {table.getColumn(columnId).columnDef.header} grouping"
          class="mrt-chip-delete"
          onclick={() => table.getColumn(columnId).toggleGrouping()}
          type="button"
        >
          ×
        </button>
      </span>
    {/each}
  </span>
{/snippet}

<div
  class="mrt-alert-collapse"
  class:mrt-alert-open={open}
  class:mrt-alert-animated={stackAlertBanner}
>
  <div class="mrt-alert-collapse-inner">
    <div
      role="alert"
      {...alertProps}
      class={['mrt-alert', alertProps.class]}
      inert={!open}
      style={mergeStyles(
        {
          marginBottom: stackAlertBanner
            ? 0
            : table.options.positionToolbarAlertBanner === 'bottom'
              ? '-1rem'
              : undefined,
        },
        alertProps.style,
      )}
    >
      {#if table.options.toolbarAlertBannerContent}
        {@render table.options.toolbarAlertBannerContent({
          groupedAlert: hasGroupedAlert ? groupedAlert : null,
          selectedAlert: hasSelectedAlert ? selectedAlert : null,
          table,
        })}
      {:else}
        <div class="mrt-alert-content" style:padding>
          {#if hasSelectedAlert}
            {@render selectedAlert()}
          {/if}
          {#if hasSelectedAlert && hasGroupedAlert}<br />{/if}
          {#if hasGroupedAlert}
            {@render groupedAlert()}
          {/if}
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  .mrt-alert-collapse {
    display: grid;
    grid-template-rows: 0fr;
  }
  .mrt-alert-animated {
    transition: grid-template-rows 200ms ease;
  }
  .mrt-alert-open {
    grid-template-rows: 1fr;
  }
  .mrt-alert-collapse-inner {
    min-height: 0;
    overflow: hidden;
  }
  .mrt-alert {
    background: color-mix(in srgb, var(--primary) 12%, var(--card));
    color: var(--card-foreground);
    font-size: 1rem;
    position: relative;
    width: 100%;
    z-index: 2;
  }
  .mrt-alert-selected {
    align-items: center;
    display: inline-flex;
    gap: 16px;
  }
  .mrt-chip {
    align-items: center;
    background: var(--mrt-divider);
    border-radius: 16px;
    display: inline-flex;
    font-size: 0.8125rem;
    gap: 4px;
    height: 32px;
    padding: 0 12px;
  }
  .mrt-chip-delete {
    background: none;
    border: 0;
    cursor: pointer;
    font-size: 1.1rem;
    line-height: 1;
    padding: 0;
  }
</style>
