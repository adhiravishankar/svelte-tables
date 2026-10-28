import type { Snippet } from 'svelte';
import type { MRT_Localization } from './types/localization';

export type { MRT_Localization as HeadlessLocalization };

export type RowData = Record<string, any>;
export type Density = 'comfortable' | 'compact' | 'spacious';
export type FilterVariant = 'text' | 'select' | 'range' | 'checkbox';

export interface FilterOption {
  label: string;
  value: string | number | boolean;
}

export interface CellContext<TData extends RowData, TValue = unknown> {
  value: TValue;
  row: TData;
  rowId: string;
}

export interface HeadlessColumnDef<TData extends RowData, TValue = any> {
  /** The row key, or a function that reads the value. */
  accessor: keyof TData | ((row: TData) => TValue);
  /** Required when `accessor` is a function. */
  id?: string;
  header: string;
  /** Custom cell content. */
  cell?: Snippet<[CellContext<TData, TValue>]>;
  /** Text of the footer cell. Footers are shown when any column has one. */
  footer?: string;
  align?: 'center' | 'end' | 'start';
  /** Initial width in pixels. Without it, columns share the free space. */
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  enableSorting?: boolean;
  enableHiding?: boolean;
  enableResizing?: boolean;
  /** Include the column in the global search. Default `true`. */
  enableGlobalFilter?: boolean;
  /** The filter shown under the header when column filters are on. `false` hides it. */
  filterVariant?: FilterVariant | false;
  /** Options of the `select` filter. Default: the distinct values of the column. */
  filterOptions?: FilterOption[];
  /** Map the value to what is compared when sorting. */
  sortValue?: (value: TValue) => number | string;
  /** Map the value to the text that the global search looks at. */
  searchValue?: (value: TValue) => string;
}

export interface HeadlessTableState {
  sorting: { id: string; desc: boolean }[];
  columnFilters: Record<string, unknown>;
  globalFilter: string;
  pageIndex: number;
  pageSize: number;
  /** Row ids. */
  selectedRows: string[];
  hiddenColumns: string[];
  expandedRows: string[];
  density: Density;
}

export interface HeadlessTableOptions<TData extends RowData> {
  columns: HeadlessColumnDef<TData>[];
  data: TData[];
  /** A stable id for each row. Default: the row's index. */
  getRowId?: (row: TData, index: number) => string;

  enableSorting?: boolean;
  enableMultiSort?: boolean;
  /** Show a filter under each header. */
  enableColumnFilters?: boolean;
  enableGlobalFilter?: boolean;
  enablePagination?: boolean;
  enableRowSelection?: boolean;
  enableMultiRowSelection?: boolean;
  enableColumnVisibility?: boolean;
  enableColumnResizing?: boolean;
  enableDensityToggle?: boolean;
  /** Show the toolbars. Default `true`. */
  enableTopToolbar?: boolean;
  enableBottomToolbar?: boolean;
  /** Zebra rows. */
  striped?: boolean;

  /**
   * Render only the rows in view with Svelte Virtual List. The table then
   * scrolls inside `height` and shows every row instead of pages.
   */
  enableVirtualization?: boolean;
  /** Scroll area height in pixels (virtualization) or a CSS height. Default 480. */
  height?: number | string;
  /** Estimated row height in pixels, used until rows are measured. */
  estimatedRowHeight?: number;

  /** The panel shown under an expanded row. Rows get an expand button when set. */
  renderDetailPanel?: Snippet<[CellContext<TData>]>;
  /** Extra controls in the top toolbar. */
  topToolbarActions?: Snippet<[HeadlessTableInstance<TData>]>;
  /** Shown instead of the body when there are no rows. */
  emptyState?: Snippet;

  isLoading?: boolean;
  pageSizes?: number[];
  localization?: MRT_Localization;
  initialState?: Partial<HeadlessTableState>;

  onRowClick?: (context: CellContext<TData>, event: MouseEvent) => void;
  onSelectionChange?: (selectedRows: TData[]) => void;
  /** Class names for the parts. */
  classes?: Partial<
    Record<'bottomToolbar' | 'cell' | 'container' | 'headerCell' | 'row' | 'toolbar', string>
  >;
}

/** The table instance that `createHeadlessTable` returns. */
export interface HeadlessTableInstance<TData extends RowData = RowData> {
  /** The Svelte Headless Table view model. */
  readonly viewModel: any;
  readonly columns: HeadlessColumnDef<TData>[];
  readonly state: HeadlessTableState;
  /** Rows to render: the current page, or all rows when virtualized. */
  readonly rows: any[];
  /** Rows after filtering and sorting, before paging. */
  readonly filteredRows: any[];
  readonly visibleColumns: any[];
  readonly pageCount: number;
  readonly selectedRows: TData[];
  readonly allSelected: boolean;
  readonly someSelected: boolean;

  setSorting(id: string, event?: Event): void;
  clearSorting(id: string): void;
  sortOrder(id: string): 'asc' | 'desc' | undefined;
  setColumnFilter(id: string, value: unknown): void;
  setGlobalFilter(value: string): void;
  setPageIndex(index: number): void;
  setPageSize(size: number): void;
  toggleRow(rowId: string, value?: boolean): void;
  toggleAllRows(value?: boolean): void;
  isRowSelected(rowId: string): boolean;
  toggleColumn(id: string, visible?: boolean): void;
  isColumnVisible(id: string): boolean;
  toggleExpanded(rowId: string, value?: boolean): void;
  isExpanded(rowId: string): boolean;
  setDensity(density: Density): void;
  resetFilters(): void;
}
