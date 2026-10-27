import { flushSync, mount, unmount } from 'svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { employeeColumns, employees, people, personColumns } from './data';
import AsyncEditing from './features/AsyncEditing.svelte';
import AsyncOptions from './features/AsyncOptions.svelte';
import ColumnOrderingCustom from './features/ColumnOrderingCustom.svelte';
import GroupingSetState from './features/GroupingSetState.svelte';
import ColumnOrderingStateManaged from './features/ColumnOrderingStateManaged.svelte';
import ControlledFullScreen from './features/ControlledFullScreen.svelte';
import CreatingRows from './features/CreatingRows.svelte';
import EditingWithSave from './features/EditingWithSave.svelte';
import ExternalFilterValue from './features/ExternalFilterValue.svelte';
import GroupingStateManaged from './features/GroupingStateManaged.svelte';
import ManualFiltering from './features/ManualFiltering.svelte';
import ManualSelection from './features/ManualSelection.svelte';
import PaginationStateManaged from './features/PaginationStateManaged.svelte';
import Reloading from './features/Reloading.svelte';
import RowOrdering from './features/RowOrdering.svelte';
import SingleExpand from './features/SingleExpand.svelte';
import SortingStateManaged from './features/SortingStateManaged.svelte';

// The stateful story helpers are ordinary components, so they can be mounted
// and exercised here; the stories themselves are compiled by `storybook build`.

let target: HTMLElement;
let app: ReturnType<typeof mount> | undefined;

const render = (component: any, props: Record<string, unknown> = {}) => {
  target = document.createElement('div');
  document.body.appendChild(target);
  app = mount(component, { props, target });
  flushSync();
  return target;
};

afterEach(() => {
  if (app) unmount(app);
  app = undefined;
  target?.remove();
  document.body.innerHTML = '';
});

const rowCount = (root: HTMLElement) =>
  Array.from(root.querySelectorAll('tbody tr')).filter(
    (tr) => !tr.querySelector('td[colspan]'),
  ).length;

describe('story helpers', () => {
  it('Sorting State Managed shows the sort state', () => {
    const root = render(SortingStateManaged, { columns: personColumns, data: people });
    expect(root.querySelector('code')!.textContent).toBe('[]');
    root.querySelector<HTMLButtonElement>('thead .mrt-sort-label')!.click();
    flushSync();
    expect(root.querySelector('code')!.textContent).toContain('firstName');
  });

  it('Pagination State Managed starts on the given page', () => {
    const root = render(PaginationStateManaged);
    expect(root.querySelector('p')!.textContent).toContain('Page 3, 5 rows per page');
    expect(rowCount(root)).toBe(5);
    root.querySelector<HTMLButtonElement>('p button')!.click();
    flushSync();
    expect(root.querySelector('p')!.textContent).toContain('Page 1');
  });

  it('Manual Selection follows the state it owns', () => {
    const root = render(ManualSelection);
    expect(root.querySelectorAll('tbody input[type="checkbox"]:checked')).toHaveLength(2);
    root.querySelector<HTMLButtonElement>('p button')!.click();
    flushSync();
    expect(root.querySelectorAll('tbody input[type="checkbox"]:checked')).toHaveLength(0);
  });

  it('Column Ordering State Managed applies the order', () => {
    const root = render(ColumnOrderingStateManaged);
    const headers = () =>
      Array.from(root.querySelectorAll('thead th .mrt-head-cell-label')).map((l) => l.textContent?.trim());
    expect(headers()[0]).toBe('Phone Number');
    root.querySelector<HTMLButtonElement>('p button')!.click();
    flushSync();
    expect(headers()[0]).toBe('First Name');
  });

  it('Grouping State Managed groups and ungroups', () => {
    const root = render(GroupingStateManaged);
    const before = rowCount(root); // a page of state groups
    root.querySelectorAll<HTMLButtonElement>('p button')[0].click(); // group by gender, then state
    flushSync();
    // grouped by gender first, there are only two top-level groups
    expect(rowCount(root)).toBe(2);
    expect(rowCount(root)).toBeLessThan(before);
    root.querySelectorAll<HTMLButtonElement>('p button')[1].click(); // ungroup
    flushSync();
    expect(rowCount(root)).toBe(10); // ungrouped: a full page again
  });

  it('Manual Filtering filters through the owned state', async () => {
    const root = render(ManualFiltering);
    expect(root.querySelector('p')!.textContent).toContain(`${employees.length} rows`);
  });

  it('External Set Filter Value drives the table from outside', () => {
    const root = render(ExternalFilterValue);
    const range = () => root.querySelector('.mrt-range')!.textContent;
    const total = employees.length;
    expect(range()).toContain(`of ${total}`);
    root.querySelectorAll<HTMLButtonElement>('button')[1].click(); // gender: Female
    flushSync();
    const females = employees.filter((e) => e.gender === 'Female').length;
    expect(range()).toContain(`of ${females}`);
    root.querySelectorAll<HTMLButtonElement>('button')[2].click(); // clear
    flushSync();
    expect(range()).toContain(`of ${total}`);
  });

  it('Controlled Full Screen toggles the paper', () => {
    const root = render(ControlledFullScreen);
    expect(root.querySelector('.mrt-paper-fullscreen')).toBeNull();
    root.querySelector<HTMLButtonElement>('p button')!.click();
    flushSync();
    expect(root.querySelector('.mrt-paper-fullscreen')).not.toBeNull();
  });

  it('Single Expand keeps one detail panel open', async () => {
    const { createRawSnippet } = await import('svelte');
    const detailPanel = createRawSnippet<[{ row: any }]>((ctx) => ({
      render: () => `<i class="detail">${ctx().row.original.firstName}</i>`,
    }));
    const root = render(SingleExpand, {
      columns: employeeColumns,
      data: employees.slice(0, 5),
      detailPanel,
    });
    const buttons = root.querySelectorAll<HTMLButtonElement>('tbody button[aria-label="Expand"]');
    buttons[0].click();
    flushSync();
    expect(root.querySelectorAll('.detail')).toHaveLength(1);
    buttons[2].click();
    flushSync();
    expect(root.querySelectorAll('.detail')).toHaveLength(1);
  });

  it('Row Ordering renders its rows and drag handles', () => {
    const root = render(RowOrdering, { selection: true });
    expect(rowCount(root)).toBe(15);
    expect(root.querySelectorAll('tbody button[aria-label="Move"]')).toHaveLength(15);
    expect(root.querySelectorAll('tbody input[type="checkbox"]')).toHaveLength(15);
  });

  it('Editing With Save writes edits back to its own copy of the data', () => {
    const root = render(EditingWithSave, {
      columns: employeeColumns,
      data: employees.slice(0, 5),
      editDisplayMode: 'row',
    });
    root.querySelector<HTMLButtonElement>('tbody button[aria-label="Edit"]')!.click();
    flushSync();
    const input = root.querySelector<HTMLInputElement>('tbody input')!;
    input.value = 'Zed';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new FocusEvent('blur'));
    flushSync();
    root.querySelector<HTMLButtonElement>('tbody button[aria-label="Save"]')!.click();
    flushSync();
    // (the first cell is the actions column)
    expect(root.querySelector('tbody tr')!.textContent).toContain('Zed');
    // the shared story data is not changed
    expect(employees[0].firstName).not.toBe('Zed');
  });

  it('Creating Rows can start creating from the toolbar', () => {
    const root = render(CreatingRows, {
      columns: employeeColumns,
      data: employees.slice(0, 5),
    });
    const before = rowCount(root);
    root.querySelector<HTMLButtonElement>('.mdc-button')!.click();
    flushSync();
    expect(rowCount(root)).toBe(before + 1);
  });

  it('Async Editing renders', () => {
    const root = render(AsyncEditing, { columns: employeeColumns, data: employees.slice(0, 5) });
    expect(rowCount(root)).toBe(5);
  });

  it('Reloading shows progress bars while refetching', async () => {
    const root = render(Reloading);
    expect(root.querySelector('[role="progressbar"]')).toBeNull();
    root.querySelector<HTMLButtonElement>('p button')!.click();
    flushSync();
    expect(root.querySelector('[role="progressbar"]')).not.toBeNull();
  });

  it('Async Options: every mode loads its rows after the delay', () => {
    vi.useFakeTimers();
    try {
      for (const mode of [
        'delayedFacets',
        'editOptions',
        'filterModes',
        'filterOptions',
        'outOfBounds',
        'rowActionMenu',
        'rowActions',
      ]) {
        const root = render(AsyncOptions, { mode });
        expect(root.querySelector('.mrt-skeleton'), mode).not.toBeNull();
        vi.advanceTimersByTime(900);
        flushSync();
        // 'outOfBounds' starts on page 2 of 12 rows (10 per page) -> 2 rows
        expect(root.querySelector('.mrt-skeleton'), mode).toBeNull();
        expect(rowCount(root), mode).toBe(mode === 'outOfBounds' ? 2 : 10);
        unmount(app!);
        app = undefined;
        target.remove();
      }
    } finally {
      vi.useRealTimers();
    }
  });

  it('Column Ordering Custom shows the managed order', () => {
    const root = render(ColumnOrderingCustom);
    expect(root.querySelector('code')!.textContent).toContain('firstName → lastName');
  });

  it('Grouping Set State groups from the buttons', () => {
    const root = render(GroupingSetState);
    const before = root.querySelector('tbody')!.textContent;
    root.querySelector<HTMLButtonElement>('p button')!.click();
    flushSync();
    expect(root.querySelector('tbody')!.textContent).not.toBe(before);
  });
});
