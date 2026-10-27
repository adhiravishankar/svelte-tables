<script lang="ts" generics="TData extends MRT_RowData">
  import Textfield from '@smui/textfield';
  import { untrack } from 'svelte';
  import type { MRT_RowData, MRT_TableInstance } from '../../types';
  import { debounce, parseFromValuesOrFunc } from '../../utils/utils';
  import MRT_IconButton from '../buttons/MRT_IconButton.svelte';
  import MRT_FilterOptionMenu from '../menus/MRT_FilterOptionMenu.svelte';

  let {
    table,
    ...rest
  }: { table: MRT_TableInstance<TData>; [key: string]: any } = $props();

  const textFieldProps = $derived({
    ...parseFromValuesOrFunc(table.options.searchTextFieldProps, { table }),
    ...rest,
  });

  const globalFilter = $derived(table.atoms.globalFilter.get());
  const showGlobalFilter = $derived(table.mrtState.showGlobalFilter);
  const { CloseIcon, SearchIcon } = $derived(table.options.icons);
  const { localization } = $derived(table.options);

  // the input is local so typing stays instant while the filter is debounced
  let modeAnchor = $state<HTMLElement | null>(null);
  let searchValue = $state(untrack(() => table.atoms.globalFilter.get() ?? ''));

  const setFilterDebounced = debounce(
    (value: string) => table.setGlobalFilter(value || undefined),
    untrack(() => (table.options.manualFiltering ? 500 : 250)),
  );

  function oninput(event: Event) {
    searchValue = (event.target as HTMLInputElement).value;
    setFilterDebounced(searchValue);
  }

  function handleClear() {
    setFilterDebounced.clear();
    searchValue = '';
    table.setGlobalFilter(undefined);
  }

  // keep the input in sync when the filter is changed from elsewhere
  let lastSeen = untrack(() => globalFilter);
  $effect(() => {
    const next = globalFilter;
    if (next === lastSeen) return;
    lastSeen = next;
    searchValue = next ?? '';
  });

  $effect(() => () => setFilterDebounced.clear());

  function attachInput(node: HTMLElement) {
    table.refs.searchInputRef.current = node.querySelector('input');
    return () => {
      table.refs.searchInputRef.current = null;
    };
  }
</script>

{#if showGlobalFilter}
  <div class="mrt-global-filter" {@attach attachInput}>
    <Textfield
      variant="outlined"
      noLabel
      value={searchValue}
      class="mrt-global-filter-field"
      input$autocomplete="off"
      input$placeholder={localization.search}
      input$aria-label={localization.search}
      input$oninput={oninput}
      {...textFieldProps}
    >
      {#snippet leadingIcon()}
        {#if table.options.enableGlobalFilterModes}
          <MRT_IconButton
            label={localization.changeSearchMode}
            onclick={(e: MouseEvent) => (modeAnchor = e.currentTarget as HTMLElement)}
            size="mini"
            style="height: 1.75rem; width: 1.75rem; padding: 0"
          >
            <SearchIcon />
          </MRT_IconButton>
        {:else}
          <SearchIcon class="mrt-global-filter-icon" />
        {/if}
      {/snippet}
      {#snippet trailingIcon()}
        <MRT_IconButton
          disabled={!searchValue?.length}
          label={localization.clearSearch}
          onclick={handleClear}
          size="mini"
        >
          <CloseIcon />
        </MRT_IconButton>
      {/snippet}
    </Textfield>
    <MRT_FilterOptionMenu
      anchorEl={modeAnchor}
      onSelect={handleClear}
      setAnchorEl={(el) => (modeAnchor = el)}
      {table}
    />
  </div>
{/if}

<style>
  .mrt-global-filter {
    min-width: 12rem;
  }
  .mrt-global-filter :global(.mrt-global-filter-field) {
    height: 2.5rem;
    width: 100%;
  }
  .mrt-global-filter :global(.mrt-global-filter-icon) {
    font-size: 1.25rem;
    margin-inline-start: 0.5rem;
    opacity: 0.6;
  }
</style>
