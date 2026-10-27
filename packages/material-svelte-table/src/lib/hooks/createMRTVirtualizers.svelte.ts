import { getContext, setContext, untrack } from 'svelte';
import {
  type MRT_ColumnVirtualizer,
  type MRT_Row,
  type MRT_RowData,
  type MRT_RowVirtualizer,
  type MRT_TableInstance,
} from '../types';
import { parseFromValuesOrFunc } from '../utils/utils';
import { extraIndexRangeExtractor } from '../utils/virtualization.utils';
import { createVirtualizer } from './createVirtualizer.svelte';

/**
 * Virtualizes table rows. Returns `undefined` unless `enableRowVirtualization`
 * is set (it cannot be changed after the table is created).
 */
export function createRowVirtualizer<TData extends MRT_RowData>(
  table: MRT_TableInstance<TData>,
  getRows: () => MRT_Row<TData>[],
) {
  if (!table.options.enableRowVirtualization) return undefined;

  const draggingRowIndex = $derived.by(() => {
    const id = table.mrtState.draggingRow?.id;
    return id ? getRows().findIndex((r) => r.id === id) : undefined;
  });

  const virtualizer = createVirtualizer<HTMLDivElement, HTMLTableRowElement>(
    () => {
      const { density } = table.mrtState;
      const hasDetailPanel = !!table.options.detailPanel;
      const rowCount = getRows().length;
      const normalRowHeight =
        density === 'compact' ? 37 : density === 'comfortable' ? 58 : 73;
      const expanded = table.atoms.expanded.get();
      const index = draggingRowIndex;
      return {
        count: hasDetailPanel ? rowCount * 2 : rowCount,
        estimateSize: (i: number) =>
          hasDetailPanel && i % 2 === 1
            ? expanded === true
              ? 100
              : 0
            : normalRowHeight,
        getScrollElement: () => table.refs.tableContainerRef.current,
        measureElement:
          typeof window !== 'undefined' &&
          navigator.userAgent.indexOf('Firefox') === -1
            ? (element: Element) => element?.getBoundingClientRect().height
            : undefined,
        overscan: 4,
        rangeExtractor: (range) => extraIndexRangeExtractor(range, index),
        ...parseFromValuesOrFunc(table.options.rowVirtualizerOptions, { table }),
      };
    },
  );

  // `virtualRows` is read lazily, so it is always current
  const instance = untrack(() => virtualizer.instance) as unknown as MRT_RowVirtualizer;
  Object.defineProperty(instance, 'virtualRows', {
    configurable: true,
    get: () => instance.getVirtualItems(),
  });

  // hand the virtualizer to the user's ref (the table's own `options` is a
  // reactive copy, so go through the options exactly as they were passed)
  $effect(() => {
    const ref = table.userOptions.rowVirtualizerInstanceRef;
    if (ref) ref.current = instance;
    return () => {
      if (ref && ref.current === instance) ref.current = null;
    };
  });

  return {
    /** The virtualizer; reading it subscribes to scrolling and measuring. */
    get instance() {
      return virtualizer.instance as unknown as MRT_RowVirtualizer;
    },
    get virtualRows() {
      return (virtualizer.instance as unknown as MRT_RowVirtualizer).virtualRows;
    },
  };
}

/**
 * Virtualizes table columns. Returns `undefined` unless
 * `enableColumnVirtualization` is set.
 */
export function createColumnVirtualizer<TData extends MRT_RowData>(
  table: MRT_TableInstance<TData>,
) {
  if (!table.options.enableColumnVirtualization) return undefined;

  const visibleColumns = $derived(table.getVisibleLeafColumns());

  const pinnedIndexes = $derived.by(() => {
    if (!table.options.enableColumnPinning) return [[], []] as [number[], number[]];
    table.atoms.columnPinning.get();
    return [
      table.getStartVisibleLeafColumns().map((c) => c.getPinnedIndex()),
      table
        .getEndVisibleLeafColumns()
        .map((column) => visibleColumns.length - column.getPinnedIndex() - 1)
        .sort((a, b) => a - b),
    ] as [number[], number[]];
  });

  const draggingColumnIndex = $derived.by(() => {
    const id = table.mrtState.draggingColumn?.id;
    return id ? visibleColumns.findIndex((c) => c.id === id) : undefined;
  });

  const virtualizer = createVirtualizer<HTMLDivElement, HTMLTableCellElement>(
    () => {
      const [startIndexes, endIndexes] = pinnedIndexes;
      const dragIndex = draggingColumnIndex;
      const columns = visibleColumns;
      return {
        count: columns.length,
        estimateSize: (index: number) => columns[index].getSize(),
        getScrollElement: () => table.refs.tableContainerRef.current,
        horizontal: true,
        overscan: 3,
        rangeExtractor: (range) => {
          const newIndexes = extraIndexRangeExtractor(range, dragIndex);
          if (!startIndexes.length && !endIndexes.length) return newIndexes;
          return [...new Set([...startIndexes, ...newIndexes, ...endIndexes])];
        },
        ...parseFromValuesOrFunc(table.options.columnVirtualizerOptions, { table }),
      };
    },
  );

  /** Space taken by the columns scrolled out of view, on each side. */
  const padding = (instance: MRT_ColumnVirtualizer) => {
    const [startIndexes, endIndexes] = pinnedIndexes;
    const virtualColumns = instance.getVirtualItems();
    const numColumns = virtualColumns.length;
    if (!numColumns) return { end: 0, start: 0 };
    const numPinnedStart = startIndexes.length;
    const numPinnedEnd = endIndexes.length;
    const totalSize = instance.getTotalSize();

    const startNonPinnedStart = virtualColumns[numPinnedStart]?.start || 0;
    const startNonPinnedEnd = virtualColumns[numPinnedStart - 1]?.end || 0;
    const endNonPinnedStart = virtualColumns[numColumns - numPinnedEnd]?.start || 0;
    const endNonPinnedEnd = virtualColumns[numColumns - numPinnedEnd - 1]?.end || 0;

    return {
      end:
        totalSize -
        endNonPinnedEnd -
        (numPinnedEnd ? totalSize - endNonPinnedStart : 0),
      start: startNonPinnedStart - startNonPinnedEnd,
    };
  };

  const instance = untrack(() => virtualizer.instance) as unknown as MRT_ColumnVirtualizer;
  Object.defineProperties(instance, {
    virtualColumns: { configurable: true, get: () => instance.getVirtualItems() },
    virtualPaddingLeft: { configurable: true, get: () => padding(instance).start },
    virtualPaddingRight: { configurable: true, get: () => padding(instance).end },
  });

  $effect(() => {
    const ref = table.userOptions.columnVirtualizerInstanceRef;
    if (ref) ref.current = instance;
    return () => {
      if (ref && ref.current === instance) ref.current = null;
    };
  });

  return {
    /** The virtualizer; reading it subscribes to scrolling and measuring. */
    get instance() {
      return virtualizer.instance as unknown as MRT_ColumnVirtualizer;
    },
  };
}

export type ColumnVirtualizerHandle = ReturnType<typeof createColumnVirtualizer>;

const COLUMN_VIRTUALIZER = Symbol('mrt-column-virtualizer');

/** Shares the column virtualizer with the head, body and footer rows. */
export const provideColumnVirtualizer = (handle: ColumnVirtualizerHandle) =>
  setContext(COLUMN_VIRTUALIZER, handle);

export const useColumnVirtualizer = (): ColumnVirtualizerHandle =>
  getContext<ColumnVirtualizerHandle>(COLUMN_VIRTUALIZER);
