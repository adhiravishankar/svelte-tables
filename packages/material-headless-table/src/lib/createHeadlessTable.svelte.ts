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
  HeadlessColumnDef,
  HeadlessTableInstance,
  HeadlessTableOptions,
  HeadlessTableState,
  RowData,
} from './types';

export const DEFAULT_PAGE_SIZES = [10, 25, 50, 100];

const includesText = ({ filterValue, value }: { filterValue: unknown; value: unknown }) =>
  String(value ?? '')
    .toLowerCase()
    .includes(String(filterValue).toLowerCase());

const equals = ({ filterValue, value }: { filterValue: unknown; value: unknown }) =>
  String(value) === String(filterValue);

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

/** The distinct values of a column, as options for a `select` filter. */
export function getSelectOptions<TData extends RowData>(
  column: HeadlessColumnDef<TData>,
  data: TData[],
): FilterOption[] {
  if (column.filterOptions) return column.filterOptions;
  const read =
    typeof column.accessor === 'function'
      ? column.accessor
      : (row: TData) => row[column.accessor as keyof TData];
  const values = new Set<string | number | boolean>();
  for (const row of data) {
    const value = read(row);
    if (value !== undefined && value !== null && value !== '') values.add(value);
  }
  return [...values]
    .sort((a, b) => String(a).localeCompare(String(b), undefined, { numeric: true }))
    .map((value) => ({ label: String(value), value }));
}

/**
 * Creates a table on top of Svelte Headless Table. It must be called while a
 * component is initializing. `options` is a getter so that `data` (and the
 * other reactive options) can change; the columns and the set of enabled
 * features are read once, when the table is created.
 *
 * Every feature is a Svelte Headless Table plugin: sort, column filters,
 * table filter, group by, expanded rows, column order, hidden columns,
 * resized columns, selected rows and pagination.
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
  const groupable = !!initial.enableGrouping;
  const columnDefs = initial.columns;
  const getRowId = initial.getRowId;

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
      fn: includesText,
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

  return {
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
        density,
        globalFilter: searchable ? (states.search.filterValue.current as string) : '',
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
      return vm.current.visibleColumns;
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
    setColumnOrder(order) {
      if (orderable) states.order.columnIdOrder.current = order;
    },
    moveColumn(id, beforeId) {
      if (!orderable || id === beforeId) return;
      const current: string[] = states.order.columnIdOrder.current.length
        ? [...states.order.columnIdOrder.current]
        : columnDefs.map(getColumnId);
      const from = current.indexOf(id);
      const to = current.indexOf(beforeId);
      if (from === -1 || to === -1) return;
      // dragging right drops after the target, dragging left drops before it
      const without = current.filter((columnId) => columnId !== id);
      without.splice(without.indexOf(beforeId) + (from < to ? 1 : 0), 0, id);
      states.order.columnIdOrder.current = without;
    },
    toggleGrouping(id) {
      if (groupable) states.group.groupByIds.toggle(id);
    },
    isGrouped(id) {
      return groupable && states.group.groupByIds.has(id);
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
    resetFilters() {
      if (filterable) states.filter.filterValues.current = {};
      if (searchable) states.search.filterValue.current = '';
    },
  };
}
