<script lang="ts" generics="TData extends MRT_RowData">
  import LinearProgress from '@smui/linear-progress';
  import type { MRT_RowData, MRT_TableInstance } from '../../types';
  import { parseFromValuesOrFunc } from '../../utils/utils';

  let {
    isTopToolbar,
    table,
  }: { isTopToolbar: boolean; table: MRT_TableInstance<TData> } = $props();

  const progressProps = $derived(
    parseFromValuesOrFunc(table.options.linearProgressProps, {
      isTopToolbar,
      table,
    }),
  );

  const { isLoading, showProgressBars } = $derived(table.mrtState);
  const visible = $derived(showProgressBars !== false && (isLoading || showProgressBars));
</script>

<div
  class="mrt-progress"
  class:mrt-progress-top={isTopToolbar}
  class:mrt-progress-bottom={!isTopToolbar}
  id="mrt-progress"
  style:height="4px"
>
  {#if visible}
    <LinearProgress
      aria-busy="true"
      aria-label="Loading"
      indeterminate
      {...progressProps}
    />
  {/if}
</div>

<style>
  .mrt-progress {
    left: 0;
    position: absolute;
    right: 0;
    width: 100%;
  }
  .mrt-progress-top {
    bottom: 0;
  }
  .mrt-progress-bottom {
    top: 0;
  }
</style>
