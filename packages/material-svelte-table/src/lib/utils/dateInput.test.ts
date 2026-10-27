import { describe, expect, it } from 'vitest';
import {
  formatDateInput,
  getDateInputType,
  parseDateInput,
} from './dateInput';

describe('dateInput', () => {
  it('maps filter variants to input types', () => {
    expect(getDateInputType('date')).toBe('date');
    expect(getDateInputType('date-range')).toBe('date');
    expect(getDateInputType('datetime')).toBe('datetime-local');
    expect(getDateInputType('datetime-range')).toBe('datetime-local');
    expect(getDateInputType('time-range')).toBe('time');
  });

  it('parses dates in local time, not UTC', () => {
    const date = parseDateInput('date', '2024-03-05') as Date;
    expect(date.getFullYear()).toBe(2024);
    expect(date.getMonth()).toBe(2);
    expect(date.getDate()).toBe(5);
    expect(date.getHours()).toBe(0);
  });

  it('parses datetimes and times', () => {
    const date = parseDateInput('datetime-local', '2024-03-05T13:45') as Date;
    expect(date.getHours()).toBe(13);
    expect(date.getMinutes()).toBe(45);
    expect(parseDateInput('time', '09:30')).toBe('09:30');
    expect(parseDateInput('date', '')).toBeNull();
  });

  it('round-trips values', () => {
    expect(formatDateInput('date', parseDateInput('date', '2024-12-31'))).toBe(
      '2024-12-31',
    );
    expect(
      formatDateInput(
        'datetime-local',
        parseDateInput('datetime-local', '2024-01-02T03:04'),
      ),
    ).toBe('2024-01-02T03:04');
    expect(formatDateInput('time', '07:08')).toBe('07:08');
    expect(formatDateInput('date', null)).toBe('');
    expect(formatDateInput('date', 'garbage')).toBe('');
  });
});
