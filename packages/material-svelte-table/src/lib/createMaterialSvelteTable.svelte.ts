import { untrack } from 'svelte';
import { createTable, functionalUpdate } from '@tanstack/svelte-table';
import { createMRTFeatures } from './features';
import { createTableId, defineTableOptions } from './tableOptions';
import {
  type MRT_Cell,
  type MRT_Column,
  type MRT_ColumnDef,
  type MRT_ColumnFilterFnsState,
  type MRT_DefinedTableOptions,
  type MRT_DensityState,
  type MRT_FilterOption,
  type MRT_Ref,
  type MRT_Row,
  type MRT_RowData,
  type MRT_SortingState,
  type MRT_StatefulTableOptions,
  type MRT_TableInstance,
  type MRT_TableOptions,
  type MRT_TableState,
  type MRT_Updater,
} from './types';
import {
  getAllLeafColumnDefs,
  getColumnId,
  getDefaultColumnFilterFn,
  prepareColumns,
} from './utils/column.utils';
import { getDisplayColumnDefs } from './utils/displayColumnDefs';
import { getDefaultColumnOrderIds } from './utils/displayColumn.utils';
import { getCanRankRows } from './utils/row.utils';
import { createRow } from './utils/tanstack.helpers';

/** State that MRT owns itself; everything else belongs to TanStack Table. */
const MRT_STATE_KEYS = [
  'actionCell',
  'columnFilterFns',
  'creatingRow',
  'density',
  'draggingColumn',
  'draggingRow',
  'editingCell',
  'editingRow',
  'globalFilterFn',
  'hoveredColumn',
  'hoveredRow',
  'isFullScreen',
  'isLoading',
  'isSaving',
  'showAlertBanner',
  'showColumnFilters',
  'showGlobalFilter',
  'showLoadingOverlay',
  'showProgressBars',
  'showSkeletons',
  'showToolbarDropZone',
] as const;

type MRT_StateKey = (typeof MRT_STATE_KEYS)[number];
const MRT_STATE_KEY_SET = new Set<string>(MRT_STATE_KEYS);

/** Options that are derived by this module instead of forwarded as-is. */
const OVERRIDDEN_OPTION_KEYS = new Set([
  'columns',
  'data',
  'features',
  'globalFilterFn',
  'initialState',
  'state',
]);

const omitMrtState = (state: Record<string, any> | undefined) => {
  const out: Record<string, any> = {};
  if (!state) return out;
  for (const key of Object.keys(state)) {
    if (!MRT_STATE_KEY_SET.has(key)) {
      // keep getters lazy so controlled state stays reactive
      Object.defineProperty(out, key, {
        enumerable: true,
        get: () => state[key],
      });
    }
  }
  return out;
};

/**
 * Creates a Material Svelte Table instance. This is the Svelte 5 counterpart of
 * `useMaterialReactTable`.
 *
 * It must be called while a component is initializing (it registers effects),
 * and reactive options such as `data` and `state` must be passed as getters or
 * read from `$state`:
 *
 * ```ts
 * let data = $state(initialData);
 * const table = createMaterialSvelteTable({
 *   columns,
 *   get data() { return data },
 * });
 * ```
 *
 * The set of option keys is read once at creation; options that are absent
 * then cannot be added later (give them a value, even `undefined`, up front).
 */
export function createMaterialSvelteTable<TData extends MRT_RowData>(
  options: MRT_TableOptions<TData>,
): MRT_TableInstance<TData> {
  const id = createTableId();
  const features = createMRTFeatures({
    aggregationFns: options.aggregationFns,
    filterFns: options.filterFns,
    sortFns: options.sortFns,
  });

  // `table` is set once created; `$state.raw` lets column and data derivations
  // re-run once TanStack state becomes readable.
  let table = $state.raw<MRT_TableInstance<TData> | undefined>(undefined);

  // modes that name a registered filter function; anything else (a custom
  // function on the column) is left untouched
  const filterFnNames = new Set(Object.keys(features.filterFns ?? {}));

  const defined = $derived.by(() => defineTableOptions(options, id));

  // ---------------------------------------------------------------------------
  // MRT-owned state
  // ---------------------------------------------------------------------------
  const initialMrtState = untrack(() => {
    const initialState = (options.initialState ?? {}) as Partial<
      MRT_TableState<TData>
    >;
    const leafColumnDefs = getAllLeafColumnDefs(
      options.columns as MRT_ColumnDef<TData>[],
    );
    const columnFilterFns: MRT_ColumnFilterFnsState = Object.assign(
      {},
      ...leafColumnDefs.map((col) => ({
        [getColumnId(col)]:
          col.filterFn instanceof Function
            ? ((col.filterFn as Function).name ?? 'custom')
            : (col.filterFn ??
              initialState.columnFilterFns?.[getColumnId(col)] ??
              getDefaultColumnFilterFn(col)),
      })),
    );
    return {
      actionCell: initialState.actionCell ?? null,
      columnFilterFns,
      creatingRow: initialState.creatingRow ?? null,
      density: initialState.density ?? 'comfortable',
      draggingColumn: initialState.draggingColumn ?? null,
      draggingRow: initialState.draggingRow ?? null,
      editingCell: initialState.editingCell ?? null,
      editingRow: initialState.editingRow ?? null,
      globalFilterFn:
        initialState.globalFilterFn ?? options.globalFilterFn ?? 'fuzzy',
      hoveredColumn: initialState.hoveredColumn ?? null,
      hoveredRow: initialState.hoveredRow ?? null,
      isFullScreen: initialState.isFullScreen ?? false,
      showAlertBanner: initialState.showAlertBanner ?? false,
      showColumnFilters: initialState.showColumnFilters ?? false,
      showGlobalFilter: initialState.showGlobalFilter ?? false,
      showToolbarDropZone: initialState.showToolbarDropZone ?? false,
    } as Pick<MRT_TableState<TData>, MRT_StateKey>; // loading flags stay undefined: an explicit false disables them
  });

  // Row, column and cell objects must not be deep-proxied, so the record is
  // replaced as a whole on every change.
  let internalState = $state.raw(initialMrtState);

  /**
   * The effective MRT state: controlled values from the `state` option win over
   * internal state. Reads are reactive.
   */
  const mrtState = {} as Pick<MRT_TableState<TData>, MRT_StateKey>;
  for (const key of MRT_STATE_KEYS) {
    Object.defineProperty(mrtState, key, {
      enumerable: true,
      get: () => {
        const controlled = options.state as Record<string, any> | undefined;
        return controlled && key in controlled
          ? controlled[key]
          : internalState[key];
      },
    });
  }

  const makeSetter =
    <K extends MRT_StateKey>(
      key: K,
      getHandler: () => ((updater: any) => void) | undefined,
    ) =>
    (updater: MRT_Updater<(typeof internalState)[K]>) => {
      const handler = getHandler();
      if (handler) {
        handler(updater);
      } else {
        internalState = {
          ...internalState,
          [key]: functionalUpdate(updater, internalState[key]),
        };
      }
    };

  // ---------------------------------------------------------------------------
  // Initial TanStack state, with a proper column order
  // ---------------------------------------------------------------------------
  const getStatefulOptions = (): MRT_StatefulTableOptions<TData> => {
    const tanstackState = {
      columnOrder:
        table?.atoms.columnOrder.get() ??
        (options.state?.columnOrder as string[] | undefined) ??
        options.initialState?.columnOrder ??
        [],
      columnResizing:
        table?.atoms.columnResizing.get() ??
        options.state?.columnResizing ??
        options.initialState?.columnResizing ??
        {},
      grouping:
        table?.atoms.grouping.get() ??
        options.state?.grouping ??
        options.initialState?.grouping ??
        [],
      pagination:
        table?.atoms.pagination.get() ??
        options.state?.pagination ??
        options.initialState?.pagination ?? { pageIndex: 0, pageSize: 10 },
    };
    return {
      ...defined,
      state: { ...mrtState, ...tanstackState },
    } as unknown as MRT_StatefulTableOptions<TData>;
  };

  const initialState = untrack(() => {
    const base: Record<string, any> = omitMrtState(options.initialState);
    base.columnOrder =
      base.columnOrder ??
      getDefaultColumnOrderIds({
        ...getStatefulOptions(),
        columns: options.columns as MRT_ColumnDef<TData>[],
      } as MRT_StatefulTableOptions<TData>);
    return base;
  });

  // ---------------------------------------------------------------------------
  // Derived columns and data
  // ---------------------------------------------------------------------------
  // don't recompute column defs while resizing a column or dragging a column/row
  let lastColumns: MRT_ColumnDef<TData>[] = [];

  // Only state that changes the column *definitions* may invalidate `columns`.
  // Anything else (hover, editing, density, ...) would give TanStack new
  // columns, and TanStack Table v9 then rebuilds every row, discarding values
  // being edited. These are tracked as primitives so they only change when the
  // definitions really do.
  const groupingKey = $derived(
    JSON.stringify(
      table?.atoms.grouping.get() ??
        options.state?.grouping ??
        options.initialState?.grouping ??
        [],
    ),
  );
  const filterFnsKey = $derived(JSON.stringify(mrtState.columnFilterFns));
  const hasCreatingRow = $derived(!!mrtState.creatingRow);
  const isColumnsFrozen = $derived(
    !!(
      table?.atoms.columnResizing.get().isResizingColumn ||
      mrtState.draggingColumn ||
      mrtState.draggingRow
    ),
  );

  const columns = $derived.by(() => {
    void groupingKey;
    void filterFnsKey;
    void hasCreatingRow;
    void defined;
    if (isColumnsFrozen) return lastColumns;
    const stateful = untrack(() => getStatefulOptions());
    const { leading, trailing } = getDisplayColumnDefs(stateful);
    lastColumns = prepareColumns({
      columnDefs: [...leading, ...stateful.columns, ...trailing],
      filterFnNames,
      tableOptions: stateful,
    });
    return lastColumns;
  });

  // if loading, generate blank rows to show skeleton loaders
  const data = $derived.by(() => {
    const { data: rows } = defined;
    const { isLoading, showSkeletons } = mrtState;
    if ((isLoading || showSkeletons) && !rows.length) {
      const leafColumnDefs = getAllLeafColumnDefs(columns);
      const pageSize = table?.atoms.pagination.get().pageSize ?? 10;
      return Array.from({ length: Math.min(pageSize, 20) }, () =>
        Object.assign(
          {},
          ...leafColumnDefs.map((col) => ({ [getColumnId(col)]: null })),
        ),
      ) as TData[];
    }
    return rows;
  });

  // ---------------------------------------------------------------------------
  // TanStack table
  // ---------------------------------------------------------------------------
  const tableOptions: Record<string, any> = { features, initialState };
  const optionKeys = new Set([
    ...Object.keys(untrack(() => defined)),
    ...Object.keys(options),
  ]);
  for (const key of optionKeys) {
    if (OVERRIDDEN_OPTION_KEYS.has(key)) continue;
    Object.defineProperty(tableOptions, key, {
      enumerable: true,
      get: () => (defined as Record<string, any>)[key],
    });
  }
  Object.defineProperties(tableOptions, {
    columns: { enumerable: true, get: () => columns },
    data: { enumerable: true, get: () => data },
    globalFilterFn: {
      enumerable: true,
      get: () => (mrtState.globalFilterFn as string | undefined) ?? 'fuzzy',
    },
    state: {
      enumerable: true,
      get: () => omitMrtState(options.state as Record<string, any>),
    },
  });

  const instance = createTable(
    tableOptions as any,
  ) as unknown as MRT_TableInstance<TData>;

  // ---------------------------------------------------------------------------
  // MRT additions to the instance
  // ---------------------------------------------------------------------------
  const ref = <T>(): MRT_Ref<T> => ({ current: null });
  instance.refs = {
    actionCellRef: ref(),
    bottomToolbarRef: ref(),
    editInputRefs: ref(),
    filterInputRefs: ref(),
    lastSelectedRowId: ref(),
    searchInputRef: ref(),
    tableContainerRef: ref(),
    tableFooterRef: ref(),
    tableHeadCellRefs: ref(),
    tableHeadRef: ref(),
    tablePaperRef: ref(),
    topToolbarRef: ref(),
  };
  // these are mutated by components through `bind:this`, never reassigned
  instance.refs.editInputRefs.current = {};
  instance.refs.filterInputRefs.current = {};
  instance.refs.tableHeadCellRefs.current = {};

  Object.defineProperty(instance, 'mrtState', {
    enumerable: true,
    get: () => mrtState,
  });

  const opts = () => defined as MRT_DefinedTableOptions<TData>;
  instance.setActionCell = makeSetter('actionCell', () => opts().onActionCellChange);
  instance.setColumnFilterFns = makeSetter(
    'columnFilterFns',
    () => opts().onColumnFilterFnsChange,
  );
  instance.setCreatingRow = (row: MRT_Updater<MRT_Row<TData> | null | true>) => {
    const next = (row === true ? createRow(instance) : row) as MRT_Row<TData> | null;
    const handler = opts().onCreatingRowChange;
    if (handler) {
      handler(next);
    } else {
      internalState = { ...internalState, creatingRow: next };
    }
  };
  instance.setDensity = makeSetter('density', () => opts().onDensityChange);
  instance.setDraggingColumn = makeSetter(
    'draggingColumn',
    () => opts().onDraggingColumnChange,
  );
  instance.setDraggingRow = makeSetter('draggingRow', () => opts().onDraggingRowChange);
  instance.setEditingCell = makeSetter('editingCell', () => opts().onEditingCellChange);
  instance.setEditingRow = makeSetter('editingRow', () => opts().onEditingRowChange);
  instance.setGlobalFilterFn = makeSetter(
    'globalFilterFn',
    () => opts().onGlobalFilterFnChange,
  );
  instance.setHoveredColumn = makeSetter(
    'hoveredColumn',
    () => opts().onHoveredColumnChange,
  );
  instance.setHoveredRow = makeSetter('hoveredRow', () => opts().onHoveredRowChange);
  instance.setIsFullScreen = makeSetter(
    'isFullScreen',
    () => opts().onIsFullScreenChange,
  );
  instance.setShowAlertBanner = makeSetter(
    'showAlertBanner',
    () => opts().onShowAlertBannerChange,
  );
  instance.setShowColumnFilters = makeSetter(
    'showColumnFilters',
    () => opts().onShowColumnFiltersChange,
  );
  instance.setShowGlobalFilter = makeSetter(
    'showGlobalFilter',
    () => opts().onShowGlobalFilterChange,
  );
  instance.setShowToolbarDropZone = makeSetter(
    'showToolbarDropZone',
    () => opts().onShowToolbarDropZoneChange,
  );

  table = instance;

  registerEffects(instance, () => columns.length);

  return instance;
}

/** Port of `useMRT_Effects`. */
function registerEffects<TData extends MRT_RowData>(
  table: MRT_TableInstance<TData>,
  getTotalColumnCount: () => number,
) {
  let initialBodyHeight: string | null = null;
  let previousTop: number | null = null;

  $effect(() => {
    initialBodyHeight = document.body.style.height;
  });

  //hide scrollbars when table is in full screen mode, preserve body scroll position after full screen exit
  $effect(() => {
    const isFullScreen = table.mrtState.isFullScreen;
    untrack(() => {
      if (isFullScreen) {
        previousTop = document.body.getBoundingClientRect().top; //save scroll position
        document.body.style.height = '100dvh'; //hide page scrollbars when table is in full screen mode
      } else {
        document.body.style.height = initialBodyHeight ?? '';
        if (!previousTop) return;
        //restore scroll position
        window.scrollTo({ behavior: 'instant', top: -1 * previousTop });
      }
    });
  });

  //recalculate column order when columns change or features are toggled on/off
  $effect(() => {
    const totalColumnCount = getTotalColumnCount();
    untrack(() => {
      if (totalColumnCount !== table.atoms.columnOrder.get().length) {
        table.setColumnOrder(
          getDefaultColumnOrderIds({
            ...table.options,
            columns: table.options.columns,
            state: {
              ...table.mrtState,
              columnOrder: table.atoms.columnOrder.get(),
              grouping: table.atoms.grouping.get(),
            },
          } as unknown as MRT_StatefulTableOptions<TData>),
        );
      }
    });
  });

  //if page index is out of bounds, set it to the last page
  $effect(() => {
    const { enablePagination, rowCount } = table.options;
    const { isLoading, showSkeletons } = table.mrtState;
    const totalRowCount =
      rowCount ?? table.getPrePaginatedRowModel().rows.length;
    if (!enablePagination || isLoading || showSkeletons) return;
    untrack(() => {
      const { pageIndex, pageSize } = table.atoms.pagination.get();
      const totalPages = totalRowCount > 0 ? Math.ceil(totalRowCount / pageSize) : 1;
      if (pageIndex < 0 || pageIndex >= totalPages) {
        table.setPageIndex(totalPages - 1);
      }
    });
  });

  //turn off sort when global filter is looking for ranked results
  let appliedSort: MRT_SortingState = untrack(() => table.atoms.sorting.get());
  $effect(() => {
    const sorting = table.atoms.sorting.get();
    if (sorting.length) appliedSort = sorting;
  });
  $effect(() => {
    const globalFilter = table.atoms.globalFilter.get();
    untrack(() => {
      if (!getCanRankRows(table)) return;
      if (globalFilter) {
        table.setSorting([]);
      } else {
        table.setSorting(() => appliedSort || []);
      }
    });
  });
}
