import { createRawSnippet, flushSync, mount, unmount } from 'svelte';
import { afterEach, describe, expect, it } from 'vitest';
import MaterialSvelteTable from './MaterialSvelteTable.svelte';
import { type MRT_ColumnDef, type MRT_TableOptions } from '../types';

type Person = { age: number; name: string; subRows?: Person[] };

const columns: MRT_ColumnDef<Person>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'age', header: 'Age' },
];

const people: Person[] = Array.from({ length: 6 }, (_, i) => ({
  age: 20 + i,
  name: `Person ${i + 1}`,
}));

let target: HTMLElement;
let app: ReturnType<typeof mount> | undefined;

const render = (options: Partial<MRT_TableOptions<Person>> = {}) => {
  target = document.createElement('div');
  document.body.appendChild(target);
  app = mount(MaterialSvelteTable<Person>, {
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
});

const rowCheckboxes = (root: HTMLElement) =>
  Array.from(
    root.querySelectorAll<HTMLInputElement>(
      'tbody tr td:first-child input[type="checkbox"]',
    ),
  );
const selectAll = (root: HTMLElement) =>
  root.querySelector<HTMLInputElement>('thead input[type="checkbox"]')!;
const names = (root: HTMLElement) =>
  Array.from(root.querySelectorAll('tbody tr:not(.mrt-detail-panel-row)')).map(
    (tr) => tr.querySelectorAll('td')[1]?.textContent?.trim(),
  );

describe('select column', () => {
  it('selects rows and updates the select-all state', () => {
    const root = render({ enableRowSelection: true });
    expect(rowCheckboxes(root)).toHaveLength(6);
    rowCheckboxes(root)[1].click();
    flushSync();
    expect(rowCheckboxes(root)[1].checked).toBe(true);
    expect(
      root.querySelector('tbody tr:nth-child(2)')?.getAttribute('data-selected'),
    ).toBe('true');
    expect(selectAll(root).checked).toBe(false);
  });

  it('selects all rows on the page', () => {
    const root = render({ enableRowSelection: true });
    selectAll(root).click();
    flushSync();
    expect(rowCheckboxes(root).every((c) => c.checked)).toBe(true);
    selectAll(root).click();
    flushSync();
    expect(rowCheckboxes(root).some((c) => c.checked)).toBe(false);
  });

  it('selects a range with shift-click', () => {
    const root = render({ enableRowSelection: true });
    rowCheckboxes(root)[1].click();
    flushSync();
    rowCheckboxes(root)[4].dispatchEvent(
      new MouseEvent('click', { bubbles: true, cancelable: true, shiftKey: true }),
    );
    flushSync();
    expect(rowCheckboxes(root).map((c) => c.checked)).toEqual([
      false,
      true,
      true,
      true,
      true,
      false,
    ]);
  });

  it('renders radios for single selection', () => {
    const root = render({
      enableMultiRowSelection: false,
      enableRowSelection: true,
    });
    expect(root.querySelectorAll('tbody input[type="radio"]')).toHaveLength(6);
    expect(root.querySelector('thead input[type="checkbox"]')).toBeNull();
  });

  it('reports the selection in the banner', () => {
    const root = render({
      enableRowSelection: true,
      enableTopToolbar: true,
    });
    rowCheckboxes(root)[0].click();
    rowCheckboxes(root)[2].click();
    flushSync();
    expect(root.querySelector('.mrt-alert-open')?.textContent).toContain(
      '2 of 6 row(s) selected',
    );
  });
});

describe('expand column and detail panel', () => {
  const detailPanel = createRawSnippet<[{ row: any }]>((ctx) => ({
    render: () => `<span class="detail">${ctx().row.original.name} details</span>`,
  }));

  it('expands a row to show the detail panel', () => {
    const root = render({ detailPanel });
    expect(root.querySelector('.detail')).toBeNull();
    const buttons = root.querySelectorAll<HTMLButtonElement>(
      'tbody button[aria-label="Expand"]',
    );
    expect(buttons).toHaveLength(6);
    buttons[1].click();
    flushSync();
    expect(root.querySelector('.detail')?.textContent).toBe('Person 2 details');
    buttons[1].click();
    flushSync();
    expect(root.querySelector('.detail')).toBeNull();
  });

  it('expands and collapses all rows', () => {
    const root = render({ detailPanel });
    const expandAll = root.querySelector<HTMLButtonElement>(
      'thead button[aria-label="Expand all"]',
    )!;
    expandAll.click();
    flushSync();
    expect(root.querySelectorAll('.detail')).toHaveLength(6);
    expandAll.click();
    flushSync();
    expect(root.querySelectorAll('.detail')).toHaveLength(0);
  });

  it('expands sub rows', () => {
    const root = render({
      data: [
        { age: 50, name: 'Parent', subRows: [{ age: 5, name: 'Child' }] },
      ],
      enableExpanding: true,
    });
    expect(names(root)).toEqual(['Parent']);
    root
      .querySelector<HTMLButtonElement>('tbody button[aria-label="Expand"]')!
      .click();
    flushSync();
    expect(names(root)).toEqual(['Parent', 'Child']);
  });
});

describe('actions column', () => {
  it('shows an edit button when editing is enabled', () => {
    const root = render({ editDisplayMode: 'modal', enableEditing: true });
    expect(
      root.querySelectorAll('tbody button[aria-label="Edit"]'),
    ).toHaveLength(6);
  });

  it('renders custom row actions', () => {
    const rowActions = createRawSnippet<[{ row: any }]>((ctx) => ({
      render: () =>
        `<button class="custom-action">${ctx().row.original.name}</button>`,
    }));
    const root = render({ enableRowActions: true, rowActions });
    expect(root.querySelectorAll('.custom-action')).toHaveLength(6);
    expect(root.querySelector('thead th')?.textContent).toContain('Actions');
  });

  it('opens a row action menu', () => {
    const rowActionMenuItems = createRawSnippet<[{ row: any }]>(() => ({
      render: () => `<li class="my-item" role="menuitem">Do thing</li>`,
    }));
    const root = render({ enableRowActions: true, rowActionMenuItems });
    root
      .querySelector<HTMLButtonElement>('tbody button[aria-label="Row Actions"]')!
      .click();
    flushSync();
    expect(document.body.querySelector('.my-item')).not.toBeNull();
  });
});
