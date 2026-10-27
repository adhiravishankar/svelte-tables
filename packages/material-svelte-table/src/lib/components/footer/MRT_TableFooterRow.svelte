<script lang="ts" generics="TData extends MRT_RowData">
  import type { HTMLAttributes } from 'svelte/elements';
  import type {
    MRT_HeaderGroup,
    MRT_RowData,
    MRT_TableInstance,
  } from '../../types';
  import { isGridLayout, mergeStyles } from '../../utils/style.utils';
  import { parseFromValuesOrFunc } from '../../utils/utils';
  import MRT_TableFooterCell from './MRT_TableFooterCell.svelte';

  let {
    footerGroup,
    table,
    ...rest
  }: {
    footerGroup: MRT_HeaderGroup<TData>;
    table: MRT_TableInstance<TData>;
  } & HTMLAttributes<HTMLTableRowElement> = $props();

  const rowProps = $derived({
    ...parseFromValuesOrFunc(table.options.tableFooterRowProps, {
      footerGroup,
      table,
    }),
    ...rest,
  });

  // if there is no content in the row, skip the row
  const hasContent = $derived(
    footerGroup.headers?.some(
      (header) =>
        (typeof header.column.columnDef.footer === 'string' &&
          !!header.column.columnDef.footer) ||
        header.column.columnDef.Footer,
    ),
  );
</script>

{#if hasContent}
  <tr
    {...rowProps}
    class={['mrt-footer-row', rowProps.class]}
    style={mergeStyles(
      {
        backgroundColor: table.options.mrtTheme.baseBackgroundColor,
        display: isGridLayout(table.options.layoutMode) ? 'flex' : undefined,
        position: 'relative',
        width: '100%',
      },
      rowProps.style,
    )}
  >
    {#each footerGroup.headers as footer, staticColumnIndex (footer.id)}
      <MRT_TableFooterCell {footer} {staticColumnIndex} {table} />
    {/each}
  </tr>
{/if}
