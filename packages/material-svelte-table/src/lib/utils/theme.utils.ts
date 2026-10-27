import { type MRT_Theme } from '../types';

/**
 * Default MRT theme colors, derived from the SMUI / Material theme CSS
 * variables (`--mdc-theme-*`). Override any of them with the `mrtTheme` option.
 */
export const getMRTTheme = (
  mrtTheme?: Partial<MRT_Theme>,
): Required<MRT_Theme> => {
  const surface = 'var(--mdc-theme-surface, #ffffff)';
  const primary = 'var(--mdc-theme-primary, #6200ee)';
  const onSurface = 'var(--mdc-theme-on-surface, #000000)';
  return {
    baseBackgroundColor: surface,
    cellNavigationOutlineColor: primary,
    draggingBorderColor: primary,
    matchHighlightColor: `color-mix(in srgb, ${primary} 35%, transparent)`,
    menuBackgroundColor: `color-mix(in srgb, ${onSurface} 4%, ${surface})`,
    pinnedRowBackgroundColor: `color-mix(in srgb, ${primary} 10%, ${surface})`,
    selectedRowBackgroundColor: `color-mix(in srgb, ${primary} 12%, ${surface})`,
    ...mrtTheme,
  };
};
