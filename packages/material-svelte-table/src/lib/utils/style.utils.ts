import {
  type MRT_Column,
  type MRT_DensityState,
  type MRT_Header,
  type MRT_RowData,
  type MRT_TableInstance,
} from '../types';

export const parseCSSVarId = (id: string) => id.replace(/[^a-zA-Z0-9]/g, '_');

export type StyleObject = Record<string, null | number | string | undefined | false>;

const UNITLESS = new Set([
  'flex',
  'flex-grow',
  'flex-shrink',
  'font-weight',
  'line-height',
  'opacity',
  'order',
  'z-index',
]);

const kebab = (key: string) =>
  key.startsWith('--') ? key : key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);

/** Serializes a style object (camelCase or kebab-case keys) to a style attribute. */
export const styleToString = (style: StyleObject): string =>
  Object.entries(style)
    .filter(([, value]) => value !== undefined && value !== null && value !== false)
    .map(([key, value]) => {
      const prop = kebab(key);
      const css =
        typeof value === 'number' && value !== 0 && !prop.startsWith('--') && !UNITLESS.has(prop)
          ? `${value}px`
          : String(value);
      return `${prop}: ${css}`;
    })
    .join('; ');

/**
 * Joins style fragments (objects or strings) into one style attribute. Later
 * fragments win, so user-provided `style` can override the computed styles.
 */
export const mergeStyles = (
  ...styles: Array<StyleObject | string | null | undefined | false>
): string =>
  styles
    .map((s) => (typeof s === 'object' && s ? styleToString(s) : s))
    .filter(Boolean)
    .join('; ');

export const isGridLayout = (layoutMode?: string) =>
  !!layoutMode?.startsWith('grid');

/** Cell padding for each density, matching Material React Table. */
export const getCellPadding = ({
  columnDefType,
  density,
  kind,
}: {
  columnDefType?: string;
  density: MRT_DensityState;
  kind: 'body' | 'footer' | 'head';
}): string => {
  const isDisplay = columnDefType === 'display';
  if (kind === 'footer') {
    return density === 'compact'
      ? '0.5rem'
      : density === 'comfortable'
        ? '1rem'
        : '1.5rem';
  }
  if (kind === 'head') {
    return density === 'compact'
      ? '0.5rem'
      : density === 'comfortable'
        ? isDisplay
          ? '0.75rem'
          : '1rem'
        : isDisplay
          ? '1rem 1.25rem'
          : '1.5rem';
  }
  return density === 'compact'
    ? isDisplay
      ? '0 0.5rem'
      : '0.5rem'
    : density === 'comfortable'
      ? isDisplay
        ? '0.5rem 0.75rem'
        : '1rem'
      : isDisplay
        ? '1rem 1.25rem'
        : '1.5rem';
};

/**
 * Width, flex, pinning and z-index styles shared by head, body and footer
 * cells. Column widths come from the `--header-*-size` / `--col-*-size` CSS
 * variables set on the table element.
 */
export const getCommonMRTCellStyles = <TData extends MRT_RowData>({
  align,
  column,
  header,
  table,
}: {
  align?: string;
  column: MRT_Column<TData>;
  header?: MRT_Header<TData>;
  table: MRT_TableInstance<TData>;
}): StyleObject => {
  const {
    options: { enableColumnVirtualization, layoutMode },
    mrtState: { draggingColumn, hoveredColumn },
  } = table;
  const { columnDef } = column;
  const { columnDefType } = columnDef;
  const grid = isGridLayout(layoutMode);

  const isColumnPinned = columnDefType !== 'group' && column.getIsPinned();

  const sizeVar = `var(--${header ? 'header' : 'col'}-${parseCSSVarId(
    header?.id ?? column.id,
  )}-size)`;

  const style: StyleObject = {
    backgroundColor: 'inherit',
    backgroundImage: 'inherit',
    display: grid ? 'flex' : undefined,
    justifyContent:
      columnDefType === 'group' ? 'center' : grid ? align : undefined,
    minWidth: `max(calc(${sizeVar} * 1px), ${columnDef.minSize ?? 30}px)`,
    opacity:
      draggingColumn?.id === column.id || hoveredColumn?.id === column.id
        ? 0.5
        : 1,
    position: 'relative',
    transition: enableColumnVirtualization ? 'none' : 'padding 150ms ease-in-out',
    width: `calc(${sizeVar} * 1px)`,
    zIndex:
      column.getIsResizing() || draggingColumn?.id === column.id
        ? 2
        : columnDefType !== 'group' && isColumnPinned
          ? 1
          : 0,
  };

  if (layoutMode === 'grid') {
    style.flex = `${
      [0, false].includes(columnDef.grow as number | boolean) ? 0 : sizeVar
    } 0 auto`;
  } else if (layoutMode === 'grid-no-grow') {
    style.flex = `${+(columnDef.grow || 0)} 0 auto`;
  }

  if (isColumnPinned) {
    style.position = 'sticky';
    style.opacity = 0.97;
    style.insetInlineStart =
      isColumnPinned === 'start' ? `${column.getStart('start')}px` : undefined;
    style.insetInlineEnd =
      isColumnPinned === 'end' ? `${column.getAfter('end')}px` : undefined;
  }

  return style;
};

/** Side shadow drawn on the edge of the last/first pinned column. */
export const getPinnedEdge = <TData extends MRT_RowData>(
  column: MRT_Column<TData>,
): 'end' | 'start' | undefined => {
  const pinned = column.getIsPinned();
  if (pinned === 'start' && column.getIsLastColumn('start')) return 'start';
  if (pinned === 'end' && column.getIsFirstColumn('end')) return 'end';
  return undefined;
};

export const getCommonToolbarStyles = <TData extends MRT_RowData>({
  table,
}: {
  table: MRT_TableInstance<TData>;
}): StyleObject => ({
  alignItems: 'flex-start',
  backgroundColor: table.options.mrtTheme.baseBackgroundColor,
  display: 'grid',
  flexWrap: 'wrap-reverse',
  minHeight: '3.5rem',
  overflow: 'hidden',
  position: 'relative',
  transition: 'all 150ms ease-in-out',
  zIndex: 1,
});

/** Style for icons that should mirror in right-to-left layouts. */
export const flipIconStyle = (direction?: string) =>
  direction === 'rtl' ? 'transform: scaleX(-1)' : undefined;
