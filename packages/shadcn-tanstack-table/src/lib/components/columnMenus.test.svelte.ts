import { createRawSnippet, flushSync, mount, unmount } from 'svelte';
import { afterEach, describe, expect, it } from 'vitest';
import ShadcnSvelteTable from './ShadcnSvelteTable.svelte';
import { type MRT_ColumnDef, type MRT_TableOptions } from '../types';

type Person = { age: number; city: string; name: string };

const columns: MRT_ColumnDef<Person>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'age', header: 'Age' },
  { accessorKey: 'city', header: 'City' },
];

const people: Person[] = [
  { age: 30, city: 'Paris', name: 'Carol' },
  { age: 25, city: 'Rome', name: 'Alice' },
  { age: 41, city: 'Paris', name: 'Bob' },
];

let target: HTMLElement;
let app: ReturnType<typeof mount> | undefined;

const render = (options: Partial<MRT_TableOptions<Person>> = {}) => {
  target = document.createElement('div');
  document.body.appendChild(target);
  app = mount(ShadcnSvelteTable<Person>, {
    props: {
      options: {
        columns,
        data: people,
        enableBottomToolbar: false,
        enableTopToolbar: false,
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
});

const headers = (root: HTMLElement) =>
  Array.from(root.querySelectorAll('thead th')).map((th) =>
    th.querySelector('.mrt-head-cell-label')?.textContent?.trim(),
  );
const firstColumn = (root: HTMLElement) =>
  Array.from(root.querySelectorAll('tbody tr')).map((tr) =>
    tr.querySelector('td')?.textContent?.trim(),
  );
const menuItems = () =>
  Array.from(
    document.body.querySelectorAll<HTMLElement>('[data-slot="dropdown-menu-item"]'),
  );
const itemText = (el: HTMLElement) =>
  el.textContent?.replace(/\s+/g, ' ').trim();
const clickItem = (text: string) => {
  const item = menuItems().find((i) => itemText(i)?.includes(text));
  expect(item, `menu item "${text}"`).toBeTruthy();
  item!.click();
  flushSync();
};
const openActions = (root: HTMLElement, index = 0) => {
  root
    .querySelectorAll<HTMLButtonElement>(
      'thead button[aria-label="Column Actions"]',
    )
    [index].click();
  flushSync();
};

describe('column actions menu', () => {
  it('adds an actions button to every column by default', () => {
    const root = render();
    expect(
      root.querySelectorAll('thead button[aria-label="Column Actions"]'),
    ).toHaveLength(3);
    const off = render({ enableColumnActions: false });
    expect(
      off.querySelectorAll('thead button[aria-label="Column Actions"]'),
    ).toHaveLength(0);
  });

  it('sorts from the menu', () => {
    const root = render();
    openActions(root, 0);
    const labels = menuItems().map(itemText);
    expect(labels).toContain('Clear sort');
    expect(labels).toContain('Sort by Name ascending');
    clickItem('Sort by Name ascending');
    expect(firstColumn(root)).toEqual(['Alice', 'Bob', 'Carol']);
    expect(document.body.querySelector('[data-slot="dropdown-menu-content"]')).toBeNull();
    openActions(root, 0);
    clickItem('Sort by Name descending');
    expect(firstColumn(root)).toEqual(['Carol', 'Bob', 'Alice']);
    openActions(root, 0);
    clickItem('Clear sort');
    expect(firstColumn(root)).toEqual(['Carol', 'Alice', 'Bob']);
  });

  it('hides a column and shows all again', () => {
    const root = render();
    openActions(root, 1);
    clickItem('Hide Age column');
    expect(headers(root)).toEqual(['Name', 'City']);
    openActions(root, 0);
    clickItem('Show all columns');
    expect(headers(root)).toEqual(['Name', 'Age', 'City']);
  });

  it('pins a column to the start', () => {
    const root = render({ enableColumnPinning: true });
    openActions(root, 2);
    clickItem('Pin to left');
    const th = root.querySelector('thead th[data-pinned]');
    expect(th?.textContent).toContain('City');
    expect(th?.getAttribute('style')).toContain('position: sticky');
    expect(th?.getAttribute('style')).toContain('inset-inline-start: 0px');
    // pinned columns move to the front
    expect(headers(root)[0]).toBe('City');
    openActions(root, 0);
    clickItem('Unpin');
    expect(root.querySelector('thead th[data-pinned]')).toBeNull();
  });

  it('filters by column from the menu', () => {
    const root = render();
    expect(root.querySelector('thead input')).toBeNull();
    openActions(root, 0);
    clickItem('Filter by Name');
    expect(root.querySelector('thead input')).not.toBeNull();
  });

  it('clears a column filter from the menu', () => {
    const root = render({ initialState: { showColumnFilters: true } as any });
    const getColumn = (id: string) => id;
    expect(getColumn('name')).toBe('name');
    openActions(root, 0);
    const clear = menuItems().find((i) =>
      itemText(i)?.includes('Clear filter'),
    )!;
    expect(clear.getAttribute('aria-disabled')).toBe('true');
  });

  it('groups by a column', () => {
    const root = render({ enableGrouping: true });
    openActions(root, 2);
    clickItem('Group by City');
    // like TanStack's 'reorder' mode, the grouped column comes first
    expect(headers(root)[0]).toBe('City');
    expect(root.querySelectorAll('thead th')).toHaveLength(4); // + expand column
    expect(firstColumn(root)).toHaveLength(2); // Paris and Rome groups
  });

  it('lets a snippet replace or extend the items', () => {
    const columnActionsMenuItems = createRawSnippet<[any]>(() => ({
      render: () => `<li class="custom-item" role="menuitem">Custom</li>`,
    }));
    const root = render({ columnActionsMenuItems });
    openActions(root, 0);
    expect(document.body.querySelector('.custom-item')).not.toBeNull();
    expect(menuItems().map(itemText)).not.toContain('Clear sort');
  });
});

describe('show/hide columns menu', () => {
  const openMenu = (root: HTMLElement) => {
    document.body.appendChild(root);
    root.parentElement; // keep the root attached
  };

  const render2 = (options: Partial<MRT_TableOptions<Person>> = {}) => {
    const root = render({ enableTopToolbar: true, ...options });
    openMenu(root);
    root
      .querySelector<HTMLButtonElement>(
        'button[aria-label="Show/Hide columns"]',
      )!
      .click();
    flushSync();
    return root;
  };

  const switches = () =>
    Array.from(
      document.body.querySelectorAll<HTMLElement>('[role="switch"]'),
    );

  it('lists the columns with switches', () => {
    render2();
    expect(switches()).toHaveLength(3);
    expect(
      switches().every((s) => s.getAttribute('aria-checked') === 'true'),
    ).toBe(true);
  });

  it('toggles a column from its switch', () => {
    const root = render2();
    switches()[1].click();
    flushSync();
    expect(headers(root)).toEqual(['Name', 'City']);
    expect(switches()[1].getAttribute('aria-checked')).toBe('false');
  });

  it('hides and shows all columns', () => {
    const root = render2();
    const button = (text: string) =>
      Array.from(
        document.body.querySelectorAll<HTMLButtonElement>('button'),
      ).find((b) => b.textContent?.trim() === text)!;
    button('Hide all').click();
    flushSync();
    expect(headers(root)).toEqual([]);
    button('Show all').click();
    flushSync();
    expect(headers(root)).toEqual(['Name', 'Age', 'City']);
  });

  it('pins from the menu and unpins all', () => {
    const root = render2({ enableColumnPinning: true });
    document.body
      .querySelectorAll<HTMLButtonElement>(
        'button[aria-label="Pin to left"]',
      )[2]
      .click();
    flushSync();
    expect(headers(root)[0]).toBe('City');
    Array.from(document.body.querySelectorAll<HTMLButtonElement>('button'))
      .find((b) => b.textContent?.trim() === 'Unpin all')!
      .click();
    flushSync();
    expect(headers(root)).toEqual(['Name', 'Age', 'City']);
  });

  it('reorders columns by dragging in the menu', () => {
    const root = render2({ enableColumnOrdering: true });
    const handles = Array.from(
      document.body.querySelectorAll<HTMLElement>(
        '[data-slot="dropdown-menu-content"] button[aria-label="Move"]',
      ),
    );
    expect(handles).toHaveLength(3);
    const items = Array.from(
      document.body.querySelectorAll<HTMLElement>('.mrt-show-hide-item'),
    ).map((el) => el.parentElement!.parentElement!);
    // drag "City" (3rd) onto "Name" (1st)
    handles[2].dispatchEvent(new Event('dragstart', { bubbles: true }));
    items[0].dispatchEvent(new Event('dragenter', { bubbles: true }));
    flushSync();
    handles[2].dispatchEvent(new Event('dragend', { bubbles: true }));
    flushSync();
    expect(headers(root)).toEqual(['City', 'Name', 'Age']);
    const reset = Array.from(
      document.body.querySelectorAll<HTMLButtonElement>('button'),
    ).find((b) => b.textContent?.trim() === 'Reset order')!;
    expect(reset.disabled).toBe(false);
    reset.click();
    flushSync();
    expect(headers(root)).toEqual(['Name', 'Age', 'City']);
  });
});
