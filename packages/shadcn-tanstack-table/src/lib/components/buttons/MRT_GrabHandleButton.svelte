<script lang="ts" generics="TData extends MRT_RowData">
  import type { MRT_RowData, MRT_TableInstance } from '../../types';
  import MRT_IconButton from './MRT_IconButton.svelte';

  /** A draggable handle used to reorder columns and rows. */
  let {
    ondragend,
    ondragstart,
    table,
    ...rest
  }: {
    ondragend?: (event: DragEvent) => void;
    ondragstart?: (event: DragEvent) => void;
    table: MRT_TableInstance<TData>;
    [key: string]: any;
  } = $props();

  const DragHandleIcon = $derived(table.options.icons.DragHandleIcon);
</script>

<MRT_IconButton
  draggable="true"
  label={table.options.localization.move}
  {ondragend}
  {ondragstart}
  size="mini"
  style="cursor: grab; height: 1.75rem; margin-inline-start: 2px; opacity: 0.5; padding: 0; transition: opacity 150ms; width: 1.75rem"
  {...rest}
>
  <DragHandleIcon />
</MRT_IconButton>
