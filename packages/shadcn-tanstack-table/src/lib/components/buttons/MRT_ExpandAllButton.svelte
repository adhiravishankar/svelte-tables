<script lang="ts" generics="TData extends MRT_RowData">
  import type { MRT_RowData, MRT_TableInstance } from '../../types';
  import { parseFromValuesOrFunc } from '../../utils/utils';
  import MRT_IconButton from './MRT_IconButton.svelte';

  let {
    table,
    ...rest
  }: { table: MRT_TableInstance<TData>; [key: string]: any } = $props();

  const { localization } = $derived(table.options);
  const KeyboardDoubleArrowDownIcon = $derived(
    table.options.icons.KeyboardDoubleArrowDownIcon,
  );
  const compact = $derived(table.mrtState.density === 'compact');

  const buttonProps = $derived({
    ...parseFromValuesOrFunc(table.options.expandAllButtonProps, { table }),
    ...rest,
  });

  const isAllRowsExpanded = $derived(table.getIsAllRowsExpanded());
  const isSomeRowsExpanded = $derived(table.getIsSomeRowsExpanded());
  const disabled = $derived(
    !!table.mrtState.isLoading ||
      (!table.options.detailPanel && !table.getCanSomeRowsExpand()),
  );
  const size = $derived(compact ? '1.75rem' : '2.25rem');
</script>

<MRT_IconButton
  {disabled}
  label={localization.expandAll}
  title={buttonProps.title ??
    (isAllRowsExpanded ? localization.collapseAll : localization.expandAll)}
  onclick={() => table.toggleAllRowsExpanded(!isAllRowsExpanded)}
  {...buttonProps}
  size="button"
  style="height: {size}; width: {size}; padding: 0; {compact
    ? ''
    : 'margin-top: -0.25rem; '}{buttonProps.style ?? ''}"
>
  <KeyboardDoubleArrowDownIcon
    style="transform: rotate({isAllRowsExpanded
      ? -180
      : isSomeRowsExpanded
        ? -90
        : 0}deg); transition: transform 150ms"
  />
</MRT_IconButton>
