import { flushSync, mount, unmount } from 'svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';
import MaterialSvelteTable from './MaterialSvelteTable.svelte';
import { type MRT_ColumnDef, type MRT_TableOptions } from '../types';

type Person = { age: number; name: string };

const columns: MRT_ColumnDef<Person>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'age', header: 'Age' },
];

const people: Person[] = Array.from({ length: 23 }, (_, i) => ({
  age: 20 + i,
  name: `Person ${String(i + 1).padStart(2, '0')}`,
}));

let target: HTMLElement;
let app: ReturnType<typeof mount> | undefined;

const render = (options: Partial<MRT_TableOptions<Person>> = {}) => {
  target = document.createElement('div');
  document.body.appendChild(target);
  app = mount(MaterialSvelteTable<Person>, {
    props: { options: { columns, data: people, ...options } },
    target,
  });
  flushSync();
  return target;
};

afterEach(() => {
  if (app) unmount(app);
  app = undefined;
  target?.remove();
  vi.useRealTimers();
});

const rowCount = (root: HTMLElement) =>
  root.querySelectorAll('tbody tr').length;
const button = (root: HTMLElement, label: string) =>
  root.querySelector<HTMLButtonElement>(`button[aria-label="${label}"]`)!;

describe('toolbars', () => {
  it('paginates and reports the visible range', () => {
    const root = render();
    expect(rowCount(root)).toBe(10);
    expect(root.querySelector('.mrt-range')?.textContent).toBe('1-10 of 23');
    button(root, 'Go to next page').click();
    flushSync();
    expect(root.querySelector('.mrt-range')?.textContent).toBe('11-20 of 23');
    button(root, 'Go to last page').click();
    flushSync();
    expect(rowCount(root)).toBe(3);
    expect(button(root, 'Go to next page').disabled).toBe(true);
    button(root, 'Go to first page').click();
    flushSync();
    expect(button(root, 'Go to previous page').disabled).toBe(true);
  });

  it('changes the page size', () => {
    const root = render();
    const select = root.querySelector<HTMLSelectElement>(
      '.mrt-rows-per-page select',
    )!;
    select.value = '25';
    select.dispatchEvent(new Event('change', { bubbles: true }));
    flushSync();
    expect(rowCount(root)).toBe(23);
  });

  it('renders numbered pages in pages mode', () => {
    const root = render({ paginationDisplayMode: 'pages' });
    const pages = Array.from(root.querySelectorAll('.mrt-page-button')).map(
      (b) => b.textContent?.trim(),
    );
    expect(pages).toEqual(['1', '2', '3']);
    root.querySelectorAll<HTMLButtonElement>('.mrt-page-button')[2].click();
    flushSync();
    expect(rowCount(root)).toBe(3);
  });

  it('toggles the density, full screen and filter buttons', () => {
    const root = render();
    button(root, 'Toggle density').click();
    flushSync();
    expect(root.querySelector<HTMLElement>('tbody td')!.style.padding).toBe(
      '0.5rem',
    );
    button(root, 'Toggle full screen').click();
    flushSync();
    expect(root.querySelector('.mrt-paper-fullscreen')).not.toBeNull();
  });

  it('shows the search box and filters rows with a debounce', () => {
    vi.useFakeTimers();
    const root = render();
    expect(root.querySelector('.mrt-global-filter input')).toBeNull();
    button(root, 'Show/Hide search').click();
    flushSync();
    const input = root.querySelector<HTMLInputElement>(
      '.mrt-global-filter input',
    )!;
    expect(input).not.toBeNull();
    input.value = 'Person 07';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    expect(rowCount(root)).toBe(10); // not applied before the debounce
    vi.advanceTimersByTime(300);
    flushSync();
    expect(rowCount(root)).toBe(1);
    // clear
    button(root, 'Clear search').click();
    flushSync();
    expect(rowCount(root)).toBe(10);
  });

  it('shows the selected-rows banner', () => {
    const root = render({ enableRowSelection: true });
    expect(root.querySelector('.mrt-alert-open')).toBeNull();
    expect(root.querySelector('.mrt-alert-collapse')).not.toBeNull();
  });

  it('shows the loading progress bar', () => {
    const root = render({ state: { isLoading: true } });
    expect(root.querySelector('[role="progressbar"]')).not.toBeNull();
  });

  it('lets custom snippets replace the toolbars', () => {
    const root = render({
      enableBottomToolbar: false,
      enableTopToolbar: false,
    });
    expect(root.querySelector('.mrt-toolbar')).toBeNull();
  });
});
