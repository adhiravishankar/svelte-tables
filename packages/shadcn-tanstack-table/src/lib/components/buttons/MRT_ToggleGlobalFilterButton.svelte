<script lang="ts" generics="TData extends MRT_RowData">
  import type { MRT_RowData, MRT_TableInstance } from '../../types';
  import MRT_IconButton from './MRT_IconButton.svelte';

  let {
    table,
    ...rest
  }: { table: MRT_TableInstance<TData>; [key: string]: any } = $props();

  const showGlobalFilter = $derived(table.mrtState.showGlobalFilter);
  const globalFilter = $derived(table.atoms.globalFilter.get());
  const Icon = $derived(
    showGlobalFilter
      ? table.options.icons.SearchOffIcon
      : table.options.icons.SearchIcon,
  );

  const toggle = () => {
    table.setShowGlobalFilter(!showGlobalFilter);
    queueMicrotask(() => table.refs.searchInputRef.current?.focus());
  };
</script>

<MRT_IconButton
  disabled={!!globalFilter && showGlobalFilter}
  label={table.options.localization.showHideSearch}
  onclick={toggle}
  {...rest}
>
  <Icon />
</MRT_IconButton>
