import { flushSync, mount, unmount } from 'svelte';
import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import type { HeadlessColumnDef, HeadlessTableOptions } from '../types';
import MaterialHeadlessTable from './MaterialHeadlessTable.svelte';

type Person = { age: number; city: string; name: string };

const columns: HeadlessColumnDef<Person>[] = [
  { accessor: 'name', header: 'Name', footer: 'Total' },
  { accessor: 'age', header: 'Age', filterVariant: 'range' },
  { accessor: 'city', header: 'City', filterVariant: 'select' },
];

const people: Person[] = [
  { age: 30, city: 'Paris', name: 'Carol' },
  { age: 25, city: 'Rome', name: 'Alice' },
  { age: 41, city: 'Paris', name: 'Bob' },
  { age: 19, city: 'Oslo', name: 'Dave' },
];

let target: HTMLElement;
let app: ReturnType<typeof mount> | undefined;

const render = (options: Partial<HeadlessTableOptions<Person>> = {}) => {
  target = document.createElement('div');
  document.body.appendChild(target);
  app = mount(MaterialHeadlessTable<Person>, {
    props: { columns, data: people, getRowId: (row: Person) => row.name, ...options },
    target,
  });
  flushSync();
  return target;
};

// jsdom has no ResizeObserver, which the virtual list needs
beforeAll(() => {
  globalThis.ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

afterEach(() => {
  if (app) unmount(app);
  app = undefined;
  target?.remove();
});

// let the components apply the state changes
const settle = () => new Promise((resolve) => setTimeout(resolve, 0));

const rows = (root: HTMLElement) =>
  Array.from(root.querySelectorAll('.hdt-body-row')).map((row) =>
    Array.from(row.querySelectorAll('[role="cell"]:not(.hdt-fixed)'))
      .map((cell) => cell.textContent?.trim())
      .join('|'),
  );
const names = (root: HTMLElement) => rows(root).map((row) => row.split('|')[0]);
const header = (root: HTMLElement, text: string) =>
  Array.from(root.querySelectorAll<HTMLElement>('.hdt-head-cell')).find((cell) =>
    cell.textContent?.includes(text),
  )!;
const type = (input: HTMLInputElement, value: string) => {
  input.value = value;
  input.dispatchEvent(new Event('input', { bubbles: true }));
  flushSync();
};

describe('MaterialHeadlessTable', () => {
  it('renders headers, rows and the footer', () => {
    const root = render();
    expect(Array.from(root.querySelectorAll('.hdt-head-cell')).map((c) => c.textContent?.trim())).toEqual([
      'Name',
      'Age',
      'City',
    ]);
    expect(rows(root)).toEqual(['Carol|30|Paris', 'Alice|25|Rome', 'Bob|41|Paris', 'Dave|19|Oslo']);
    expect(root.querySelector('.hdt-foot-row')?.textContent).toContain('Total');
  });

  it('sorts when a header is clicked', () => {
    const root = render();
    header(root, 'Name').querySelector<HTMLElement>('button')!.click();
    flushSync();
    expect(names(root)).toEqual(['Alice', 'Bob', 'Carol', 'Dave']);
    expect(header(root, 'Name').getAttribute('aria-sort')).toBe('ascending');
    header(root, 'Name').querySelector<HTMLElement>('button')!.click();
    flushSync();
    expect(names(root)).toEqual(['Dave', 'Carol', 'Bob', 'Alice']);
  });

  it('searches every column', () => {
    const root = render();
    type(root.querySelector<HTMLInputElement>('input[aria-label="Search"]')!, 'rom');
    expect(names(root)).toEqual(['Alice']);
    type(root.querySelector<HTMLInputElement>('input[aria-label="Search"]')!, 'zzz');
    expect(root.querySelector('.hdt-empty')?.textContent).toContain('No results found');
  });

  it('filters columns with text, select and range filters', () => {
    const root = render({ enableColumnFilters: true });
    const name = root.querySelector<HTMLInputElement>('input[aria-label="Filter by Name"]')!;
    type(name, 'a');
    expect(names(root)).toEqual(['Carol', 'Alice', 'Dave']);
    type(name, '');

    const city = root.querySelector<HTMLSelectElement>('select[aria-label="Filter by City"]')!;
    city.value = 'Paris';
    city.dispatchEvent(new Event('change', { bubbles: true }));
    flushSync();
    expect(names(root)).toEqual(['Carol', 'Bob']);

    const [min] = root.querySelectorAll<HTMLInputElement>('input[type="number"]');
    type(min, '35');
    expect(names(root)).toEqual(['Bob']);
  });

  it('pages', () => {
    const root = render({ initialState: { pageSize: 3 }, pageSizes: [3, 10] });
    expect(names(root)).toEqual(['Carol', 'Alice', 'Bob']);
    expect(root.querySelector('.hdt-pagination-range')?.textContent).toBe('1–3 of 4');
    root.querySelector<HTMLElement>('button[aria-label="Go to next page"]')!.click();
    flushSync();
    expect(names(root)).toEqual(['Dave']);
    expect(root.querySelector('.hdt-pagination-range')?.textContent).toBe('4–4 of 4');
  });

  it('selects rows', async () => {
    const selected: string[][] = [];
    const root = render({
      enableRowSelection: true,
      onSelectionChange: (rows) => selected.push(rows.map((row) => row.name)),
    });
    const boxes = () => Array.from(root.querySelectorAll<HTMLInputElement>('.hdt-body-row input[type="checkbox"]'));
    boxes()[1].click();
    flushSync();
    await settle();
    expect(boxes()[1].checked).toBe(true);
    expect(root.querySelector('.hdt-selected-count')?.textContent).toContain('1 of 4');
    root.querySelector<HTMLElement>('.hdt-head input[type="checkbox"]')!.click();
    flushSync();
    await settle();
    expect(boxes().every((box) => box.checked)).toBe(true);
    expect(selected.at(-1)).toHaveLength(4);
  });

  it('hides and shows columns', async () => {
    const root = render({ initialState: { hiddenColumns: ['age'] } });
    expect(rows(root)[0]).toBe('Carol|Paris');
    expect(root.querySelectorAll('.hdt-head-cell')).toHaveLength(2);
  });

  it('shows a detail panel for an expanded row', () => {
    const root = render({
      // a snippet is needed to enable the panel; the test only checks the button
      renderDetailPanel: (() => {}) as any,
    });
    expect(root.querySelectorAll('.hdt-body-row button[aria-label="Expand"]')).toHaveLength(4);
  });

  it('shows the loading bar', () => {
    const root = render({ isLoading: true });
    expect(root.querySelector('[role="progressbar"]')).toBeTruthy();
  });

  it('renders rows with the virtual list', () => {
    const root = render({ enableVirtualization: true, height: 300 });
    expect(root.querySelector('[data-svl-viewport]')).toBeTruthy();
    expect(root.querySelector('.hdt-pagination')).toBeNull();
    expect(root.querySelector('.hdt-total')?.textContent).toContain('4 of 4');
    expect(root.querySelectorAll('.hdt-body-row').length).toBeGreaterThan(0);
  });
});
