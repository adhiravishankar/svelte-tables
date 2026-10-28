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

describe('createHeadlessTable: more features', () => {
  const ids = (table: ReturnType<typeof setup>) =>
    table.visibleColumns.map((column: any) => column.id);

  it('orders columns', () => {
    const table = setup({ enableColumnOrdering: true });
    table.moveColumn('city', 'name');
    flushSync();
    expect(ids(table)).toEqual(['city', 'name', 'age']);
    expect(table.state.columnOrder).toEqual(['city', 'name', 'age']);
  });

  it('pins columns and offsets them by the measured widths', () => {
    const table = setup({ enableColumnPinning: true });
    table.pinColumn('city', 'start');
    table.pinColumn('name', 'end');
    flushSync();
    expect(ids(table)).toEqual(['city', 'age', 'name']);
    table.setColumnWidth('age', 100);
    table.setColumnWidth('name', 120);
    table.setColumnWidth('city', 80);
    expect(table.pinOffset('city')).toBe(48);
    expect(table.pinOffset('name')).toBe(0);
    table.pinColumn('city', false);
    flushSync();
    expect(table.pinOf('city')).toBeUndefined();
  });

  it('groups rows and aggregates', () => {
    const table = setup({
      columns: [
        { accessor: 'name', header: 'Name' },
        { accessor: 'age', aggregate: 'mean', header: 'Age' },
        { accessor: 'city', header: 'City' },
      ],
      enableGrouping: true,
    });
    table.toggleGrouping('city');
    flushSync();
    const groups = table.rows.filter((row: any) => !row.isData());
    expect(groups).toHaveLength(3);
    const paris = groups.find((row: any) => row.cellForId.city.value === 'Paris') as any;
    expect(paris.cellForId.age.value).toBe(35.5);
    expect(table.rows).toHaveLength(3);
    table.toggleGroupRow(paris.id);
    flushSync();
    expect(table.rows).toHaveLength(5);
    expect(table.isGroupExpanded(paris.id)).toBe(true);
  });

  it('switches the search mode', () => {
    const table = setup({ enableGrouping: false });
    table.setGlobalFilter('crl');
    flushSync();
    expect(names(table)).toEqual([]);
    table.setGlobalFilterMode('fuzzy');
    flushSync();
    expect(names(table)).toEqual(['Carol']);
    table.setGlobalFilterMode('startsWith');
    table.setGlobalFilter('b');
    flushSync();
    expect(names(table)).toEqual(['Bob']);
  });

  it('edits a cell and a row', async () => {
    const saved: unknown[] = [];
    const table = setup({
      enableEditing: true,
      onEditSave: (context) => {
        saved.push(context);
      },
    });
    table.startEditing('Bob', 'age');
    expect(table.draft).toEqual({ age: 25 });
    table.setDraft('age', 26);
    await table.saveEditing();
    expect(saved).toEqual([{ row: people[1], rowId: 'Bob', values: { age: 26 } }]);
    expect(table.state.editing).toBeNull();

    table.startEditing('Dave');
    expect(table.state.editing).toEqual({ columnId: undefined, rowId: 'Dave' });
    expect(table.draft).toEqual({ age: 19, city: 'Oslo', name: 'Dave' });
    table.cancelEditing();
    expect(table.state.editing).toBeNull();
  });
});
