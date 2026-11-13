<script lang="ts" generics="TData extends MRT_RowData">
  import type { Snippet } from 'svelte';
  import type { MRT_Cell, MRT_RowData, MRT_TableInstance } from '../../types';
  import { parseFromValuesOrFunc } from '../../utils/utils';

  /** Wraps a cell's content in a button that copies the cell value when clicked. */
  let {
    cell,
    children,
    table,
    ...rest
  }: {
    cell: MRT_Cell<TData>;
    children?: Snippet;
    table: MRT_TableInstance<TData>;
    [key: string]: any;
  } = $props();

  const column = $derived(cell.column);
  const { localization } = $derived(table.options);

  const buttonProps = $derived.by(() => {
    const context = { cell, column, row: cell.row, table };
    return {
      ...parseFromValuesOrFunc(table.options.copyButtonProps, context),
      ...parseFromValuesOrFunc(column.columnDef.copyButtonProps, context),
      ...rest,
    };
  });

  let copied = $state(false);
  let timeout: ReturnType<typeof setTimeout> | undefined;

  function handleCopy(event: MouseEvent) {
    event.stopPropagation();
    navigator.clipboard.writeText(cell.getValue() as string);
    copied = true;
    clearTimeout(timeout);
    timeout = setTimeout(() => (copied = false), 4000);
    buttonProps.onclick?.(event);
  }

  $effect(() => () => clearTimeout(timeout));
</script>

<button
  class="mrt-copy-button"
  title={buttonProps.title ??
    (copied ? localization.copiedToClipboard : localization.clickToCopy)}
  type="button"
  {...buttonProps}
  onclick={handleCopy}
>
  {@render children?.()}
</button>

<style>
  .mrt-copy-button {
    background-color: transparent;
    border: none;
    color: inherit;
    cursor: copy;
    font-family: inherit;
    font-size: inherit;
    letter-spacing: inherit;
    margin: -0.25rem;
    min-width: unset;
    padding: 0 0.5rem;
    text-align: inherit;
    text-transform: inherit;
  }
</style>
