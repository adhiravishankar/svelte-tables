<script lang="ts" generics="TData extends MRT_RowData">
  import type { MRT_Row, MRT_RowData, MRT_TableInstance } from '../../types';
  import { parseFromValuesOrFunc } from '../../utils/utils';
  import MRT_IconButton from './MRT_IconButton.svelte';

  let {
    row,
    staticRowIndex,
    table,
  }: {
    row: MRT_Row<TData>;
    staticRowIndex?: number;
    table: MRT_TableInstance<TData>;
  } = $props();

  const { localization } = $derived(table.options);
  const ExpandMoreIcon = $derived(table.options.icons.ExpandMoreIcon);
  const compact = $derived(table.mrtState.density === 'compact');
  const rtl = $derived(
    typeof document !== 'undefined' && document.dir === 'rtl',
  );

  const buttonProps = $derived(
    parseFromValuesOrFunc(table.options.expandButtonProps, {
      row,
      staticRowIndex,
      table,
    }),
  );

  const canExpand = $derived(row.getCanExpand());
  const isExpanded = $derived(row.getIsExpanded());
  const hasDetailPanel = $derived(!!table.options.detailPanel);
  const enabled = $derived(canExpand || hasDetailPanel);

  const rotation = $derived(
    !canExpand && !hasDetailPanel
      ? table.options.positionExpandColumn === 'last' || rtl
        ? 90
        : -90
      : isExpanded
        ? -180
        : 0,
  );
  const size = $derived(compact ? '1.75rem' : '2.25rem');

  function onclick(event: MouseEvent) {
    event.stopPropagation();
    row.toggleExpanded();
    buttonProps?.onclick?.(event);
  }
</script>

<MRT_IconButton
  disabled={!enabled}
  label={localization.expand}
  title={buttonProps?.title ?? (isExpanded ? localization.collapse : localization.expand)}
  {...buttonProps}
  {onclick}
  size="button"
  style="height: {size}; width: {size}; padding: 0; opacity: {enabled ? 1 : 0.3}; margin-inline-{table
    .options.positionExpandColumn === 'last' || rtl
    ? 'end'
    : 'start'}: {row.depth * 16}px; {buttonProps?.style ?? ''}"
>
  <ExpandMoreIcon
    style="transform: rotate({rotation}deg); transition: transform 150ms"
  />
</MRT_IconButton>
