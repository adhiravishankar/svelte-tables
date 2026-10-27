<script lang="ts" generics="TData extends MRT_RowData">
  import type { MRT_RowData, MRT_TableInstance } from '../../types';
  import { parseFromValuesOrFunc } from '../../utils/utils';
  import MRT_Spinner from '../MRT_Spinner.svelte';

  let { table }: { table: MRT_TableInstance<TData> } = $props();

  const progressProps = $derived(
    parseFromValuesOrFunc(table.options.circularProgressProps, { table }),
  );
</script>

<div
  class="mrt-loading-overlay"
  style:background-color="color-mix(in srgb, {table.options.mrtTheme.baseBackgroundColor} 50%, transparent)"
>
  <span
    aria-label={table.options.localization.noRecordsToDisplay}
    id="mrt-progress-{table.options.id}"
    role="progressbar"
    style="color: var(--primary)"
  >
    <MRT_Spinner size={progressProps?.size ?? 40} />
  </span>
</div>

<style>
  .mrt-loading-overlay {
    align-items: center;
    bottom: 0;
    display: flex;
    justify-content: center;
    left: 0;
    max-height: 100vh;
    position: absolute;
    right: 0;
    top: 0;
    width: 100%;
    z-index: 3;
  }
</style>
