<script lang="ts" generics="TData extends MRT_RowData">
  import type { HTMLAttributes } from 'svelte/elements';
  import type {
    MRT_HeaderGroup,
    MRT_RowData,
    MRT_TableInstance,
  } from '../../types';
  import { isGridLayout, mergeStyles } from '../../utils/style.utils';
  import { parseFromValuesOrFunc } from '../../utils/utils';
  import { useColumnVirtualizer } from '../../hooks/createMRTVirtualizers.svelte';
  import MRT_TableHeadCell from './MRT_TableHeadCell.svelte';

  let {
    headerGroup,
    table,
    ...rest
  }: {
    headerGroup: MRT_HeaderGroup<TData>;
    table: MRT_TableInstance<TData>;
  } & HTMLAttributes<HTMLTableRowElement> = $props();

  const columnVirtualizer = useColumnVirtualizer();
  const virtualizer = $derived(columnVirtualizer?.instance);
  const items = $derived(
    virtualizer
      ? virtualizer.virtualColumns
          .map((v) => ({ header: headerGroup.headers[v.index], index: v.index }))
          .filter((item) => item.header)
      : headerGroup.headers.map((header, index) => ({ header, index })),
  );

  const rowProps = $derived({
    ...parseFromValuesOrFunc(table.options.tableHeadRowProps, {
      headerGroup,
      table,
    }),
    ...rest,
  });
</script>

<tr
  {...rowProps}
  class={['mrt-head-row', rowProps.class]}
  style={mergeStyles(
    {
      backgroundColor: table.options.mrtTheme.baseBackgroundColor,
      boxShadow: '4px 0 8px rgba(0, 0, 0, 0.1)',
      display: isGridLayout(table.options.layoutMode) ? 'flex' : undefined,
      position:
        table.options.enableStickyHeader &&
        table.options.layoutMode === 'semantic'
          ? 'sticky'
          : 'relative',
      top: 0,
    },
    rowProps.style,
  )}
>
  {#if virtualizer?.virtualPaddingLeft}
    <th style="display: flex; width: {virtualizer.virtualPaddingLeft}px"></th>
  {/if}
  {#each items as { header, index } (header.id)}
    <MRT_TableHeadCell {header} staticColumnIndex={index} {table} />
  {/each}
  {#if virtualizer?.virtualPaddingRight}
    <th style="display: flex; width: {virtualizer.virtualPaddingRight}px"></th>
  {/if}
</tr>
