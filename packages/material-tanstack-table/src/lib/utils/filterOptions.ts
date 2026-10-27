import { type MRT_InternalFilterOption, type MRT_Localization } from '../types';

export const mrtFilterOptions = (
  localization: MRT_Localization,
): MRT_InternalFilterOption[] => [
  {
    divider: false,
    label: localization.filterFuzzy,
    option: 'fuzzy',
    symbol: '≈',
  },
  {
    divider: false,
    label: localization.filterContains,
    option: 'contains',
    symbol: '*',
  },
  {
    divider: false,
    label: localization.filterStartsWith,
    option: 'startsWith',
    symbol: 'a',
  },
  {
    divider: true,
    label: localization.filterEndsWith,
    option: 'endsWith',
    symbol: 'z',
  },
  {
    divider: false,
    label: localization.filterEquals,
    option: 'equals',
    symbol: '=',
  },
  {
    divider: true,
    label: localization.filterNotEquals,
    option: 'notEquals',
    symbol: '≠',
  },
  {
    divider: false,
    label: localization.filterBetween,
    option: 'between',
    symbol: '⇿',
  },
  {
    divider: true,
    label: localization.filterBetweenInclusive,
    option: 'betweenInclusive',
    symbol: '⬌',
  },
  {
    divider: false,
    label: localization.filterGreaterThan,
    option: 'greaterThan',
    symbol: '>',
  },
  {
    divider: false,
    label: localization.filterGreaterThanOrEqualTo,
    option: 'greaterThanOrEqualTo',
    symbol: '≥',
  },
  {
    divider: false,
    label: localization.filterLessThan,
    option: 'lessThan',
    symbol: '<',
  },
  {
    divider: true,
    label: localization.filterLessThanOrEqualTo,
    option: 'lessThanOrEqualTo',
    symbol: '≤',
  },
  {
    divider: false,
    label: localization.filterEmpty,
    option: 'empty',
    symbol: '∅',
  },
  {
    divider: false,
    label: localization.filterNotEmpty,
    option: 'notEmpty',
    symbol: '!∅',
  },
];

export const rangeModes = ['between', 'betweenInclusive', 'inNumberRange'];
export const emptyModes = ['empty', 'notEmpty'];
export const arrModes = ['arrIncludesSome', 'arrIncludesAll', 'arrIncludes'];
export const rangeVariants = [
  'range-slider',
  'date-range',
  'datetime-range',
  'range',
];

/** The localized name of a filter mode, e.g. `contains` -> "Contains". */
export const getFilterModeLabel = (
  localization: MRT_Localization,
  option?: string,
): string =>
  option
    ? ((localization as unknown as Record<string, string>)[
        `filter${option.charAt(0).toUpperCase()}${option.slice(1)}`
      ] ?? '')
    : '';
