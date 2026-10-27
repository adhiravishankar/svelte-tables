import type { Component, Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import type {
  AccessorFn,
  Cell,
  CellData,
  Column,
  ColumnDef,
  ColumnFiltersState,
  ColumnOrderState,
  ColumnPinningState,
  ColumnSizingState,
  ColumnVisibilityState,
  DeepKeys,
  DeepValue,
  ExpandedState,
  GroupingState,
  Header,
  HeaderGroup,
  OnChangeFn,
  PaginationState,
  Row,
  RowSelectionState,
  SortingState,
  StockFeatures,
  Table,
  TableOptions,
  TableState,
  Updater,
  columnResizingState,
} from '@tanstack/svelte-table';
import type {
  VirtualItem,
  Virtualizer,
  VirtualizerOptions,
} from '@tanstack/virtual-core';
import type { MRT_AggregationFns } from './fns/aggregationFns';
import type { MRT_FilterFns } from './fns/filterFns';
import type { MRT_SortFns } from './fns/sortFns';
import type { MRT_Localization } from './types/localization';

export type { MRT_Localization };

/** The TanStack Table v9 features registered by MRT. */
export type MRT_Features = StockFeatures;

export type LiteralUnion<T extends U, U = string> =
  | T
  | (U & Record<never, never>);

export type Prettify<T> = { [K in keyof T]: T[K] } & unknown;

export type Xor<A, B> =
  | Prettify<A & { [k in keyof B]?: never }>
  | Prettify<B & { [k in keyof A]?: never }>;

export type DropdownOption =
  | {
      label?: string;
      value: any;
    }
  | string;

/**
 * A Svelte 5 icon component. Icons receive an optional `class` and `style` and
 * should size themselves with `1em` by default.
 */
export type MRT_Icon = Component<{ class?: string; style?: string }>;

export type MRT_Icons = {
  ArrowDownwardIcon: MRT_Icon;
  ArrowRightIcon: MRT_Icon;
  CancelIcon: MRT_Icon;
  ChevronLeftIcon: MRT_Icon;
  ChevronRightIcon: MRT_Icon;
  ClearAllIcon: MRT_Icon;
  CloseIcon: MRT_Icon;
  ContentCopy: MRT_Icon;
  DensityLargeIcon: MRT_Icon;
  DensityMediumIcon: MRT_Icon;
  DensitySmallIcon: MRT_Icon;
  DragHandleIcon: MRT_Icon;
  DynamicFeedIcon: MRT_Icon;
  EditIcon: MRT_Icon;
  ExpandMoreIcon: MRT_Icon;
  FilterAltIcon: MRT_Icon;
  FilterListIcon: MRT_Icon;
  FilterListOffIcon: MRT_Icon;
  FirstPageIcon: MRT_Icon;
  FullscreenExitIcon: MRT_Icon;
  FullscreenIcon: MRT_Icon;
  KeyboardDoubleArrowDownIcon: MRT_Icon;
  LastPageIcon: MRT_Icon;
  MoreHorizIcon: MRT_Icon;
  MoreVertIcon: MRT_Icon;
  PushPinIcon: MRT_Icon;
  RestartAltIcon: MRT_Icon;
  SaveIcon: MRT_Icon;
  SearchIcon: MRT_Icon;
  SearchOffIcon: MRT_Icon;
  SortIcon: MRT_Icon;
  SyncAltIcon: MRT_Icon;
  ViewColumnIcon: MRT_Icon;
  VisibilityOffIcon: MRT_Icon;
};

/** HTML attributes for a given element, used for the `*Props` table options. */
export type ElementProps<K extends keyof HTMLElementTagNameMap> =
  HTMLAttributes<HTMLElementTagNameMap[K]>;

/**
 * Props forwarded to an SMUI component. SMUI components accept any attribute of
 * their root element plus their own props, so these are intentionally loose.
 */
export type SmuiProps = Record<string, any>;

/** Either a static props object or a function that derives one from context. */
export type PropsOrFn<TProps, TContext> =
  | ((context: TContext) => TProps)
  | TProps;

export type MRT_DensityState = 'comfortable' | 'compact' | 'spacious';

export type MRT_ColumnFilterFnsState = Record<string, MRT_FilterOption>;

export type MRT_RowData = Record<string, any>;

export type MRT_ColumnFiltersState = ColumnFiltersState;
export type MRT_ColumnOrderState = ColumnOrderState;
export type MRT_ColumnPinningState = ColumnPinningState;
export type MRT_ColumnSizingState = ColumnSizingState;
export type MRT_ColumnResizingState = columnResizingState;
export type MRT_ExpandedState = ExpandedState;
export type MRT_GroupingState = GroupingState;
export type MRT_PaginationState = PaginationState;
export type MRT_RowSelectionState = RowSelectionState;
export type MRT_SortingState = SortingState;
export type MRT_Updater<T> = Updater<T>;
export type MRT_VirtualItem = VirtualItem;
export type MRT_VisibilityState = ColumnVisibilityState;

export type MRT_VirtualizerOptions<
  TScrollElement extends Element | Window = Element | Window,
  TItemElement extends Element = Element,
> = VirtualizerOptions<TScrollElement, TItemElement>;

export type MRT_ColumnVirtualizer<
  TScrollElement extends Element | Window = HTMLDivElement,
  TItemElement extends Element = HTMLTableCellElement,
> = Virtualizer<TScrollElement, TItemElement> & {
  virtualColumns: MRT_VirtualItem[];
  virtualPaddingLeft?: number;
  virtualPaddingRight?: number;
};

export type MRT_RowVirtualizer<
  TScrollElement extends Element | Window = HTMLDivElement,
  TItemElement extends Element = HTMLTableRowElement,
> = Virtualizer<TScrollElement, TItemElement> & {
  virtualRows: MRT_VirtualItem[];
};

/** A mutable holder for a DOM element, assigned with `bind:this`. */
export type MRT_Ref<T> = { current: T | null };

export type MRT_ColumnHelper<TData extends MRT_RowData> = {
  accessor: <
    TAccessor extends AccessorFn<TData> | DeepKeys<TData>,
    TValue extends (TAccessor extends AccessorFn<TData, infer TReturn>
      ? TReturn
      : TAccessor extends DeepKeys<TData>
        ? DeepValue<TData, TAccessor>
        : never),
  >(
    accessor: TAccessor,
    column: MRT_DisplayColumnDef<TData, TValue>,
  ) => MRT_ColumnDef<TData, TValue>;
  display: (column: MRT_DisplayColumnDef<TData>) => MRT_ColumnDef<TData>;
  group: (column: MRT_GroupColumnDef<TData>) => MRT_ColumnDef<TData>;
};

export interface MRT_Theme {
  baseBackgroundColor: string;
  cellNavigationOutlineColor: string;
  draggingBorderColor: string;
  matchHighlightColor: string;
  menuBackgroundColor: string;
  pinnedRowBackgroundColor: string;
  selectedRowBackgroundColor: string;
}

export interface MRT_RowModel<TData extends MRT_RowData> {
  flatRows: MRT_Row<TData>[];
  rows: MRT_Row<TData>[];
  rowsById: { [key: string]: MRT_Row<TData> };
}

/**
 * The MRT table instance: a TanStack Table v9 instance with MRT's additional
 * state setters and element refs. Read state with `table.atoms.<slice>.get()`
 * or `table.store.get()` inside templates, `$derived`, or `$effect`.
 */
export type MRT_TableInstance<TData extends MRT_RowData> = Omit<
  Table<MRT_Features, TData>,
  | 'getAllColumns'
  | 'getAllFlatColumns'
  | 'getAllLeafColumns'
  | 'getBottomRows'
  | 'getCenterLeafColumns'
  | 'getCenterRows'
  | 'getColumn'
  | 'getEndLeafColumns'
  | 'getExpandedRowModel'
  | 'getFlatHeaders'
  | 'getFooterGroups'
  | 'getHeaderGroups'
  | 'getLeafHeaders'
  | 'getPaginatedRowModel'
  | 'getPreFilteredRowModel'
  | 'getPrePaginatedRowModel'
  | 'getRow'
  | 'getRowModel'
  | 'getSelectedRowModel'
  | 'getStartLeafColumns'
  | 'getTopRows'
  | 'options'
> & {
  getAllColumns: () => MRT_Column<TData>[];
  getAllFlatColumns: () => MRT_Column<TData>[];
  getAllLeafColumns: () => MRT_Column<TData>[];
  getBottomRows: () => MRT_Row<TData>[];
  getCenterLeafColumns: () => MRT_Column<TData>[];
  getCenterRows: () => MRT_Row<TData>[];
  getColumn: (columnId: string) => MRT_Column<TData>;
  getEndLeafColumns: () => MRT_Column<TData>[];
  getExpandedRowModel: () => MRT_RowModel<TData>;
  getFlatHeaders: () => MRT_Header<TData>[];
  getFooterGroups: () => MRT_HeaderGroup<TData>[];
  getHeaderGroups: () => MRT_HeaderGroup<TData>[];
  getLeafHeaders: () => MRT_Header<TData>[];
  getPaginatedRowModel: () => MRT_RowModel<TData>;
  getPreFilteredRowModel: () => MRT_RowModel<TData>;
  getPrePaginatedRowModel: () => MRT_RowModel<TData>;
  getRow: (id: string, searchAll?: boolean) => MRT_Row<TData>;
  getRowModel: () => MRT_RowModel<TData>;
  getSelectedRowModel: () => MRT_RowModel<TData>;
  getStartLeafColumns: () => MRT_Column<TData>[];
  getTopRows: () => MRT_Row<TData>[];
  options: MRT_DefinedTableOptions<TData>;
  refs: {
    actionCellRef: MRT_Ref<HTMLTableCellElement>;
    bottomToolbarRef: MRT_Ref<HTMLDivElement>;
    editInputRefs: MRT_Ref<Record<string, HTMLInputElement>>;
    filterInputRefs: MRT_Ref<Record<string, HTMLInputElement>>;
    lastSelectedRowId: MRT_Ref<string>;
    searchInputRef: MRT_Ref<HTMLInputElement>;
    tableContainerRef: MRT_Ref<HTMLDivElement>;
    tableFooterRef: MRT_Ref<HTMLTableSectionElement>;
    tableHeadCellRefs: MRT_Ref<Record<string, HTMLTableCellElement>>;
    tableHeadRef: MRT_Ref<HTMLTableSectionElement>;
    tablePaperRef: MRT_Ref<HTMLDivElement>;
    topToolbarRef: MRT_Ref<HTMLDivElement>;
  };
  /** The MRT-specific state (everything not owned by a TanStack feature). */
  mrtState: MRT_TableState<TData>;
  /**
   * The options as you passed them (with MRT defaults). `table.options` is a
   * reactive copy made by TanStack Table, so objects such as instance refs
   * should be written through this instead.
   */
  userOptions: MRT_DefinedTableOptions<TData>;
  setActionCell: OnChangeFn<MRT_Cell<TData> | null>;
  setColumnFilterFns: OnChangeFn<MRT_ColumnFilterFnsState>;
  setCreatingRow: OnChangeFn<MRT_Row<TData> | null | true>;
  setDensity: OnChangeFn<MRT_DensityState>;
  setDraggingColumn: OnChangeFn<MRT_Column<TData> | null>;
  setDraggingRow: OnChangeFn<MRT_Row<TData> | null>;
  setEditingCell: OnChangeFn<MRT_Cell<TData> | null>;
  setEditingRow: OnChangeFn<MRT_Row<TData> | null>;
  setGlobalFilterFn: OnChangeFn<MRT_FilterOption>;
  setHoveredColumn: OnChangeFn<Partial<MRT_Column<TData>> | null>;
  setHoveredRow: OnChangeFn<Partial<MRT_Row<TData>> | null>;
  setIsFullScreen: OnChangeFn<boolean>;
  setShowAlertBanner: OnChangeFn<boolean>;
  setShowColumnFilters: OnChangeFn<boolean>;
  setShowGlobalFilter: OnChangeFn<boolean>;
  setShowToolbarDropZone: OnChangeFn<boolean>;
};

export type MRT_DefinedTableOptions<TData extends MRT_RowData> = Omit<
  MRT_TableOptions<TData>,
  'icons' | 'localization' | 'mrtTheme'
> & {
  icons: MRT_Icons;
  localization: MRT_Localization;
  mrtTheme: Required<MRT_Theme>;
};

export type MRT_StatefulTableOptions<TData extends MRT_RowData> =
  MRT_DefinedTableOptions<TData> & {
    state: Pick<
      MRT_TableState<TData>,
      | 'columnFilterFns'
      | 'columnOrder'
      | 'columnResizing'
      | 'creatingRow'
      | 'density'
      | 'draggingColumn'
      | 'draggingRow'
      | 'editingCell'
      | 'editingRow'
      | 'globalFilterFn'
      | 'grouping'
      | 'hoveredColumn'
      | 'hoveredRow'
      | 'isFullScreen'
      | 'pagination'
      | 'showAlertBanner'
      | 'showColumnFilters'
      | 'showGlobalFilter'
      | 'showToolbarDropZone'
    >;
  };

export interface MRT_TableState<
  TData extends MRT_RowData,
> extends TableState<MRT_Features> {
  actionCell: MRT_Cell<TData> | null;
  columnFilterFns: MRT_ColumnFilterFnsState;
  creatingRow: MRT_Row<TData> | null;
  density: MRT_DensityState;
  draggingColumn: MRT_Column<TData> | null;
  draggingRow: MRT_Row<TData> | null;
  editingCell: MRT_Cell<TData> | null;
  editingRow: MRT_Row<TData> | null;
  globalFilterFn: MRT_FilterOption;
  hoveredColumn: Partial<MRT_Column<TData>> | null;
  hoveredRow: Partial<MRT_Row<TData>> | null;
  isFullScreen: boolean;
  isLoading?: boolean;
  isSaving?: boolean;
  showAlertBanner: boolean;
  showColumnFilters: boolean;
  showGlobalFilter: boolean;
  showLoadingOverlay?: boolean;
  showProgressBars?: boolean;
  showSkeletons?: boolean;
  showToolbarDropZone: boolean;
}

/** Context passed to most cell-level snippets and props functions. */
export interface MRT_CellContext<TData extends MRT_RowData, TValue = unknown> {
  cell: MRT_Cell<TData, TValue>;
  column: MRT_Column<TData, TValue>;
  row: MRT_Row<TData>;
  staticColumnIndex?: number;
  staticRowIndex?: number;
  table: MRT_TableInstance<TData>;
}

export interface MRT_ColumnContext<
  TData extends MRT_RowData,
  TValue = unknown,
> {
  column: MRT_Column<TData, TValue>;
  table: MRT_TableInstance<TData>;
}

export interface MRT_ColumnDef<
  TData extends MRT_RowData,
  TValue = unknown,
> extends Omit<
  ColumnDef<MRT_Features, TData, any>,
  | 'accessorFn'
  | 'accessorKey'
  | 'aggregatedCell'
  | 'aggregationFn'
  | 'cell'
  | 'columns'
  | 'filterFn'
  | 'footer'
  | 'header'
  | 'id'
  | 'sortFn'
> {
  /**
   * Either an `accessorKey` or a combination of an `accessorFn` and `id` are required for a data column definition.
   *
   * @example accessorFn: (row) => row.username
   */
  accessorFn?: (originalRow: TData) => TValue;
  /**
   * Which key in the row this column should use to access the correct data. Also supports deep key dot notation.
   *
   * @example accessorKey: 'name.firstName'
   */
  accessorKey?: DeepKeys<TData> | (string & {});
  /** Snippet for the cell of a grouped row's aggregated value. */
  AggregatedCell?: Snippet<[MRT_CellContext<TData, TValue>]>;
  aggregationFn?: Array<MRT_AggregationFn> | MRT_AggregationFn;
  /** Snippet that replaces the default cell contents. */
  Cell?: Snippet<
    [MRT_CellContext<TData, TValue> & { renderedCellValue: unknown }]
  >;
  /**
   * Specify what type of column this is. Either `data`, `display`, or `group`. Defaults to `data`.
   *
   * @default 'data'
   */
  columnDefType?: 'data' | 'display' | 'group';
  columnFilterModeOptions?: Array<
    LiteralUnion<string & MRT_FilterOption>
  > | null;
  columns?: MRT_ColumnDef<TData, TValue>[];
  /** Snippet for a fully custom edit input. */
  Edit?: Snippet<[Omit<MRT_CellContext<TData, TValue>, 'staticColumnIndex'>]>;
  editSelectOptions?:
    | ((context: MRT_CellContext<TData, TValue>) => DropdownOption[])
    | DropdownOption[];
  editVariant?: 'select' | 'text';
  enableClickToCopy?:
    | 'context-menu'
    | ((cell: MRT_Cell<TData>) => 'context-menu' | boolean)
    | boolean;
  enableColumnActions?: boolean;
  enableColumnDragging?: boolean;
  enableColumnFilterModes?: boolean;
  enableColumnOrdering?: boolean;
  enableEditing?: ((row: MRT_Row<TData>) => boolean) | boolean;
  enableFilterMatchHighlighting?: boolean;
  /** Snippet for a fully custom filter input. */
  Filter?: Snippet<
    [
      MRT_ColumnContext<TData, TValue> & {
        header: MRT_Header<TData>;
        rangeFilterIndex?: number;
      },
    ]
  >;
  filterFn?: MRT_FilterFn;
  filterSelectOptions?: DropdownOption[];
  filterVariant?:
    | 'autocomplete'
    | 'checkbox'
    | 'date'
    | 'date-range'
    | 'datetime'
    | 'datetime-range'
    | 'multi-select'
    | 'range'
    | 'range-slider'
    | 'select'
    | 'text'
    | 'time'
    | 'time-range';
  /**
   * footer must be a string. For custom markup, specify a `Footer` snippet. (Capital F)
   */
  footer?: string;
  Footer?: Snippet<
    [MRT_ColumnContext<TData, TValue> & { footer: MRT_Header<TData> }]
  >;
  /** Snippet for the cell of a grouped row's grouping value. */
  GroupedCell?: Snippet<[MRT_CellContext<TData, TValue>]>;
  /**
   * If `layoutMode` is `'grid'` or `'grid-no-grow'`, specify the flex grow value for individual columns, or `false`/0 to not grow.
   */
  grow?: boolean | number;
  /**
   * header must be a string. For custom markup, specify a `Header` snippet. (Capital H)
   */
  header: string;
  Header?: Snippet<
    [MRT_ColumnContext<TData, TValue> & { header: MRT_Header<TData> }]
  >;
  /**
   * `id` defaults to the `accessorKey` or `header` if not specified.
   */
  id?: LiteralUnion<string & keyof TData>;
  columnActionsButtonProps?: PropsOrFn<SmuiProps, MRT_ColumnContext<TData>>;
  columnDragHandleProps?: PropsOrFn<SmuiProps, MRT_ColumnContext<TData>>;
  copyButtonProps?: PropsOrFn<SmuiProps, MRT_CellContext<TData, TValue>>;
  editTextFieldProps?: PropsOrFn<SmuiProps, MRT_CellContext<TData, TValue>>;
  filterAutocompleteProps?: PropsOrFn<SmuiProps, MRT_ColumnContext<TData>>;
  filterCheckboxProps?: PropsOrFn<SmuiProps, MRT_ColumnContext<TData>>;
  filterSliderProps?: PropsOrFn<SmuiProps, MRT_ColumnContext<TData>>;
  filterTextFieldProps?: PropsOrFn<
    SmuiProps,
    MRT_ColumnContext<TData> & { rangeFilterIndex?: number }
  >;
  /** Props for the native `<input type="date | datetime-local | time">` filters. */
  filterDateInputProps?: PropsOrFn<
    SmuiProps,
    MRT_ColumnContext<TData> & { rangeFilterIndex?: number }
  >;
  tableBodyCellProps?: PropsOrFn<
    ElementProps<'td'>,
    MRT_CellContext<TData, TValue>
  >;
  tableFooterCellProps?: PropsOrFn<
    ElementProps<'td'>,
    MRT_ColumnContext<TData>
  >;
  tableHeadCellProps?: PropsOrFn<ElementProps<'th'>, MRT_ColumnContext<TData>>;
  PlaceholderCell?: Snippet<[MRT_CellContext<TData, TValue>]>;
  cellActionMenuItems?: Snippet<
    [
      MRT_CellContext<TData> & {
        closeMenu: () => void;
        internalMenuItems: Snippet[];
      },
    ]
  >;
  columnActionsMenuItems?: Snippet<
    [
      MRT_ColumnContext<TData> & {
        closeMenu: () => void;
        internalColumnMenuItems: Snippet[];
      },
    ]
  >;
  columnFilterModeMenuItems?: Snippet<
    [
      MRT_ColumnContext<TData> & {
        internalFilterOptions: MRT_InternalFilterOption[];
        onSelectFilterMode: (filterMode: MRT_FilterOption) => void;
      },
    ]
  >;
  sortFn?: MRT_SortFn;
  visibleInShowHideMenu?: boolean;
}

export type MRT_DisplayColumnDef<
  TData extends MRT_RowData,
  TValue = unknown,
> = Omit<MRT_ColumnDef<TData, TValue>, 'accessorFn' | 'accessorKey'>;

export type MRT_GroupColumnDef<TData extends MRT_RowData> =
  MRT_DisplayColumnDef<TData, any> & {
    columns: MRT_ColumnDef<TData>[];
  };

export type MRT_DefinedColumnDef<
  TData extends MRT_RowData,
  TValue = unknown,
> = Omit<MRT_ColumnDef<TData, TValue>, 'defaultDisplayColumn' | 'id'> & {
  _filterFn: MRT_FilterOption;
  defaultDisplayColumn: Partial<MRT_ColumnDef<TData, TValue>>;
  id: string;
};

export type MRT_Column<TData extends MRT_RowData, TValue = unknown> = Omit<
  Column<MRT_Features, TData, TValue>,
  'columnDef' | 'columns'
> & {
  columnDef: MRT_DefinedColumnDef<TData, TValue>;
  columns?: MRT_Column<TData, TValue>[];
  footer: string;
  header: string;
};

export type MRT_Header<TData extends MRT_RowData> = Omit<
  Header<MRT_Features, TData, CellData>,
  'column'
> & {
  column: MRT_Column<TData>;
};

export type MRT_HeaderGroup<TData extends MRT_RowData> = Omit<
  HeaderGroup<MRT_Features, TData>,
  'headers'
> & {
  headers: MRT_Header<TData>[];
};

export type MRT_Row<TData extends MRT_RowData> = Omit<
  Row<MRT_Features, TData>,
  'getAllCells' | 'getVisibleCells' | 'subRows'
> & {
  getAllCells: () => MRT_Cell<TData>[];
  getVisibleCells: () => MRT_Cell<TData>[];
  subRows?: MRT_Row<TData>[];
};

export type MRT_Cell<TData extends MRT_RowData, TValue = unknown> = Omit<
  Cell<MRT_Features, TData, TValue>,
  'column' | 'row'
> & {
  column: MRT_Column<TData, TValue>;
  row: MRT_Row<TData>;
};

export type MRT_AggregationOption = LiteralUnion<
  string & keyof typeof MRT_AggregationFns
>;

/**
 * A built-in or registered aggregation function name, `'auto'`, or (to compute
 * several per column) a named descriptor. A column can also take an array of
 * these; the cell value is then an object keyed by id.
 */
export type MRT_AggregationFn =
  | MRT_AggregationOption
  | 'auto'
  | { aggregationFn: MRT_AggregationOption | 'auto'; id: string };

export type MRT_SortOption = LiteralUnion<string & keyof typeof MRT_SortFns>;

export type MRT_SortFn = MRT_SortOption | ((...args: any[]) => number);

export type MRT_FilterOption = LiteralUnion<
  string & keyof typeof MRT_FilterFns
>;

export type MRT_FilterFn = MRT_FilterOption | ((...args: any[]) => boolean);

export type MRT_InternalFilterOption = {
  divider: boolean;
  label: string;
  option: string;
  symbol: string;
};

export type MRT_DisplayColumnIds =
  | 'mrt-row-actions'
  | 'mrt-row-drag'
  | 'mrt-row-expand'
  | 'mrt-row-numbers'
  | 'mrt-row-pin'
  | 'mrt-row-select'
  | 'mrt-row-spacer';

type TableContext<TData extends MRT_RowData> = {
  table: MRT_TableInstance<TData>;
};
type RowContext<TData extends MRT_RowData> = TableContext<TData> & {
  row: MRT_Row<TData>;
};

/**
 * `columns` and `data` are the only required options, but there are over 150
 * other optional ones. Pass reactive values (`data`, `state`, ...) as getters
 * or through a `$state` object so the table stays in sync:
 *
 * ```ts
 * const table = createMaterialSvelteTable({
 *   columns,
 *   get data() { return data },
 * });
 * ```
 *
 * Every former `renderX` option is now a snippet named without the `render`
 * prefix (e.g. `renderDetailPanel` is `detailPanel`), and every `muiXProps`
 * option is now `xProps`.
 */
export interface MRT_TableOptions<TData extends MRT_RowData> extends Omit<
  Partial<TableOptions<MRT_Features, TData>>,
  | 'columns'
  | 'data'
  | 'defaultColumn'
  | 'enableRowSelection'
  | 'getRowId'
  | 'globalFilterFn'
  | 'initialState'
  | 'state'
> {
  /**
   * Custom aggregation functions, merged into the built-in ones. In TanStack
   * Table v9 these are registered once when the table is created and cannot
   * change afterwards.
   */
  aggregationFns?: Record<string, any>;
  columnFilterDisplayMode?: 'custom' | 'popover' | 'subheader';
  columnFilterModeOptions?: Array<
    LiteralUnion<string & MRT_FilterOption>
  > | null;
  /**
   * Custom filter functions, merged into the built-in ones. Registered once
   * when the table is created.
   */
  filterFns?: Record<string, any>;
  /**
   * Custom sort functions (formerly `sortingFns`), merged into the built-in
   * ones. Registered once when the table is created.
   */
  sortFns?: Record<string, any>;
  /** The columns to display in the table. `accessorKey`s or `accessorFn`s must match keys in `data`. */
  columns: MRT_ColumnDef<TData, any>[];
  columnVirtualizerInstanceRef?: MRT_Ref<MRT_ColumnVirtualizer>;
  columnVirtualizerOptions?: PropsOrFn<
    Partial<VirtualizerOptions<HTMLDivElement, HTMLTableCellElement>>,
    TableContext<TData>
  >;
  createDisplayMode?: 'custom' | 'modal' | 'row';
  /** Your data as an array of objects. Keep the shape consistent. */
  data: TData[];
  /** Change an option for all columns at once. */
  defaultColumn?: Partial<MRT_ColumnDef<TData>>;
  /** Change the default options for display columns. */
  defaultDisplayColumn?: Partial<MRT_DisplayColumnDef<TData>>;
  displayColumnDefOptions?: Partial<{
    [key in MRT_DisplayColumnIds]: Partial<MRT_DisplayColumnDef<TData>>;
  }>;
  editDisplayMode?: 'cell' | 'custom' | 'modal' | 'row' | 'table';
  enableBatchRowSelection?: boolean;
  enableBottomToolbar?: boolean;
  enableCellActions?: ((cell: MRT_Cell<TData>) => boolean) | boolean;
  enableClickToCopy?:
    | 'context-menu'
    | ((cell: MRT_Cell<TData>) => 'context-menu' | boolean)
    | boolean;
  enableColumnActions?: boolean;
  enableColumnDragging?: boolean;
  enableColumnFilterModes?: boolean;
  enableColumnOrdering?: boolean;
  enableColumnVirtualization?: boolean;
  enableDensityToggle?: boolean;
  enableEditing?: ((row: MRT_Row<TData>) => boolean) | boolean;
  enableExpandAll?: boolean;
  enableFacetedValues?: boolean;
  enableFilterMatchHighlighting?: boolean;
  enableFullScreenToggle?: boolean;
  enableGlobalFilterModes?: boolean;
  enableGlobalFilterRankedResults?: boolean;
  enableKeyboardShortcuts?: boolean;
  enablePagination?: boolean;
  enableRowActions?: boolean;
  enableRowDragging?: boolean;
  enableRowNumbers?: boolean;
  enableRowOrdering?: boolean;
  enableRowSelection?: ((row: MRT_Row<TData>) => boolean) | boolean;
  enableRowVirtualization?: boolean;
  enableSelectAll?: boolean;
  enableStickyFooter?: boolean;
  enableStickyHeader?: boolean;
  enableTableFooter?: boolean;
  enableTableHead?: boolean;
  enableToolbarInternalActions?: boolean;
  enableTopToolbar?: boolean;
  getRowId?: (
    originalRow: TData,
    index: number,
    parentRow?: MRT_Row<TData>,
  ) => string;
  globalFilterFn?: MRT_FilterOption;
  globalFilterModeOptions?: MRT_FilterOption[] | null;
  icons?: Partial<MRT_Icons>;
  id?: string;
  initialState?: Partial<MRT_TableState<TData>>;
  /**
   * Changes which kind of CSS layout is used to render the table. `semantic` uses default semantic HTML elements, while `grid` adds CSS grid and flexbox styles
   */
  layoutMode?: 'grid' | 'grid-no-grow' | 'semantic';
  /** A locale imported from `material-svelte-table/locales/*` or a custom locale object. */
  localization?: Partial<MRT_Localization>;
  /** Override MRT's theme colors. Defaults are derived from SMUI/Material CSS variables. */
  mrtTheme?: Partial<MRT_Theme>;

  bottomToolbarProps?: PropsOrFn<ElementProps<'div'>, TableContext<TData>>;
  circularProgressProps?: PropsOrFn<SmuiProps, TableContext<TData>>;
  columnActionsButtonProps?: PropsOrFn<SmuiProps, MRT_ColumnContext<TData>>;
  columnDragHandleProps?: PropsOrFn<SmuiProps, MRT_ColumnContext<TData>>;
  copyButtonProps?: PropsOrFn<SmuiProps, MRT_CellContext<TData>>;
  createRowDialogProps?: PropsOrFn<SmuiProps, RowContext<TData>>;
  detailPanelProps?: PropsOrFn<ElementProps<'td'>, RowContext<TData>>;
  editRowDialogProps?: PropsOrFn<SmuiProps, RowContext<TData>>;
  editTextFieldProps?: PropsOrFn<SmuiProps, MRT_CellContext<TData>>;
  expandAllButtonProps?: PropsOrFn<SmuiProps, TableContext<TData>>;
  expandButtonProps?: PropsOrFn<
    SmuiProps,
    RowContext<TData> & { staticRowIndex?: number }
  >;
  filterAutocompleteProps?: PropsOrFn<SmuiProps, MRT_ColumnContext<TData>>;
  filterCheckboxProps?: PropsOrFn<SmuiProps, MRT_ColumnContext<TData>>;
  filterDateInputProps?: PropsOrFn<
    SmuiProps,
    MRT_ColumnContext<TData> & { rangeFilterIndex?: number }
  >;
  filterSliderProps?: PropsOrFn<SmuiProps, MRT_ColumnContext<TData>>;
  filterTextFieldProps?: PropsOrFn<
    SmuiProps,
    MRT_ColumnContext<TData> & { rangeFilterIndex?: number }
  >;
  linearProgressProps?: PropsOrFn<
    SmuiProps,
    TableContext<TData> & { isTopToolbar: boolean }
  >;
  paginationProps?: PropsOrFn<
    SmuiProps & {
      disabled?: boolean;
      rowsPerPageOptions?: { label: string; value: number }[] | number[];
      showRowsPerPage?: boolean;
    },
    TableContext<TData>
  >;
  rowDragHandleProps?: PropsOrFn<SmuiProps, RowContext<TData>>;
  searchTextFieldProps?: PropsOrFn<SmuiProps, TableContext<TData>>;
  selectAllCheckboxProps?: PropsOrFn<SmuiProps, TableContext<TData>>;
  selectCheckboxProps?: PropsOrFn<
    SmuiProps,
    RowContext<TData> & { staticRowIndex?: number }
  >;
  skeletonProps?: PropsOrFn<SmuiProps, MRT_CellContext<TData>>;
  tableBodyCellProps?: PropsOrFn<ElementProps<'td'>, MRT_CellContext<TData>>;
  tableBodyProps?: PropsOrFn<ElementProps<'tbody'>, TableContext<TData>>;
  tableBodyRowProps?: PropsOrFn<
    ElementProps<'tr'>,
    RowContext<TData> & { isDetailPanel?: boolean; staticRowIndex: number }
  >;
  tableContainerProps?: PropsOrFn<ElementProps<'div'>, TableContext<TData>>;
  tableFooterCellProps?: PropsOrFn<
    ElementProps<'td'>,
    MRT_ColumnContext<TData>
  >;
  tableFooterProps?: PropsOrFn<ElementProps<'tfoot'>, TableContext<TData>>;
  tableFooterRowProps?: PropsOrFn<
    ElementProps<'tr'>,
    TableContext<TData> & { footerGroup: MRT_HeaderGroup<TData> }
  >;
  tableHeadCellProps?: PropsOrFn<ElementProps<'th'>, MRT_ColumnContext<TData>>;
  tableHeadProps?: PropsOrFn<ElementProps<'thead'>, TableContext<TData>>;
  tableHeadRowProps?: PropsOrFn<
    ElementProps<'tr'>,
    TableContext<TData> & { headerGroup: MRT_HeaderGroup<TData> }
  >;
  tablePaperProps?: PropsOrFn<ElementProps<'div'>, TableContext<TData>>;
  tableProps?: PropsOrFn<ElementProps<'table'>, TableContext<TData>>;
  toolbarAlertBannerChipProps?: PropsOrFn<SmuiProps, TableContext<TData>>;
  toolbarAlertBannerProps?: PropsOrFn<SmuiProps, TableContext<TData>>;
  topToolbarProps?: PropsOrFn<ElementProps<'div'>, TableContext<TData>>;

  onActionCellChange?: OnChangeFn<MRT_Cell<TData> | null>;
  onColumnFilterFnsChange?: OnChangeFn<{ [key: string]: MRT_FilterOption }>;
  onCreatingRowCancel?: (props: RowContext<TData>) => void;
  onCreatingRowChange?: OnChangeFn<MRT_Row<TData> | null>;
  onCreatingRowSave?: (
    props: RowContext<TData> & {
      exitCreatingMode: () => void;
      values: Record<LiteralUnion<string & DeepKeys<TData>>, any>;
    },
  ) => Promise<void> | void;
  onDensityChange?: OnChangeFn<MRT_DensityState>;
  onDraggingColumnChange?: OnChangeFn<MRT_Column<TData> | null>;
  onDraggingRowChange?: OnChangeFn<MRT_Row<TData> | null>;
  onEditingCellChange?: OnChangeFn<MRT_Cell<TData> | null>;
  onEditingRowCancel?: (props: RowContext<TData>) => void;
  onEditingRowChange?: OnChangeFn<MRT_Row<TData> | null>;
  onEditingRowSave?: (
    props: RowContext<TData> & {
      exitEditingMode: () => void;
      values: Record<LiteralUnion<string & DeepKeys<TData>>, any>;
    },
  ) => Promise<void> | void;
  onGlobalFilterFnChange?: OnChangeFn<MRT_FilterOption>;
  onHoveredColumnChange?: OnChangeFn<Partial<MRT_Column<TData>> | null>;
  onHoveredRowChange?: OnChangeFn<Partial<MRT_Row<TData>> | null>;
  onIsFullScreenChange?: OnChangeFn<boolean>;
  onShowAlertBannerChange?: OnChangeFn<boolean>;
  onShowColumnFiltersChange?: OnChangeFn<boolean>;
  onShowGlobalFilterChange?: OnChangeFn<boolean>;
  onShowToolbarDropZoneChange?: OnChangeFn<boolean>;

  paginationDisplayMode?: 'custom' | 'default' | 'pages';
  positionActionsColumn?: 'first' | 'last';
  positionCreatingRow?: 'bottom' | 'top' | number;
  positionExpandColumn?: 'first' | 'last';
  positionGlobalFilter?: 'left' | 'none' | 'right';
  positionPagination?: 'both' | 'bottom' | 'none' | 'top';
  positionToolbarAlertBanner?: 'bottom' | 'head-overlay' | 'none' | 'top';
  positionToolbarDropZone?: 'both' | 'bottom' | 'none' | 'top';

  // Snippets (formerly `renderX` options)
  bottomToolbar?: Snippet<[TableContext<TData>]>;
  bottomToolbarCustomActions?: Snippet<[TableContext<TData>]>;
  caption?: Snippet<[TableContext<TData>]>;
  cellActionMenuItems?: Snippet<
    [
      MRT_CellContext<TData> & {
        closeMenu: () => void;
        internalMenuItems: Snippet[];
      },
    ]
  >;
  columnActionsMenuItems?: Snippet<
    [
      MRT_ColumnContext<TData> & {
        closeMenu: () => void;
        internalColumnMenuItems: Snippet[];
      },
    ]
  >;
  columnFilterModeMenuItems?: Snippet<
    [
      MRT_ColumnContext<TData> & {
        internalFilterOptions: MRT_InternalFilterOption[];
        onSelectFilterMode: (filterMode: MRT_FilterOption) => void;
      },
    ]
  >;
  createRowDialogContent?: Snippet<
    [RowContext<TData> & { internalEditCells: MRT_Cell<TData>[] }]
  >;
  detailPanel?: Snippet<[RowContext<TData>]>;
  editRowDialogContent?: Snippet<
    [RowContext<TData> & { internalEditCells: MRT_Cell<TData>[] }]
  >;
  emptyRowsFallback?: Snippet<[TableContext<TData>]>;
  globalFilterModeMenuItems?: Snippet<
    [
      TableContext<TData> & {
        internalFilterOptions: MRT_InternalFilterOption[];
        onSelectFilterMode: (filterMode: MRT_FilterOption) => void;
      },
    ]
  >;
  rowActionMenuItems?: Snippet<
    [RowContext<TData> & { closeMenu: () => void; staticRowIndex?: number }]
  >;
  rowActions?: Snippet<
    [
      RowContext<TData> & {
        cell: MRT_Cell<TData>;
        staticRowIndex?: number;
      },
    ]
  >;
  toolbarAlertBannerContent?: Snippet<
    [
      TableContext<TData> & {
        groupedAlert: Snippet | null;
        selectedAlert: Snippet | null;
      },
    ]
  >;
  toolbarInternalActions?: Snippet<[TableContext<TData>]>;
  topToolbar?: Snippet<[TableContext<TData>]>;
  topToolbarCustomActions?: Snippet<[TableContext<TData>]>;

  rowNumberDisplayMode?: 'original' | 'static';
  rowPinningDisplayMode?:
    | 'bottom'
    | 'select-bottom'
    | 'select-sticky'
    | 'select-top'
    | 'sticky'
    | 'top'
    | 'top-and-bottom';
  rowVirtualizerInstanceRef?: MRT_Ref<MRT_RowVirtualizer>;
  rowVirtualizerOptions?: PropsOrFn<
    Partial<VirtualizerOptions<HTMLDivElement, HTMLTableRowElement>>,
    TableContext<TData>
  >;
  selectAllMode?: 'all' | 'page';
  /** Manage state externally any way you want, then pass it back into MRT. */
  state?: Partial<MRT_TableState<TData>>;
}
