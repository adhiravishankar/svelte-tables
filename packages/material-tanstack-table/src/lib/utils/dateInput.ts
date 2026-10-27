export type DateInputType = 'date' | 'datetime-local' | 'time';

/** The native `<input>` type for a date/time `filterVariant`. */
export const getDateInputType = (filterVariant?: string): DateInputType =>
  filterVariant?.startsWith('time')
    ? 'time'
    : filterVariant?.startsWith('datetime')
      ? 'datetime-local'
      : 'date';

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * Turns a native input value into a filter value:
 * - `date` and `datetime-local` become a `Date` in local time
 * - `time` stays an `HH:mm` string, which compares correctly as text
 * - an empty value becomes `null`
 */
export const parseDateInput = (
  type: DateInputType,
  value: string,
): Date | null | string => {
  if (!value) return null;
  if (type === 'time') return value;
  if (type === 'date') {
    const [year, month, day] = value.split('-').map(Number);
    return new Date(year, month - 1, day);
  }
  const date = new Date(value);
  return isNaN(date.getTime()) ? null : date;
};

/** Formats a filter value for a native date/time input. */
export const formatDateInput = (
  type: DateInputType,
  value: unknown,
): string => {
  if (value === null || value === undefined || value === '') return '';
  if (type === 'time') return typeof value === 'string' ? value : '';
  const date = value instanceof Date ? value : new Date(value as string);
  if (isNaN(date.getTime())) return '';
  const day = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  return type === 'date'
    ? day
    : `${day}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};
