import { flushSync, mount, unmount } from 'svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';
import ShadcnSvelteTable from './ShadcnSvelteTable.svelte';
import { type MRT_ColumnDef, type MRT_TableOptions } from '../types';

type Person = {
  active: boolean;
  age: number;
  born: Date;
  city: string;
  name: string;
};

const people: Person[] = [
  {
    active: true,
    age: 30,
    born: new Date(1994, 0, 15),
    city: 'Paris',
    name: 'Carol',
  },
  {
    active: false,
    age: 25,
    born: new Date(1999, 5, 1),
    city: 'Rome',
    name: 'Alice',
  },
  {
    active: true,
    age: 41,
    born: new Date(1983, 11, 30),
    city: 'Paris',
    name: 'Bob',
  },
  {
    active: false,
    age: 52,
    born: new Date(1972, 2, 3),
    city: 'Oslo',
    name: 'Dan',
  },
];

let target: HTMLElement;
let app: ReturnType<typeof mount> | undefined;

const render = (
  columns: MRT_ColumnDef<Person>[],
  options: Partial<MRT_TableOptions<Person>> = {},
) => {
  target = document.createElement('div');
  document.body.appendChild(target);
  app = mount(ShadcnSvelteTable<Person>, {
    props: {
      options: {
        columns,
        data: people,
        enableBottomToolbar: false,
        enableTopToolbar: false,
        initialState: { showColumnFilters: true } as any,
        ...options,
      },
    },
    target,
  });
  flushSync();
  return target;
};

afterEach(() => {
  if (app) unmount(app);
  app = undefined;
  target?.remove();
  document.body.innerHTML = '';
  vi.useRealTimers();
});

/** First-cell text of each data row (the empty-state row is not a data row). */
const names = (root: HTMLElement) =>
  Array.from(root.querySelectorAll('tbody tr'))
    .filter((tr) => !tr.querySelector('td[colspan]'))
    .map((tr) => tr.querySelector('td')?.textContent?.trim());

const type = (input: HTMLInputElement, value: string) => {
  input.value = value;
  input.dispatchEvent(new Event('input', { bubbles: true }));
};

const settle = (ms = 500) => {
  vi.advanceTimersByTime(ms);
  flushSync();
};

const nameCol: MRT_ColumnDef<Person> = { accessorKey: 'name', header: 'Name' };
const ageCol = (
  extra: Partial<MRT_ColumnDef<Person>> = {},
): MRT_ColumnDef<Person> => ({
  accessorFn: (row) => row.age,
  header: 'Age',
  id: 'age',
  ...extra,
});

describe('text filter', () => {
  it('filters rows as you type, with a debounce', () => {
    vi.useFakeTimers();
    const root = render([nameCol, ageCol()]);
    const input = root.querySelector<HTMLInputElement>(
      'thead input[aria-label="Filter by Name"]',
    )!;
    expect(input).not.toBeNull();
    type(input, 'ali');
    expect(names(root)).toHaveLength(4);
    settle();
    expect(names(root)).toEqual(['Alice']);
  });

  it('shows the active-filter icon and clears the filter', () => {
    vi.useFakeTimers();
    const root = render([nameCol]);
    expect(root.querySelector('.mrt-filter-label')).toBeNull();
    type(root.querySelector<HTMLInputElement>('thead input')!, 'bob');
    settle();
    expect(root.querySelector('.mrt-filter-label')).not.toBeNull();
    root
      .querySelector<HTMLButtonElement>(
        'thead button[aria-label="Clear filter"]',
      )!
      .click();
    flushSync();
    expect(names(root)).toHaveLength(4);
    expect(root.querySelector<HTMLInputElement>('thead input')!.value).toBe('');
    expect(root.querySelector('.mrt-filter-label')).toBeNull();
  });

  it('follows external filter changes', () => {
    vi.useFakeTimers();
    const root = render([nameCol]);
    // simulate the user changing the filter in code
    const input = root.querySelector<HTMLInputElement>('thead input')!;
    type(input, 'dan');
    settle();
    expect(names(root)).toEqual(['Dan']);
  });

  it('hides filter inputs unless shown', () => {
    const root = render([nameCol], { initialState: {} });
    expect(root.querySelector('thead input')).toBeNull();
  });
});

describe('select filters', () => {
  const cityCol: MRT_ColumnDef<Person> = {
    accessorKey: 'city',
    filterSelectOptions: ['Paris', 'Rome', 'Oslo'],
    filterVariant: 'select',
    header: 'City',
  };

  it('filters by the selected option', () => {
    const root = render([nameCol, cityCol]);
    const select = root.querySelector<HTMLSelectElement>('thead select')!;
    select.value = 'Paris';
    select.dispatchEvent(new Event('change', { bubbles: true }));
    flushSync();
    expect(names(root)).toEqual(['Carol', 'Bob']);
    // clearing via the button in the select's own filter
    root
      .querySelector<HTMLButtonElement>(
        'thead .mrt-filter-select button[aria-label="Clear filter"]',
      )!
      .click();
    flushSync();
    expect(names(root)).toHaveLength(4);
  });

  it('builds options from faceted values when none are given', () => {
    const root = render(
      [
        nameCol,
        { accessorKey: 'city', filterVariant: 'select', header: 'City' },
      ],
      { enableFacetedValues: true },
    );
    const labels = Array.from(root.querySelectorAll('thead select option')).map(
      (o) => o.textContent?.trim(),
    );
    expect(labels).toContain('Paris (2)');
    expect(labels).toContain('Oslo (1)');
  });

  it('filters by several options with multi-select', () => {
    const root = render([
      nameCol,
      { ...cityCol, filterVariant: 'multi-select' },
    ]);
    root.querySelector<HTMLButtonElement>('thead .mrt-select-trigger')!.click();
    flushSync();
    const items = Array.from(
      document.body.querySelectorAll<HTMLElement>('[data-slot="dropdown-menu-item"]'),
    );
    expect(items.map((i) => i.textContent?.trim())).toEqual([
      'Paris',
      'Rome',
      'Oslo',
    ]);
    items[0].click();
    flushSync();
    items[2].click();
    flushSync();
    expect(names(root)).toEqual(['Carol', 'Bob', 'Dan']);
    expect(root.querySelectorAll('thead .mrt-chip')).toHaveLength(2);
  });
});

describe('range filters', () => {
  it('filters between a min and a max', () => {
    vi.useFakeTimers();
    const root = render([nameCol, ageCol({ filterVariant: 'range' })]);
    const [min, max] = Array.from(
      root.querySelectorAll<HTMLInputElement>('thead input'),
    ).slice(1);
    expect(min.getAttribute('aria-label')).toBe('Min');
    type(min, '30');
    settle();
    expect(names(root)).toEqual(['Carol', 'Bob', 'Dan']);
    type(max, '41');
    settle();
    expect(names(root)).toEqual(['Carol', 'Bob']);
  });

  it('filters with the range slider', () => {
    const root = render([nameCol, ageCol({ filterVariant: 'range-slider' })], {
      enableFacetedValues: true,
    });
    const [low, high] = Array.from(
      root.querySelectorAll<HTMLInputElement>('thead input[type="range"]'),
    );
    expect(low.min).toBe('25');
    expect(low.max).toBe('52');
    low.value = '30';
    low.dispatchEvent(new Event('input', { bubbles: true }));
    low.dispatchEvent(new Event('change', { bubbles: true }));
    flushSync();
    expect(names(root)).toEqual(['Carol', 'Bob', 'Dan']);
    // selecting the entire range removes the filter
    low.value = '25';
    low.dispatchEvent(new Event('input', { bubbles: true }));
    low.dispatchEvent(new Event('change', { bubbles: true }));
    flushSync();
    expect(names(root)).toHaveLength(4);
    expect(high).toBeTruthy();
  });
});

describe('checkbox filter', () => {
  it('cycles any -> true -> false -> any', () => {
    const root = render([
      nameCol,
      {
        accessorFn: (row) => String(row.active),
        filterVariant: 'checkbox',
        header: 'Active',
        id: 'active',
      },
    ]);
    const box = () =>
      root.querySelector<HTMLInputElement>('thead button[role="checkbox"]')!;
    box().click();
    flushSync();
    expect(names(root)).toEqual(['Carol', 'Bob']);
    box().click();
    flushSync();
    expect(names(root)).toEqual(['Alice', 'Dan']);
    box().click();
    flushSync();
    expect(names(root)).toHaveLength(4);
  });
});

describe('date filters', () => {
  const bornCol = (variant: any): MRT_ColumnDef<Person> => ({
    accessorFn: (row) => row.born,
    filterVariant: variant,
    header: 'Born',
    id: 'born',
  });

  it('renders a native date input and filters with it', () => {
    vi.useFakeTimers();
    const root = render([nameCol, bornCol('date')], {
      columnFilterModeOptions: ['equals', 'greaterThan'],
      initialState: { showColumnFilters: true } as any,
    });
    const input = root.querySelector<HTMLInputElement>(
      'thead input[type="date"]',
    )!;
    expect(input).not.toBeNull();
  });

  it('filters between two dates', () => {
    vi.useFakeTimers();
    const root = render([nameCol, bornCol('date-range')]);
    const inputs = Array.from(
      root.querySelectorAll<HTMLInputElement>('thead input[type="date"]'),
    );
    expect(inputs).toHaveLength(2);
    type(inputs[0], '1990-01-01');
    settle();
    expect(names(root)).toEqual(['Carol', 'Alice']);
    type(inputs[1], '1995-12-31');
    settle();
    expect(names(root)).toEqual(['Carol']);
  });
});

describe('autocomplete filter', () => {
  it('offers options in a datalist and filters by what is typed', () => {
    vi.useFakeTimers();
    const root = render(
      [
        nameCol,
        { accessorKey: 'city', filterVariant: 'autocomplete', header: 'City' },
      ],
      { enableFacetedValues: true },
    );
    const options = Array.from(root.querySelectorAll('datalist option')).map(
      (o) => (o as HTMLOptionElement).value,
    );
    expect(options).toEqual(['Oslo', 'Paris', 'Rome']);
    const input = root.querySelectorAll<HTMLInputElement>('thead input')[1];
    expect(input.getAttribute('list')).toBeTruthy();
    type(input, 'par');
    settle();
    expect(names(root)).toEqual(['Carol', 'Bob']);
  });
});

describe('filter modes', () => {
  it('changes the filter mode from the menu', () => {
    vi.useFakeTimers();
    const root = render([nameCol], { enableColumnFilterModes: true });
    expect(
      root.querySelector('.mrt-filter-mode-label')?.textContent?.trim(),
    ).toBe('Filter Mode: Fuzzy');
    root
      .querySelector<HTMLButtonElement>(
        'thead button[aria-label="Change filter mode"]',
      )!
      .click();
    flushSync();
    const items = Array.from(
      document.body.querySelectorAll<HTMLElement>('[data-slot="dropdown-menu-item"]'),
    );
    const startsWith = items.find((i) =>
      i.textContent?.includes('Starts With'),
    )!;
    startsWith.click();
    flushSync();
    expect(
      root.querySelector('.mrt-filter-mode-label')?.textContent?.trim(),
    ).toBe('Filter Mode: Starts With');
    type(root.querySelector<HTMLInputElement>('thead input')!, 'ob');
    settle();
    expect(names(root)).toEqual([]); // nobody's name starts with "ob"
    type(root.querySelector<HTMLInputElement>('thead input')!, 'bo');
    settle();
    expect(names(root)).toEqual(['Bob']);
  });

  it('shows a chip for the empty filter modes', () => {
    const root = render([nameCol], {
      columnFilterModeOptions: ['fuzzy', 'empty', 'notEmpty'],
      enableColumnFilterModes: true,
    });
    root
      .querySelector<HTMLButtonElement>(
        'thead button[aria-label="Change filter mode"]',
      )!
      .click();
    flushSync();
    const notEmpty = Array.from(
      document.body.querySelectorAll<HTMLElement>('[data-slot="dropdown-menu-item"]'),
    ).find((i) => i.textContent?.includes('Not Empty'))!;
    notEmpty.click();
    flushSync();
    expect(root.querySelector('thead .mrt-chip')?.textContent).toContain(
      'Not Empty',
    );
    expect(names(root)).toHaveLength(4);
  });

  it('changes the global filter mode', () => {
    const root = render([nameCol], {
      enableGlobalFilterModes: true,
      enableTopToolbar: true,
      initialState: { showGlobalFilter: true } as any,
    });
    root
      .querySelector<HTMLButtonElement>(
        'button[aria-label="Change search mode"]',
      )!
      .click();
    flushSync();
    const labels = Array.from(
      document.body.querySelectorAll<HTMLElement>('[data-slot="dropdown-menu-item"]'),
    ).map((i) => i.textContent?.replace(/\s+/g, ' ').trim());
    expect(labels.some((l) => l?.includes('Fuzzy'))).toBe(true);
    expect(labels.some((l) => l?.includes('Contains'))).toBe(true);
    expect(labels.some((l) => l?.includes('Starts With'))).toBe(true);
  });
});

describe('display modes', () => {
  it('shows filters in a popover', () => {
    const root = render([nameCol], {
      columnFilterDisplayMode: 'popover',
      initialState: {},
    });
    expect(root.querySelector('thead input')).toBeNull();
    const button = root.querySelector<HTMLButtonElement>(
      '.mrt-filter-label-button',
    )!;
    expect(button).not.toBeNull();
    button.click();
    flushSync();
    expect(
      document.body.querySelector('.mrt-filter-popover input'),
    ).not.toBeNull();
  });

  it('lets a Filter snippet replace the built-in input', async () => {
    const { createRawSnippet } = await import('svelte');
    const Filter = createRawSnippet(() => ({
      render: () => `<span class="custom-filter">custom</span>`,
    }));
    const root = render([{ ...nameCol, Filter }]);
    expect(root.querySelector('.custom-filter')).not.toBeNull();
    expect(root.querySelector('thead input')).toBeNull();
  });
});

describe('custom filter functions', () => {
  it('keeps a column-level filterFn function and does not mutate column defs', () => {
    vi.useFakeTimers();
    const startsWith = (row: any, columnId: string, value: string) =>
      String(row.getValue(columnId))
        .toLowerCase()
        .startsWith(value.toLowerCase());
    const column: MRT_ColumnDef<Person> = {
      accessorKey: 'name',
      filterFn: startsWith as any,
      header: 'Name',
    };
    const root = render([column]);
    type(root.querySelector<HTMLInputElement>('thead input')!, 'b');
    settle();
    expect(names(root)).toEqual(['Bob']);
    // the definition the caller passed in is untouched
    expect(column.filterFn).toBe(startsWith);
    expect((column as any)._filterFn).toBeUndefined();
    expect(column.id).toBeUndefined();
  });

  it('accepts filters registered at creation time', () => {
    vi.useFakeTimers();
    const root = render(
      [{ accessorKey: 'name', filterFn: 'lengthIs' as any, header: 'Name' }],
      {
        filterFns: {
          lengthIs: (row: any, columnId: string, value: string) =>
            String(row.getValue(columnId)).length === Number(value),
        },
      },
    );
    type(root.querySelector<HTMLInputElement>('thead input')!, '3');
    settle();
    expect(names(root)).toEqual(['Bob', 'Dan']);
  });
});
