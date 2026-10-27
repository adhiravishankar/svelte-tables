import { flushSync } from 'svelte';
import { describe, expect, it } from 'vitest';
import { createShadcnSvelteTable } from './createShadcnSvelteTable.svelte';
import { type MRT_ColumnDef } from './types';

type Person = { age: number; name: string };

const columns: MRT_ColumnDef<Person>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'age', header: 'Age' },
];

const people: Person[] = [
  { age: 30, name: 'Carol' },
  { age: 25, name: 'Alice' },
  { age: 41, name: 'Bob' },
];

/** Runs `fn` inside an effect root (a stand-in for component init). */
const withRoot = <T>(fn: () => T): T => {
  let result!: T;
  const cleanup = $effect.root(() => {
    result = fn();
  });
  flushSync();
  // cleanup is deferred so the caller can still read from the table
  (result as any).__cleanup = cleanup;
  return result;
};

describe('createShadcnSvelteTable', () => {
  it('builds rows and headers from columns and data', () => {
    const table = withRoot(() =>
      createShadcnSvelteTable({ columns, data: people }),
    );
    expect(table.getRowModel().rows).toHaveLength(3);
    const headers = table.getHeaderGroups()[0].headers.map((h) => h.id);
    expect(headers).toEqual(['name', 'age']);
  });

  it('follows reactive data through a getter', () => {
    let data = $state(people);
    const table = withRoot(() =>
      createShadcnSvelteTable({
        columns,
        get data() {
          return data;
        },
      }),
    );
    expect(table.getRowModel().rows).toHaveLength(3);
    data = [...people, { age: 50, name: 'Dave' }];
    flushSync();
    expect(table.getRowModel().rows).toHaveLength(4);
  });

  it('sorts and fuzzy-filters with the registered MRT functions', () => {
    const table = withRoot(() =>
      createShadcnSvelteTable({ columns, data: people }),
    );
    table.setSorting([{ desc: false, id: 'name' }]);
    flushSync();
    expect(table.getRowModel().rows.map((r) => r.original.name)).toEqual([
      'Alice',
      'Bob',
      'Carol',
    ]);
    table.setColumnFilters([{ id: 'name', value: 'ali' }]);
    flushSync();
    expect(table.getRowModel().rows.map((r) => r.original.name)).toEqual([
      'Alice',
    ]);
  });

  it('keeps MRT-only state and setters working', () => {
    const table = withRoot(() =>
      createShadcnSvelteTable({ columns, data: people }),
    );
    expect(table.mrtState.density).toBe('comfortable');
    table.setDensity('compact');
    flushSync();
    expect(table.mrtState.density).toBe('compact');
    table.setIsFullScreen(true);
    flushSync();
    expect(table.mrtState.isFullScreen).toBe(true);
    expect(document.body.style.height).toBe('100dvh');
    table.setIsFullScreen(false);
    flushSync();
    expect(document.body.style.height).toBe('');
  });

  it('lets the state option control MRT state', () => {
    const ui = $state<{ density: 'compact' | 'comfortable' | 'spacious' }>({
      density: 'spacious',
    });
    const table = withRoot(() =>
      createShadcnSvelteTable({
        columns,
        data: people,
        onDensityChange: (updater) => {
          ui.density =
            typeof updater === 'function' ? updater(ui.density) : updater;
        },
        state: {
          get density() {
            return ui.density;
          },
        },
      }),
    );
    expect(table.mrtState.density).toBe('spacious');
    table.setDensity('compact');
    flushSync();
    expect(ui.density).toBe('compact');
    expect(table.mrtState.density).toBe('compact');
  });

  it('adds display columns and orders them first', () => {
    const table = withRoot(() =>
      createShadcnSvelteTable({
        columns,
        data: people,
        enableRowNumbers: true,
        enableRowSelection: true,
      }),
    );
    expect(table.getAllLeafColumns().map((c) => c.id)).toEqual([
      'mrt-row-select',
      'mrt-row-numbers',
      'name',
      'age',
    ]);
    expect(table.atoms.columnOrder.get()).toEqual([
      'mrt-row-select',
      'mrt-row-numbers',
      'name',
      'age',
    ]);
  });

  it('shows skeleton rows while loading with no data', () => {
    const table = withRoot(() =>
      createShadcnSvelteTable({
        columns,
        data: [],
        state: { isLoading: true },
      }),
    );
    expect(table.getRowModel().rows.length).toBeGreaterThan(0);
  });

  it('paginates once data arrives after an empty first render', () => {
    let data = $state<Person[]>([]);
    const rows = Array.from({ length: 25 }, (_, i) => ({
      age: i,
      name: `P${i}`,
    }));
    const table = withRoot(() =>
      createShadcnSvelteTable({
        columns,
        get data() {
          return data;
        },
        initialState: { pagination: { pageIndex: 0, pageSize: 10 } },
      }),
    );
    expect(table.options.manualPagination).toBe(true);
    data = rows;
    flushSync();
    expect(table.options.manualPagination).toBe(false);
    expect(table.getRowModel().rows).toHaveLength(10);
  });
});
