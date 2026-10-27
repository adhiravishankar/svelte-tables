import { MRT_Default_Icons } from './icons';
import { MRT_Localization_EN } from './locales/en';
import {
  type MRT_DefinedTableOptions,
  type MRT_RowData,
  type MRT_TableOptions,
} from './types';
import { getMRTTheme } from './utils/theme.utils';

export const MRT_DefaultColumn = {
  filterVariant: 'text',
  maxSize: 1000,
  minSize: 40,
  size: 180,
} as const;

export const MRT_DefaultDisplayColumn = {
  columnDefType: 'display',
  enableClickToCopy: false,
  enableColumnActions: false,
  enableColumnDragging: false,
  enableColumnFilter: false,
  enableColumnOrdering: false,
  enableEditing: false,
  enableGlobalFilter: false,
  enableGrouping: false,
  enableHiding: false,
  enableResizing: false,
  enableSorting: false,
} as const;

let idCounter = 0;
/** A stable, SSR-safe id for a table instance. */
export const createTableId = () => `mrt-${++idCounter}`;

/**
 * Applies MRT's defaults to the table options. This reads every option, so call
 * it inside a `$derived` to keep getter-based options (`get data() {...}`)
 * reactive. Row models and function registries are not options in TanStack
 * Table v9; they live in the features created by `createMRTFeatures`.
 */
export const defineTableOptions = <TData extends MRT_RowData>(
  options: MRT_TableOptions<TData>,
  id: string,
): MRT_DefinedTableOptions<TData> => {
  const {
    autoResetExpanded = false,
    columnFilterDisplayMode = 'subheader',
    columnResizeDirection = typeof document !== 'undefined' &&
    document.dir === 'rtl'
      ? 'rtl'
      : 'ltr',
    columnResizeMode = 'onChange',
    createDisplayMode = 'modal',
    defaultColumn,
    defaultDisplayColumn,
    editDisplayMode = 'modal',
    enableBatchRowSelection = true,
    enableBottomToolbar = true,
    enableColumnActions = true,
    enableColumnFilters = true,
    enableColumnOrdering = false,
    enableColumnPinning = false,
    enableColumnResizing = false,
    enableColumnVirtualization,
    enableDensityToggle = true,
    enableExpandAll = true,
    enableExpanding,
    enableFacetedValues = false,
    enableFilterMatchHighlighting = true,
    enableFilters = true,
    enableFullScreenToggle = true,
    enableGlobalFilter = true,
    enableGlobalFilterRankedResults = true,
    enableGrouping = false,
    enableHiding = true,
    enableKeyboardShortcuts = true,
    enableMultiRowSelection = true,
    enableMultiSort = true,
    enablePagination = true,
    enableRowPinning = false,
    enableRowSelection = false,
    enableRowVirtualization,
    enableSelectAll = true,
    enableSorting = true,
    enableStickyHeader = false,
    enableTableFooter = true,
    enableTableHead = true,
    enableToolbarInternalActions = true,
    enableTopToolbar = true,
    icons,
    layoutMode,
    localization,
    manualFiltering,
    manualGrouping,
    manualPagination,
    manualSorting,
    mrtTheme,
    paginationDisplayMode = 'default',
    positionActionsColumn = 'first',
    positionCreatingRow = 'top',
    positionExpandColumn = 'first',
    positionGlobalFilter = 'right',
    positionPagination = 'bottom',
    positionToolbarAlertBanner = 'top',
    positionToolbarDropZone = 'top',
    rowNumberDisplayMode = 'static',
    rowPinningDisplayMode = 'sticky',
    selectAllMode = 'page',
    ...rest
  } = options;

  let resolvedLayoutMode =
    layoutMode || (enableColumnResizing ? 'grid-no-grow' : 'semantic');
  if (
    resolvedLayoutMode === 'semantic' &&
    (enableRowVirtualization || enableColumnVirtualization)
  ) {
    resolvedLayoutMode = 'grid';
  }

  // explicit `false` rather than `undefined`: the adapter merges options and
  // ignores `undefined`, so a `true` from an empty table would otherwise stick
  let resolvedManualFiltering = manualFiltering ?? false;
  let resolvedManualGrouping = manualGrouping ?? false;
  let resolvedManualPagination = manualPagination ?? false;
  let resolvedManualSorting = manualSorting ?? false;
  if (enablePagination === false && manualPagination === undefined) {
    resolvedManualPagination = true;
  }
  if (!rest.data?.length) {
    resolvedManualFiltering = true;
    resolvedManualGrouping = true;
    resolvedManualPagination = true;
    resolvedManualSorting = true;
  }

  return {
    autoResetExpanded,
    columnFilterDisplayMode,
    columnResizeDirection,
    columnResizeMode,
    createDisplayMode,
    defaultColumn: { ...MRT_DefaultColumn, ...defaultColumn },
    defaultDisplayColumn: {
      ...MRT_DefaultDisplayColumn,
      ...defaultDisplayColumn,
    },
    editDisplayMode,
    enableBatchRowSelection,
    enableBottomToolbar,
    enableColumnActions,
    enableColumnFilters,
    enableColumnOrdering,
    enableColumnPinning,
    enableColumnResizing,
    enableColumnVirtualization,
    enableDensityToggle,
    enableExpandAll,
    enableExpanding,
    enableFacetedValues,
    enableFilterMatchHighlighting,
    enableFilters,
    enableFullScreenToggle,
    enableGlobalFilter,
    enableGlobalFilterRankedResults,
    enableGrouping,
    enableHiding,
    enableKeyboardShortcuts,
    enableMultiRowSelection,
    enableMultiSort,
    enablePagination,
    enableRowPinning,
    enableRowSelection,
    enableRowVirtualization,
    enableSelectAll,
    enableSorting,
    enableStickyHeader: enableRowVirtualization ? true : enableStickyHeader,
    enableTableFooter,
    enableTableHead,
    enableToolbarInternalActions,
    enableTopToolbar,
    getSubRows: (row: any) => row?.subRows,
    icons: { ...MRT_Default_Icons, ...icons },
    id: options.id ?? id,
    layoutMode: resolvedLayoutMode,
    localization: { ...MRT_Localization_EN, ...localization },
    manualFiltering: resolvedManualFiltering,
    manualGrouping: resolvedManualGrouping,
    manualPagination: resolvedManualPagination,
    manualSorting: resolvedManualSorting,
    mrtTheme: getMRTTheme(mrtTheme),
    paginationDisplayMode,
    positionActionsColumn,
    positionCreatingRow,
    positionExpandColumn,
    positionGlobalFilter,
    positionPagination,
    positionToolbarAlertBanner,
    positionToolbarDropZone,
    rowNumberDisplayMode,
    rowPinningDisplayMode,
    selectAllMode,
    ...rest,
    // TanStack Table v9 only expands rows that can expand. A row with a detail
    // panel always can, even without sub rows.
    getRowCanExpand:
      rest.getRowCanExpand ??
      (rest.detailPanel
        ? (row: { subRows: unknown[] }) =>
            !!row.subRows?.length || !!rest.detailPanel
        : undefined),
  } as unknown as MRT_DefinedTableOptions<TData>;
};
