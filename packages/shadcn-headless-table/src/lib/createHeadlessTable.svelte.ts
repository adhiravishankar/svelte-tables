import {
  createSnippetRender,
  createTable,
} from '@humanspeak/svelte-headless-table';
import {
  addColumnFilters,
  addColumnOrder,
  addExpandedRows,
  addGroupBy,
  addHiddenColumns,
  addPagination,
  addResizedColumns,
  addSelectedRows,
  addSortBy,
  addTableFilter,
  numberRangeFilter,
} from '@humanspeak/svelte-headless-table/plugins';
import { untrack } from 'svelte';
import type {
  AggregateFn,
  Density,
  FilterOption,
  GlobalFilterMode,
  HeadlessColumnDef,
  HeadlessTableInstance,
  HeadlessTableOptions,
  HeadlessTableState,
  Pin,
  RowData,
} from './types';
import { EXPAND_COLUMN_WIDTH, SELECT_COLUMN_WIDTH } from './utils/cell';

export const DEFAULT_PAGE_SIZES = [10, 25, 50, 100];

const includesText = ({ filterValue, value }: { filterValue: unknown; value: unknown }) =>
  String(value ?? '')
    .toLowerCase()
    .includes(String(filterValue).toLowerCase());

const equals = ({ filterValue, value }: { filterValue: unknown; value: unknown }) =>
  String(value) === String(filterValue);

/** The letters of `query` appear in `text`, in order. */
export const fuzzyMatch = (text: string, query: string) => {
  const haystack = text.toLowerCase();
  let from = 0;
  for (const letter of query.toLowerCase()) {
    from = haystack.indexOf(letter, from);
    if (from === -1) return false;
    from += 1;
  }
  return true;
};

const matchers: Record<GlobalFilterMode, (text: string, query: string) => boolean> = {
  contains: (text, query) => text.toLowerCase().includes(query.toLowerCase()),
  fuzzy: fuzzyMatch,
  startsWith: (text, query) => text.toLowerCase().startsWith(query.toLowerCase()),
};

const aggregators: Record<string, (values: any[]) => unknown> = {
  count: (values) => values.length,
  max: (values) => Math.max(...values.map(Number)),
  mean: (values) => values.reduce((sum, value) => sum + Number(value), 0) / (values.length || 1),
  min: (values) => Math.min(...values.map(Number)),
  sum: (values) => values.reduce((sum, value) => sum + Number(value), 0),
};
const getAggregator = (aggregate: AggregateFn) =>
  typeof aggregate === 'function' ? aggregate : aggregators[aggregate];

export const getColumnId = <TData extends RowData>(column: HeadlessColumnDef<TData>) =>
  column.id ?? String(column.accessor);

const readValue = <TData extends RowData>(column: HeadlessColumnDef<TData>, row: TData) =>
  typeof column.accessor === 'function'
    ? column.accessor(row)
    : row[column.accessor as keyof TData];

/** The distinct values of a column, as options for a select. */
export function getSelectOptions<TData extends RowData>(
  column: HeadlessColumnDef<TData>,
  data: TData[],
  options: { counts?: boolean; explicit?: FilterOption[] } = {},
): FilterOption[] {
  if (options.explicit) return options.explicit;
  const counts = new Map<string | number | boolean, number>();
  for (const row of data) {
    const value = readValue(column, row);
    if (value !== undefined && value !== null && value !== '') {
      counts.set(value, (counts.get(value) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .sort(([a], [b]) => String(a).localeCompare(String(b), undefined, { numeric: true }))
    .map(([value, count]) => ({
      label: options.counts ? `${value} (${count})` : String(value),
      value,
    }));
}

/**
 * Creates a table on top of Svelte Headless Table. It must be called while a
 * component is initializing. `options` is a getter so that `data` (and the
 * other reactive options) can change; the columns and the set of enabled
 * features are read once, when the table is created.
 */
export function createHeadlessTable<TData extends RowData>(
  getOptions: () => HeadlessTableOptions<TData>,
): HeadlessTableInstance<TData> {
  const initial = untrack(getOptions);
  const initialState = initial.initialState ?? {};
  const virtualized = !!initial.enableVirtualization;
  const paginated = initial.enablePagination !== false && !virtualized;
  const sortable = initial.enableSorting !== false;
  const filterable = !!initial.enableColumnFilters;
  const searchable = initial.enableGlobalFilter !== false;
  const selectable = !!initial.enableRowSelection;
  const resizable = !!initial.enableColumnResizing;
  const orderable = !!initial.enableColumnOrdering;
  const pinnable = !!initial.enableColumnPinning;
  const groupable = !!initial.enableGrouping;
  const editable = !!initial.enableEditing;
  const columnDefs = initial.columns;
  const getRowId = initial.getRowId;
  const defById = Object.fromEntries(columnDefs.map((def) => [getColumnId(def), def]));
  const leadingWidth =
    (selectable ? SELECT_COLUMN_WIDTH : 0) + (initial.renderDetailPanel ? EXPAND_COLUMN_WIDTH : 0);

  let globalMode = $state<GlobalFilterMode>(
    initialState.globalFilterMode ?? 'contains',
  );

  const plugins: Record<string, any> = {};
  if (sortable) {
    plugins.sort = addSortBy({
      disableMultiSort: initial.enableMultiSort === false,
      initialSortKeys: (initialState.sorting ?? []).map(({ desc, id }) => ({
        id,
        order: desc ? 'desc' : 'asc',
      })),
    });
  }
  if (filterable) plugins.filter = addColumnFilters();
  if (searchable) {
    plugins.search = addTableFilter({
      fn: ({ filterValue, value }) => matchers[globalMode](value, filterValue),
      initialFilterValue: initialState.globalFilter ?? '',
    });
  }
  if (groupable) {
    plugins.group = addGroupBy({ initialGroupByIds: initialState.grouping ?? [] });
    plugins.expand = addExpandedRows();
  }
  if (orderable) {
    plugins.order = addColumnOrder({ initialColumnIdOrder: initialState.columnOrder ?? [] });
  }
  plugins.hide = addHiddenColumns({
    initialHiddenColumnIds: initialState.hiddenColumns ?? [],
  });
  if (resizable) plugins.resize = addResizedColumns();
  if (selectable) {
    plugins.select = addSelectedRows({
      initialSelectedDataIds: Object.fromEntries(
        (initialState.selectedRows ?? []).map((id) => [id, true]),
      ),
    });
  }
  if (paginated) {
    plugins.page = addPagination({
      initialPageIndex: initialState.pageIndex ?? 0,
      initialPageSize: initialState.pageSize ?? initial.pageSizes?.[0] ?? DEFAULT_PAGE_SIZES[0],
    });
  }

  const table = createTable<TData, any>(() => getOptions().data, plugins);

  const columns = table.createColumns(
    columnDefs.map((def) => {
      const id = getColumnId(def);
      const columnPlugins: Record<string, any> = {};
      if (sortable) {
        columnPlugins.sort = {
          disable: def.enableSorting === false,
          getSortValue: def.sortValue,
        };
      }
      if (filterable && def.filterVariant !== false) {
        const variant = def.filterVariant ?? 'text';
        columnPlugins.filter = {
          fn:
            variant === 'range'
              ? numberRangeFilter
              : variant === 'text'
                ? includesText
                : equals,
          initialFilterValue: initialState.columnFilters?.[id],
        };
      }
      if (searchable) {
        columnPlugins.search = {
          exclude: def.enableGlobalFilter === false,
          getFilterValue: def.searchValue,
        };
      }
      if (groupable) {
        const aggregator = def.aggregate ? getAggregator(def.aggregate) : undefined;
        columnPlugins.group = {
          disable: def.enableGrouping === false,
          getAggregateValue: aggregator,
          cell: aggregator
            ? ({ value }: any) => (def.aggregateFormat ? def.aggregateFormat(value) : String(value))
            : undefined,
        };
      }
      if (resizable) {
        columnPlugins.resize = {
          disable: def.enableResizing === false,
          initialWidth: def.width,
          maxWidth: def.maxWidth,
          minWidth: def.minWidth,
        };
      }
      return table.column({
        accessor: def.accessor as any,
        id,
        header: def.header,
        footer: def.footer,
        cell: def.cell
          ? ({ row, value }: any) =>
              createSnippetRender(def.cell!, {
                row: row.original,
                rowId: row.dataId,
                value,
              })
          : undefined,
        plugins: columnPlugins,
      } as any);
    }),
  );

  const vm = table.createViewModel(columns, {
    rowDataId: getRowId ? (item, index) => getRowId(item as TData, index) : undefined,
  });
  const states = vm.pluginStates as Record<string, any>;

  let density = $state<Density>(initialState.density ?? 'comfortable');
  let expanded = $state<Record<string, boolean>>(
    Object.fromEntries((initialState.expandedRows ?? []).map((id) => [id, true])),
  );
  let pinning = $state<{ end: string[]; start: string[] }>({
    end: [...(initialState.columnPinning?.end ?? [])],
    start: [...(initialState.columnPinning?.start ?? [])],
  });
  let widths = $state<Record<string, number>>({});
  let editing = $state<{ columnId?: string; rowId: string } | null>(initialState.editing ?? null);
  let draft = $state<Record<string, unknown>>({});
  let saving = $state(false);

  const allRows = $derived(vm.current.rows);
  const rows = $derived(paginated ? vm.current.pageRows : vm.current.rows);
  const dataRows = $derived(allRows.filter((row: any) => row.isData()));

  const selectedIds = $derived<string[]>(
    selectable
      ? Object.entries(states.select.selectedDataIds.current as Record<string, boolean>)
          .filter(([, selected]) => selected)
          .map(([id]) => id)
      : [],
  );
  const selectedRows = $derived(
    dataRows.filter((row: any) => selectedIds.includes(row.dataId)).map((row: any) => row.original as TData),
  );

  if (selectable && initial.onSelectionChange) {
    let first = true;
    $effect(() => {
      const current = selectedRows;
      if (first) {
        first = false;
        return;
      }
      untrack(() => getOptions().onSelectionChange?.(current));
    });
  }

  /** The ids of every column, in the order they are shown, ignoring hidden ones. */
  const orderedIds = $derived<string[]>(vm.current.visibleColumns.map((column: any) => column.id));
  const pinOf = (id: string): Pin | undefined =>
    pinning.start.includes(id) ? 'start' : pinning.end.includes(id) ? 'end' : undefined;

  /** Pinned columns first or last, the rest in their order. */
  const arranged = $derived.by(() => {
    const start = pinning.start.filter((id) => orderedIds.includes(id));
    const end = pinning.end.filter((id) => orderedIds.includes(id));
    const middle = orderedIds.filter((id) => !start.includes(id) && !end.includes(id));
    return [...start, ...middle, ...end];
  });

  const instance: HeadlessTableInstance<TData> = {
    get viewModel() {
      return vm;
    },
    get columns() {
      return columnDefs;
    },
    get state() {
      return {
        columnFilters: filterable ? { ...states.filter.filterValues.current } : {},
        columnOrder: orderable ? [...states.order.columnIdOrder.current] : [],
        columnPinning: { end: [...pinning.end], start: [...pinning.start] },
        density,
        editing,
        expandedRows: Object.keys(expanded).filter((id) => expanded[id]),
        globalFilter: searchable ? (states.search.filterValue.current as string) : '',
        globalFilterMode: globalMode,
        grouping: groupable ? [...states.group.groupByIds.current] : [],
        hiddenColumns: [...states.hide.hiddenColumnIds.current],
        pageIndex: paginated ? states.page.pageIndex.current : 0,
        pageSize: paginated ? states.page.pageSize.current : allRows.length,
        selectedRows: selectedIds,
        sorting: sortable
          ? (states.sort.sortKeys.current as { id: string; order: string }[]).map(({ id, order }) => ({
              desc: order === 'desc',
              id,
            }))
          : [],
      } satisfies HeadlessTableState;
    },
    get rows() {
      return rows;
    },
    get filteredRows() {
      return allRows;
    },
    get visibleColumns() {
      return arranged.map((id) => vm.current.visibleColumns.find((column: any) => column.id === id));
    },
    get pageCount() {
      return paginated ? states.page.pageCount.current : 1;
    },
    get selectedRows() {
      return selectedRows;
    },
    get allSelected() {
      return selectable && dataRows.length > 0 && selectedIds.length >= dataRows.length;
    },
    get someSelected() {
      return selectedIds.length > 0 && !(selectable && selectedIds.length >= dataRows.length);
    },
    get draft() {
      return draft;
    },
    get isSaving() {
      return saving;
    },

    arrange(items) {
      const position = new Map(arranged.map((id, index) => [id, index]));
      return [...items].sort((a, b) => (position.get(a.id) ?? 0) - (position.get(b.id) ?? 0));
    },
    setSorting(id, event) {
      if (!sortable) return;
      states.sort.sortKeys.toggleId(id, {
        multiSort: event ? (event as MouseEvent).shiftKey : false,
      });
    },
    clearSorting(id) {
      if (sortable) states.sort.sortKeys.clearId(id);
    },
    sortOrder(id) {
      return sortable
        ? states.sort.sortKeys.current.find((key: { id: string }) => key.id === id)?.order
        : undefined;
    },
    setColumnFilter(id, value) {
      if (!filterable) return;
      const next = { ...states.filter.filterValues.current };
      if (value === undefined || value === '' || value === null) delete next[id];
      else next[id] = value;
      states.filter.filterValues.current = next;
      if (paginated) states.page.pageIndex.current = 0;
    },
    setGlobalFilter(value) {
      if (!searchable) return;
      states.search.filterValue.current = value;
      if (paginated) states.page.pageIndex.current = 0;
    },
    setGlobalFilterMode(mode) {
      globalMode = mode;
    },
    setPageIndex(index) {
      if (paginated) {
        states.page.pageIndex.current = Math.max(0, Math.min(index, states.page.pageCount.current - 1));
      }
    },
    setPageSize(size) {
      if (!paginated) return;
      states.page.pageSize.current = size;
      states.page.pageIndex.current = 0;
    },
    toggleRow(rowId, value) {
      if (!selectable) return;
      const set = states.select.selectedDataIds;
      const next = value ?? !set.has(rowId);
      if (initial.enableMultiRowSelection === false) set.clear();
      if (next) set.add(rowId);
      else set.remove(rowId);
    },
    toggleAllRows(value) {
      if (!selectable) return;
      const set = states.select.selectedDataIds;
      const next = value ?? !(dataRows.length > 0 && selectedIds.length >= dataRows.length);
      const ids = (paginated ? rows : dataRows)
        .filter((row: any) => row.isData())
        .map((row: any) => row.dataId as string);
      if (next) set.addAll(ids);
      else set.removeAll(ids);
    },
    isRowSelected(rowId) {
      return selectable && selectedIds.includes(rowId);
    },
    toggleColumn(id, visible) {
      const hidden: string[] = states.hide.hiddenColumnIds.current;
      const show = visible ?? hidden.includes(id);
      states.hide.hiddenColumnIds.current = show ? hidden.filter((h) => h !== id) : [...hidden, id];
    },
    isColumnVisible(id) {
      return !(states.hide.hiddenColumnIds.current as string[]).includes(id);
    },
    toggleExpanded(rowId, value) {
      expanded[rowId] = value ?? !expanded[rowId];
    },
    isExpanded(rowId) {
      return !!expanded[rowId];
    },
    toggleGroupRow(rowId) {
      if (groupable) states.expand.expandedIds.toggle(rowId);
    },
    isGroupExpanded(rowId) {
      return groupable && states.expand.expandedIds.has(rowId);
    },
    setDensity(next) {
      density = next;
    },
    setColumnOrder(order) {
      if (orderable) states.order.columnIdOrder.current = order;
    },
    moveColumn(id, beforeId) {
      if (!orderable || id === beforeId) return;
      const current: string[] = states.order.columnIdOrder.current.length
        ? [...states.order.columnIdOrder.current]
        : columnDefs.map(getColumnId);
      const without = current.filter((columnId) => columnId !== id);
      const index = without.indexOf(beforeId);
      if (index === -1) return;
      without.splice(index, 0, id);
      states.order.columnIdOrder.current = without;
    },
    pinColumn(id, pin) {
      if (!pinnable) return;
      pinning = {
        end: pinning.end.filter((columnId) => columnId !== id),
        start: pinning.start.filter((columnId) => columnId !== id),
      };
      if (pin) pinning[pin] = [...pinning[pin], id];
    },
    pinOf,
    toggleGrouping(id) {
      if (groupable) states.group.groupByIds.toggle(id);
    },
    isGrouped(id) {
      return groupable && states.group.groupByIds.has(id);
    },
    setColumnWidth(id, width) {
      if (widths[id] !== width) widths[id] = width;
    },
    pinOffset(id) {
      const pin = pinOf(id);
      if (pin === 'start') {
        const before = arranged.slice(0, arranged.indexOf(id));
        return leadingWidth + before.reduce((sum, columnId) => sum + (widths[columnId] ?? 0), 0);
      }
      if (pin === 'end') {
        const after = arranged.slice(arranged.indexOf(id) + 1);
        return after.reduce((sum, columnId) => sum + (widths[columnId] ?? 0), 0);
      }
      return 0;
    },
    startEditing(rowId, columnId) {
      if (!editable) return;
      const row = dataRows.find((candidate: any) => candidate.dataId === rowId) as any;
      if (!row) return;
      const ids = columnId
        ? [columnId]
        : columnDefs.map(getColumnId).filter((id) => defById[id].enableEditing !== false);
      if (columnId && defById[columnId]?.enableEditing === false) return;
      draft = Object.fromEntries(ids.map((id) => [id, readValue(defById[id], row.original)]));
      editing = { columnId, rowId };
    },
    setDraft(columnId, value) {
      draft[columnId] = value;
    },
    cancelEditing() {
      editing = null;
      draft = {};
    },
    async saveEditing() {
      const current = editing;
      if (!current) return;
      const row = dataRows.find((candidate: any) => candidate.dataId === current.rowId) as any;
      if (!row) return;
      saving = true;
      try {
        await getOptions().onEditSave?.({
          row: row.original,
          rowId: current.rowId,
          values: { ...draft },
        });
        editing = null;
        draft = {};
      } finally {
        saving = false;
      }
    },
    resetFilters() {
      if (filterable) states.filter.filterValues.current = {};
      if (searchable) states.search.filterValue.current = '';
    },
  };
  return instance;
}
