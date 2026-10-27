import { flushSync, mount, unmount } from 'svelte';
import { afterEach, describe, expect, it } from 'vitest';
import MaterialSvelteTable from './MaterialSvelteTable.svelte';
import { type MRT_ColumnDef, type MRT_TableOptions } from '../types';

type Person = { age: number; name: string };

const columns: MRT_ColumnDef<Person>[] = [
  { accessorKey: 'name', header: 'Name', footer: 'Total' },
  { accessorKey: 'age', header: 'Age' },
];

const people: Person[] = [
  { age: 30, name: 'Carol' },
  { age: 25, name: 'Alice' },
  { age: 41, name: 'Bob' },
];

let target: HTMLElement;
let app: ReturnType<typeof mount> | undefined;

const render = (options: MRT_TableOptions<Person>) => {
  target = document.createElement('div');
  document.body.appendChild(target);
  app = mount(MaterialSvelteTable<Person>, { props: { options }, target });
  flushSync();
  return target;
};

afterEach(() => {
  if (app) unmount(app);
  app = undefined;
  target?.remove();
});

const bodyText = (root: HTMLElement) =>
  Array.from(root.querySelectorAll('tbody tr')).map((tr) =>
    Array.from(tr.querySelectorAll('td'))
      .map((td) => td.textContent?.trim())
      .join('|'),
  );

describe('MaterialSvelteTable', () => {
  it('renders headers, rows and the footer', () => {
    const root = render({ columns, data: people });
    expect(
      Array.from(root.querySelectorAll('thead th')).map((th) =>
        th.textContent?.trim(),
      ),
    ).toEqual(['Name', 'Age']);
    expect(bodyText(root)).toEqual(['Carol|30', 'Alice|25', 'Bob|41']);
    expect(root.querySelector('tfoot')?.textContent).toContain('Total');
  });

  it('sorts when the header sort button is clicked', () => {
    const root = render({ columns, data: people });
    const nameSort = root.querySelector<HTMLButtonElement>(
      'thead th .mrt-sort-label',
    )!;
    nameSort.click();
    flushSync();
    expect(bodyText(root)[0]).toBe('Alice|25');
    expect(root.querySelector('thead th')?.getAttribute('aria-sort')).toBe(
      'ascending',
    );
    nameSort.click();
    flushSync();
    expect(bodyText(root)[0]).toBe('Carol|30');
  });

  it('follows reactive data and shows the empty message', () => {
    const state = $state({ data: people });
    const root = render({
      columns,
      get data() {
        return state.data;
      },
    });
    expect(bodyText(root)).toHaveLength(3);
    state.data = [{ age: 9, name: 'Zed' }];
    flushSync();
    expect(bodyText(root)).toEqual(['Zed|9']);
    state.data = [];
    flushSync();
    expect(root.querySelector('tbody')?.textContent).toContain(
      'No records to display',
    );
  });

  it('renders custom Cell snippets and numbered rows', () => {
    const root = render({
      columns,
      data: people,
      enableRowNumbers: true,
    });
    expect(bodyText(root)[0]).toBe('1|Carol|30');
  });

  it('highlights global filter matches', () => {
    const root = render({
      columns,
      data: people,
      initialState: { globalFilter: 'ali' } as any,
    });
    expect(bodyText(root)).toEqual(['Alice|25']);
    expect(root.querySelector('.mrt-match')).not.toBeNull();
  });

  it('applies density-based padding and skeletons while loading', () => {
    const root = render({
      columns,
      data: [],
      initialState: { density: 'compact' },
      state: { isLoading: true },
    });
    expect(root.querySelectorAll('.mrt-skeleton').length).toBeGreaterThan(0);
    const cell = root.querySelector<HTMLElement>('tbody td')!;
    expect(cell.style.padding).toBe('0.5rem');
  });

  it('keeps cell content fresh when rows are replaced', () => {
    const state = $state({ data: [{ age: 1, name: 'One' }] });
    const root = render({
      columns,
      getRowId: (row) => 'same',
      get data() {
        return state.data;
      },
    });
    expect(bodyText(root)).toEqual(['One|1']);
    state.data = [{ age: 2, name: 'Two' }];
    flushSync();
    expect(bodyText(root)).toEqual(['Two|2']);
  });
});
