<script lang="ts" generics="TData extends MRT_RowData">
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
    <div
      aria-busy="true"
      aria-label="Loading"
      class="mrt-progress-track"
      role="progressbar"
      {...progressProps}
    >
      <div class="mrt-progress-bar"></div>
    </div>
  {/if}
</div>

<style>
  .mrt-progress-track {
    background: color-mix(in srgb, var(--primary) 20%, transparent);
    height: 4px;
    overflow: hidden;
    position: relative;
    width: 100%;
  }
  .mrt-progress-bar {
    animation: mrt-progress-indeterminate 1.5s ease-in-out infinite;
    background: var(--primary);
    height: 100%;
    width: 40%;
  }
  @keyframes mrt-progress-indeterminate {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(250%);
    }
  }
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
