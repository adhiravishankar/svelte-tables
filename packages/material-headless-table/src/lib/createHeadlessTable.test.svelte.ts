import { flushSync } from 'svelte';
import { afterEach, describe, expect, it } from 'vitest';
import { createHeadlessTable } from './createHeadlessTable.svelte';
import type { HeadlessTableOptions } from './types';

type Person = { age: number; city: string; name: string };
const people: Person[] = [
  { age: 31, city: 'Paris', name: 'Carol' },
  { age: 25, city: 'Rome', name: 'Bob' },
  { age: 40, city: 'Paris', name: 'Alice' },
  { age: 19, city: 'Oslo', name: 'Dave' },
];

let cleanup: (() => void) | undefined;
afterEach(() => cleanup?.());

function setup(options: Partial<HeadlessTableOptions<Person>> = {}) {
  let table!: ReturnType<typeof createHeadlessTable<Person>>;
  cleanup = $effect.root(() => {
    table = createHeadlessTable<Person>(() => ({
      columns: [
        { accessor: 'name', header: 'Name' },
        { accessor: 'age', header: 'Age' },
        { accessor: 'city', header: 'City' },
      ],
      data: people,
      enableColumnFilters: true,
      enableRowSelection: true,
      getRowId: (row) => row.name,
      ...options,
    }));
  });
  flushSync();
  return table;
}
const names = (table: ReturnType<typeof setup>) =>
  table.rows.map((row: any) => row.original.name);

describe('createHeadlessTable', () => {
  it('lists the rows', () => {
    expect(names(setup())).toEqual(['Carol', 'Bob', 'Alice', 'Dave']);
  });

  it('sorts', () => {
    const table = setup();
    table.setSorting('name');
    flushSync();
    expect(names(table)).toEqual(['Alice', 'Bob', 'Carol', 'Dave']);
    table.setSorting('name');
    flushSync();
    expect(names(table)).toEqual(['Dave', 'Carol', 'Bob', 'Alice']);
    expect(table.state.sorting).toEqual([{ desc: true, id: 'name' }]);
  });

  it('filters a column and searches all columns', () => {
    const table = setup();
    table.setColumnFilter('city', 'par');
    flushSync();
    expect(names(table)).toEqual(['Carol', 'Alice']);
    table.resetFilters();
    table.setGlobalFilter('ob');
    flushSync();
    expect(names(table)).toEqual(['Bob']);
  });

  it('pages', () => {
    const table = setup({ initialState: { pageSize: 3 } });
    expect(names(table)).toEqual(['Carol', 'Bob', 'Alice']);
    expect(table.pageCount).toBe(2);
    table.setPageIndex(1);
    flushSync();
    expect(names(table)).toEqual(['Dave']);
  });

  it('selects rows', () => {
    const table = setup();
    table.toggleRow('Bob');
    flushSync();
    expect(table.isRowSelected('Bob')).toBe(true);
    expect(table.selectedRows.map((row) => row.name)).toEqual(['Bob']);
    table.toggleAllRows(true);
    flushSync();
    expect(table.allSelected).toBe(true);
    table.toggleAllRows(false);
    flushSync();
    expect(table.selectedRows).toEqual([]);
  });

  it('hides columns', () => {
    const table = setup();
    table.toggleColumn('age', false);
    flushSync();
    expect(table.visibleColumns.map((column: any) => column.id)).toEqual(['name', 'city']);
  });
});
