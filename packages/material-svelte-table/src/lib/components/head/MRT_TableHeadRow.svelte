<script lang="ts" generics="TData extends MRT_RowData">
  import type { HTMLAttributes } from 'svelte/elements';
  import type {
    MRT_HeaderGroup,
    MRT_RowData,
    MRT_TableInstance,
  } from '../../types';
  import { isGridLayout, mergeStyles } from '../../utils/style.utils';
  import { parseFromValuesOrFunc } from '../../utils/utils';
  import MRT_TableHeadCell from './MRT_TableHeadCell.svelte';

  let {
    headerGroup,
    table,
    ...rest
  }: {
    headerGroup: MRT_HeaderGroup<TData>;
    table: MRT_TableInstance<TData>;
  } & HTMLAttributes<HTMLTableRowElement> = $props();

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
  {#each headerGroup.headers as header, staticColumnIndex (header.id)}
    <MRT_TableHeadCell {header} {staticColumnIndex} {table} />
  {/each}
</tr>
