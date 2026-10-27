<script lang="ts" generics="TData extends MRT_RowData">
  import type { MRT_Header, MRT_RowData, MRT_TableInstance } from '../../types';

  let {
    header,
    table,
  }: { header: MRT_Header<TData>; table: MRT_TableInstance<TData> } = $props();

  const column = $derived(header.column);
  const density = $derived(table.mrtState.density);
  const direction = $derived(table.options.columnResizeDirection);
  const mode = $derived(table.options.columnResizeMode);
  const resizing = $derived(column.getIsResizing());

  const margin = $derived(
    density === 'compact' ? '-8px' : density === 'comfortable' ? '-16px' : '-24px',
  );
  const edge = $derived(column.columnDef.columnDefType === 'display' ? '4px' : '0');
  const deltaOffset = $derived(table.atoms.columnResizing.get().deltaOffset ?? 0);

  const handler = $derived(header.getResizeHandler());

  function ondblclick() {
    table.setColumnResizing((old) => ({ ...old, isResizingColumn: false }));
    column.resetSize();
  }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class="mrt-resize-handle"
  class:mrt-resize-active={resizing && (header.subHeaders.length > 0 || mode === 'onEnd')}
  {ondblclick}
  onmousedown={handler}
  ontouchstart={handler}
  style:cursor="col-resize"
  style:left={direction === 'rtl' ? edge : undefined}
  style:margin-inline-start={direction === 'rtl' ? margin : undefined}
  style:margin-inline-end={direction === 'ltr' ? margin : undefined}
  style:right={direction === 'ltr' ? edge : undefined}
  style:transform={resizing && mode === 'onEnd'
    ? `translateX(${(direction === 'rtl' ? -1 : 1) * deltaOffset}px)`
    : undefined}
>
  <div class="mrt-resize-divider" class:mrt-resize-dragging={resizing}></div>
</div>

<style>
  .mrt-resize-handle {
    padding: 0 4px;
    position: absolute;
  }
  .mrt-resize-divider {
    background: var(--mrt-divider);
    border-radius: 2px;
    height: 24px;
    touch-action: none;
    transform: translateX(4px);
    transition: all 150ms ease-in-out;
    user-select: none;
    width: 2px;
    z-index: 4;
  }
  .mrt-resize-handle:active > .mrt-resize-divider {
    background: var(--mdc-theme-primary, #6200ee);
    opacity: 0;
  }
  .mrt-resize-handle.mrt-resize-active:active > .mrt-resize-divider {
    opacity: 1;
  }
  .mrt-resize-dragging {
    transition: none;
  }
</style>
