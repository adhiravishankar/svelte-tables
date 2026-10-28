import type { HeadlessColumnDef, RowData } from '../types';

export const SELECT_COLUMN_WIDTH = 48;
export const EXPAND_COLUMN_WIDTH = 48;

/** `{ width: '10px' }` -> `width: 10px`. Strings pass through. */
export const styleToString = (style: unknown): string =>
  typeof style === 'string'
    ? style
    : Object.entries((style ?? {}) as Record<string, string | number>)
        .map(([name, value]) => `${name}: ${value}`)
        .join('; ');

/**
 * The flex sizing of a header, filter or body cell. Columns with a width keep
 * it, the rest share the free space; the resize plugin's width wins.
 */
export function cellStyle<TData extends RowData>(
  column: HeadlessColumnDef<TData> | undefined,
  attrsStyle?: unknown,
): string {
  const resized = styleToString(attrsStyle);
  const align =
    column?.align === 'end' ? 'justify-content: flex-end' : column?.align === 'center' ? 'justify-content: center' : '';
  let sizing: string;
  if (resized) {
    sizing = `${resized}; flex: 0 0 auto`;
  } else if (column?.width) {
    sizing = `flex: 0 0 ${column.width}px`;
  } else {
    sizing = `flex: 1 1 0; min-width: ${column?.minWidth ?? 96}px`;
  }
  return [sizing, align].filter(Boolean).join('; ');
}
