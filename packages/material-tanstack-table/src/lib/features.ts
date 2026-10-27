import {
  columnFacetingFeature,
  columnFilteringFeature,
  columnGroupingFeature,
  columnOrderingFeature,
  columnPinningFeature,
  columnResizingFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  createExpandedRowModel,
  createFacetedMinMaxValues,
  createFacetedRowModel,
  createFacetedUniqueValues,
  createFilteredRowModel,
  createGroupedRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  globalFilteringFeature,
  rowAggregationFeature,
  rowExpandingFeature,
  rowPaginationFeature,
  rowPinningFeature,
  rowSelectionFeature,
  rowSortingFeature,
  tableFeatures,
} from '@tanstack/svelte-table';
import { MRT_AggregationFns } from './fns/aggregationFns';
import { MRT_FilterFns } from './fns/filterFns';
import { MRT_SortFns } from './fns/sortFns';

/**
 * Creates the TanStack Table v9 `features` object used by every MRT table.
 *
 * In v9 features, row models and function registries are registered
 * statically. All of them are registered here, and the row models only do work
 * when the matching state or option is in use (`manualSorting`, `grouping`,
 * `enableFacetedValues`, ...), so toggling table options does not require new
 * features. Custom `filterFns`, `sortFns` and `aggregationFns` are merged into
 * the built-in registries and must be provided when the table is created.
 */
export const createMRTFeatures = ({
  aggregationFns,
  filterFns,
  sortFns,
}: {
  aggregationFns?: Record<string, any>;
  filterFns?: Record<string, any>;
  sortFns?: Record<string, any>;
} = {}) =>
  tableFeatures({
    columnFacetingFeature,
    columnFilteringFeature,
    columnGroupingFeature,
    columnOrderingFeature,
    columnPinningFeature,
    columnSizingFeature,
    columnResizingFeature,
    columnVisibilityFeature,
    globalFilteringFeature,
    rowAggregationFeature,
    rowExpandingFeature,
    rowPaginationFeature,
    rowPinningFeature,
    rowSelectionFeature,
    rowSortingFeature,
    expandedRowModel: createExpandedRowModel(),
    facetedMinMaxValues: createFacetedMinMaxValues(),
    facetedRowModel: createFacetedRowModel(),
    facetedUniqueValues: createFacetedUniqueValues(),
    filteredRowModel: createFilteredRowModel(),
    groupedRowModel: createGroupedRowModel(),
    paginatedRowModel: createPaginatedRowModel(),
    sortedRowModel: createSortedRowModel(),
    aggregationFns: { ...MRT_AggregationFns, ...aggregationFns },
    filterFns: { ...MRT_FilterFns, ...filterFns },
    sortFns: { ...MRT_SortFns, ...sortFns },
  });
