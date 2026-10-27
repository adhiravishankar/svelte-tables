<script lang="ts" generics="TData extends MRT_RowData">
  import type { HTMLAttributes } from 'svelte/elements';
  import type { MRT_RowData, MRT_TableInstance } from '../../types';
  import { mergeStyles } from '../../utils/style.utils';

  /** The area at the top or bottom of the table that columns are dropped on to group by them. */
  let {
    table,
    ...rest
  }: { table: MRT_TableInstance<TData> } & HTMLAttributes<HTMLDivElement> =
    $props();

  const draggingColumn = $derived(table.mrtState.draggingColumn);
  const hoveredColumn = $derived(table.mrtState.hoveredColumn);
  const grouping = $derived(table.atoms.grouping.get());
  const show = $derived(table.mrtState.showToolbarDropZone);

  $effect(() => {
    const next =
      !!table.options.enableGrouping &&
      !!draggingColumn &&
      draggingColumn.columnDef.enableGrouping !== false &&
      !grouping.includes(draggingColumn.id);
    if (next !== show) table.setShowToolbarDropZone(next);
  });
</script>

{#if show}
  <div
    role="presentation"
    ondragenter={() => table.setHoveredColumn({ id: 'drop-zone' })}
    ondragover={(e) => e.preventDefault()}
    {...rest}
    class={['mrt-drop-zone', rest.class]}
    style={mergeStyles(
      {
        backgroundColor: `color-mix(in srgb, var(--primary) ${
          hoveredColumn?.id === 'drop-zone' ? 20 : 10
        }%, transparent)`,
        border: 'dashed var(--primary) 2px',
      },
      rest.style,
    )}
  >
    <i>
      {table.options.localization.dropToGroupBy.replace(
        '{column}',
        draggingColumn?.columnDef?.header ?? '',
      )}
    </i>
  </div>
{/if}

<style>
  .mrt-drop-zone {
    align-items: center;
    backdrop-filter: blur(4px);
    box-sizing: border-box;
    display: flex;
    height: 100%;
    justify-content: center;
    position: absolute;
    width: 100%;
    z-index: 4;
  }
</style>
