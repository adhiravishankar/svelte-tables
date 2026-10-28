<script lang="ts" generics="TData extends RowData">
  import type { Snippet } from 'svelte';
  import DensityLargeIcon from '../icons/DensityLargeIcon.svelte';
  import DensityMediumIcon from '../icons/DensityMediumIcon.svelte';
  import DensitySmallIcon from '../icons/DensitySmallIcon.svelte';
  import SearchIcon from '../icons/SearchIcon.svelte';
  import ViewColumnIcon from '../icons/ViewColumnIcon.svelte';
  import { getColumnId } from '../createHeadlessTable.svelte';
  import type {
    Density,
    HeadlessLocalization,
    HeadlessTableInstance,
    RowData,
  } from '../types';
  import CloseIcon from '../icons/CloseIcon.svelte';
  import Button from './kit/Button.svelte';
  import ColumnMenu from './kit/ColumnMenu.svelte';
  import TextInput from './kit/TextInput.svelte';

  let {
    actions,
    class: className,
    enableColumnVisibility,
    enableDensityToggle,
    enableGlobalFilter,
    localization,
    table,
  }: {
    actions?: Snippet<[HeadlessTableInstance<TData>]>;
    class?: string;
    enableColumnVisibility: boolean;
    enableDensityToggle: boolean;
    enableGlobalFilter: boolean;
    localization: HeadlessLocalization;
    table: HeadlessTableInstance<TData>;
  } = $props();

  const densities: Density[] = ['comfortable', 'compact', 'spacious'];
  const nextDensity = $derived(
    densities[(densities.indexOf(table.state.density) + 1) % densities.length],
  );
  const menuColumns = $derived(
    table.columns.map((column) => {
      const id = getColumnId(column);
      return {
        canHide: column.enableHiding !== false,
        header: column.header,
        id,
        visible: table.isColumnVisible(id),
      };
    }),
  );
</script>

<div class="hdt-toolbar {className ?? ''}">
  <div class="hdt-toolbar-search">
    {#if enableGlobalFilter}
      <TextInput
        aria-label={localization.search}
        oninput={(value) => table.setGlobalFilter(value)}
        placeholder={localization.search}
        value={table.state.globalFilter}
      >
        {#snippet leading()}<SearchIcon />{/snippet}
      </TextInput>
    {/if}
    {#each table.state.grouping as id (id)}
      <span class="hdt-chip">
        {localization.groupedBy}{table.columns.find((column) => getColumnId(column) === id)?.header}
        <button
          aria-label={localization.ungroupByColumn.replace('{column}', id)}
          class="hdt-chip-remove"
          onclick={() => table.toggleGrouping(id)}
          type="button"
        >
          <CloseIcon />
        </button>
      </span>
    {/each}
  </div>
  <div class="hdt-toolbar-actions">
    {#if actions}{@render actions(table)}{/if}
    {#if enableDensityToggle}
      <Button
        aria-label={localization.toggleDensity}
        icon
        onclick={() => table.setDensity(nextDensity)}
        title={localization.toggleDensity}
      >
        {#if table.state.density === 'compact'}
          <DensitySmallIcon />
        {:else if table.state.density === 'spacious'}
          <DensityLargeIcon />
        {:else}
          <DensityMediumIcon />
        {/if}
      </Button>
    {/if}
    {#if enableColumnVisibility}
      <ColumnMenu
        columns={menuColumns}
        label={localization.showHideColumns}
        ontoggle={(id, visible) => table.toggleColumn(id, visible)}
      >
        {#snippet icon()}<ViewColumnIcon />{/snippet}
      </ColumnMenu>
    {/if}
  </div>
</div>

<style>
  .hdt-toolbar {
    align-items: center;
    display: flex;
    gap: 0.5rem;
    justify-content: space-between;
    padding: 0.5rem;
  }
  .hdt-toolbar-search {
    align-items: center;
    display: flex;
    flex: 0 1 28rem;
    flex-wrap: wrap;
    gap: 0.5rem;
    min-width: 10rem;
  }
  .hdt-chip {
    align-items: center;
    background: var(--hdt-hover);
    border-radius: 1rem;
    display: inline-flex;
    font-size: 0.8125rem;
    gap: 0.25rem;
    padding: 0.125rem 0.25rem 0.125rem 0.625rem;
  }
  .hdt-chip-remove {
    align-items: center;
    background: none;
    border: 0;
    cursor: pointer;
    display: inline-flex;
    padding: 0;
  }
  .hdt-toolbar-actions {
    align-items: center;
    display: flex;
    gap: 0.25rem;
  }
</style>
