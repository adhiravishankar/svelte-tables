<script lang="ts" generics="TData extends MRT_RowData">
  import type { MRT_Header, MRT_RowData, MRT_TableInstance } from '../../types';
  import MRT_FilterOptionMenu from '../menus/MRT_FilterOptionMenu.svelte';
  import MRT_IconButton from './MRT_IconButton.svelte';

  /** The icon button that opens the filter-mode menu inside a filter field. */
  let {
    header,
    setFilterValue,
    table,
  }: {
    header: MRT_Header<TData>;
    setFilterValue?: (filterValue: any) => void;
    table: MRT_TableInstance<TData>;
  } = $props();

  const FilterListIcon = $derived(table.options.icons.FilterListIcon);
  let anchorEl = $state<HTMLElement | null>(null);
</script>

<MRT_IconButton
  label={table.options.localization.changeFilterMode}
  onclick={(event: MouseEvent) => {
    event.stopPropagation();
    anchorEl = event.currentTarget as HTMLElement;
  }}
  size="mini"
  style="height: 1.75rem; width: 1.75rem; padding: 0"
>
  <FilterListIcon />
</MRT_IconButton>
<MRT_FilterOptionMenu
  {anchorEl}
  {header}
  setAnchorEl={(el) => (anchorEl = el)}
  {setFilterValue}
  {table}
/>
