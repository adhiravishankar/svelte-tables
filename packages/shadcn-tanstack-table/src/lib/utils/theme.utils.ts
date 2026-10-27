import { type MRT_Theme } from '../types';

/**
 * Default MRT theme colors, derived from the shadcn theme CSS variables
 * (`--card`, `--primary`, `--foreground`). Override any of them with the
 * `mrtTheme` option.
 */
export const getMRTTheme = (
  mrtTheme?: Partial<MRT_Theme>,
): Required<MRT_Theme> => {
  const surface = 'var(--card)';
  const primary = 'var(--primary)';
  const onSurface = 'var(--foreground)';
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
