<script lang="ts" generics="TData extends MRT_RowData">
  import type { MRT_RowData, MRT_TableInstance } from '../../types';
  import MRT_IconButton from './MRT_IconButton.svelte';

  let {
    table,
    ...rest
  }: { table: MRT_TableInstance<TData>; [key: string]: any } = $props();

  const showColumnFilters = $derived(table.mrtState.showColumnFilters);
  const Icon = $derived(
    showColumnFilters
      ? table.options.icons.FilterListOffIcon
      : table.options.icons.FilterListIcon,
  );
</script>

<MRT_IconButton
  label={table.options.localization.showHideFilters}
  onclick={() => table.setShowColumnFilters(!showColumnFilters)}
  {...rest}
>
  <Icon />
</MRT_IconButton>
