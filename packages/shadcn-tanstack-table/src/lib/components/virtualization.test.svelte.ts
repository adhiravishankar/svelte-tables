import { createRawSnippet, flushSync, mount, unmount } from 'svelte';
import { afterEach, describe, expect, it } from 'vitest';
import MaterialSvelteTable from './MaterialSvelteTable.svelte';
import { type MRT_ColumnDef, type MRT_TableOptions } from '../types';

type Row = Record<string, string>;

let target: HTMLElement;
let app: ReturnType<typeof mount> | undefined;

const render = async (options: Partial<MRT_TableOptions<Row>>) => {
  target = document.createElement('div');
  document.body.appendChild(target);
  app = mount(MaterialSvelteTable<Row>, {
    props: {
      options: {
        columns: [],
        data: [],
        enableBottomToolbar: false,
        enableTopToolbar: false,
        ...options,
      },
    },
    target,
  });
  flushSync();
  // the scroll container is attached by a parent a tick after the body mounts
  await Promise.resolve();
  await Promise.resolve();
  flushSync();
  return target;
};

afterEach(() => {
  if (app) unmount(app);
  app = undefined;
  target?.remove();
  document.body.innerHTML = '';
});

/**
 * jsdom has no layout, so give the virtualizer a fake viewport and a way to
 * scroll it: `scrollTo(n)` pretends the container was scrolled to offset n.
 */
const fakeViewport = (width: number, height: number, itemSize = 58) => {
  let notify: ((offset: number, isScrolling: boolean) => void) | undefined;
  return {
    options: {
      measureElement: () => itemSize,
      observeElementOffset: (
        _: unknown,
        cb: (offset: number, isScrolling: boolean) => void,
      ) => {
        notify = cb;
        cb(0, false);
        return () => {};
      },
      observeElementRect: (
        _: unknown,
        cb: (rect: { height: number; width: number }) => void,
      ) => {
        cb({ height, width });
        return () => {};
      },
    },
    scrollTo: async (offset: number) => {
      notify?.(offset, false);
      flushSync();
      await Promise.resolve();
      flushSync();
    },
  };
};

const rows = (count: number): Row[] =>
  Array.from({ length: count }, (_, i) => ({
    id: `row-${i}`,
    name: `Person ${i}`,
  }));
const bodyRows = (root: HTMLElement) =>
  Array.from(
    root.querySelectorAll<HTMLElement>('tbody tr:not(.mrt-detail-panel-row)'),
  );
const firstCell = (tr: Element) => tr.querySelector('td')?.textContent?.trim();

const rowColumns: MRT_ColumnDef<Row>[] = [
  { accessorKey: 'id', header: 'Id' },
  { accessorKey: 'name', header: 'Name' },
];

describe('row virtualization', () => {
  it('renders only the rows in view', async () => {
    const viewport = fakeViewport(800, 300);
    const root = await render({
      columns: rowColumns,
      data: rows(500),
      enablePagination: false,
      enableRowVirtualization: true,
      rowVirtualizerOptions: viewport.options as any,
    });
    const rendered = bodyRows(root);
    expect(rendered.length).toBeGreaterThan(0);
    expect(rendered.length).toBeLessThan(25);
    expect(firstCell(rendered[0])).toBe('row-0');
    // the body reserves room for every row so the scrollbar is right
    const tbody = root.querySelector<HTMLElement>('tbody')!;
    expect(parseInt(tbody.style.height)).toBeGreaterThan(500 * 40);
    // rows are positioned absolutely at their offset
    expect(rendered[1].style.position).toBe('absolute');
    expect(rendered[1].style.transform).toMatch(/translateY\(\d+px\)/);
  });

  it('switches to the grid layout', async () => {
    const root = await render({
      columns: rowColumns,
      data: rows(50),
      enableRowVirtualization: true,
      rowVirtualizerOptions: fakeViewport(800, 300).options as any,
    });
    expect(root.querySelector<HTMLElement>('table')!.style.display).toBe(
      'grid',
    );
    expect(root.querySelector('table')!.className).toContain('sticky-header');
  });

  it('renders different rows after scrolling', async () => {
    const viewport = fakeViewport(800, 300);
    const root = await render({
      columns: rowColumns,
      data: rows(500),
      enablePagination: false,
      enableRowVirtualization: true,
      rowVirtualizerOptions: viewport.options as any,
    });
    expect(firstCell(bodyRows(root)[0])).toBe('row-0');
    await viewport.scrollTo(58 * 200);
    const after = bodyRows(root);
    const ids = after.map(firstCell);
    expect(ids).not.toContain('row-0');
    expect(ids).toContain('row-200');
    expect(after.length).toBeLessThan(25);
  });

  it('exposes the virtualizer through a ref', async () => {
    const ref: { current: any } = { current: null };
    await render({
      columns: rowColumns,
      data: rows(100),
      enableRowVirtualization: true,
      rowVirtualizerInstanceRef: ref,
      rowVirtualizerOptions: fakeViewport(800, 300).options as any,
    });
    expect(ref.current).toBeTruthy();
    expect(ref.current.virtualRows.length).toBeGreaterThan(0);
    expect(typeof ref.current.scrollToIndex).toBe('function');
  });

  it('virtualizes filtered results', async () => {
    const viewport = fakeViewport(800, 300);
    const root = await render({
      columns: [rowColumns[0], { ...rowColumns[1], filterFn: 'contains' }],
      data: rows(500),
      enablePagination: false,
      enableRowVirtualization: true,
      initialState: {
        columnFilters: [{ id: 'name', value: 'Person 49' }],
      } as any,
      rowVirtualizerOptions: viewport.options as any,
    });
    // "Person 49" and "Person 490".."Person 499" match: 11 rows, windowed
    const rendered = bodyRows(root);
    expect(rendered.length).toBeLessThanOrEqual(11);
    expect(firstCell(rendered[0])).toBe('row-49');
    expect(firstCell(rendered[1])).toBe('row-490');
  });

  it('renders detail panels between virtual rows', async () => {
    const detailPanel = createRawSnippet<[{ row: any }]>((ctx) => ({
      render: () => `<span class="detail">${ctx().row.original.name}</span>`,
    }));
    const root = await render({
      columns: rowColumns,
      data: rows(100),
      detailPanel,
      enablePagination: false,
      enableRowVirtualization: true,
      rowVirtualizerOptions: fakeViewport(800, 400).options as any,
    });
    expect(root.querySelector('.detail')).toBeNull();
    root
      .querySelectorAll<HTMLButtonElement>(
        'tbody button[aria-label="Expand"]',
      )[1]
      .click();
    flushSync();
    const detail = root.querySelector<HTMLElement>('.detail');
    expect(detail?.textContent).toBe('Person 1');
    const panelRow = detail!.closest<HTMLElement>('.mrt-detail-panel-row')!;
    expect(panelRow.style.position).toBe('absolute');
    // panels are the odd virtual items
    expect(panelRow.getAttribute('data-index')).toBe('3');
    // data rows keep their even indexes
    expect(bodyRows(root)[1].getAttribute('data-index')).toBe('2');
  });
});

describe('column virtualization', () => {
  const wideColumns: MRT_ColumnDef<Row>[] = Array.from(
    { length: 40 },
    (_, i) => ({
      accessorKey: `c${i}`,
      header: `Col ${i}`,
      size: 100,
    }),
  );
  const wideRow = (i: number): Row =>
    Object.fromEntries(
      wideColumns.map((c, j) => [c.accessorKey as string, `r${i}c${j}`]),
    );

  it('renders only the columns in view, with padding for the rest', async () => {
    const viewport = fakeViewport(500, 400, 100);
    const root = await render({
      columnVirtualizerOptions: viewport.options as any,
      columns: wideColumns,
      data: [wideRow(0), wideRow(1)],
      enableColumnVirtualization: true,
    });
    const headCells = root.querySelectorAll('thead th:not(:empty)');
    expect(headCells.length).toBeGreaterThan(0);
    expect(headCells.length).toBeLessThan(15);
    expect(root.querySelector('thead th')!.textContent).toContain('Col 0');
    // body cells follow the same columns
    const cells = root.querySelectorAll('tbody tr:first-child td:not(:empty)');
    expect(cells.length).toBe(headCells.length);
    // nothing to pad on the left yet, but the right side holds the hidden columns
    const padding = root.querySelector<HTMLElement>('thead tr th:last-child');
    expect(parseInt(padding!.style.width)).toBeGreaterThan(1000);
  });

  it('renders other columns after scrolling', async () => {
    const viewport = fakeViewport(500, 400, 100);
    const root = await render({
      columnVirtualizerOptions: viewport.options as any,
      columns: wideColumns,
      data: [wideRow(0)],
      enableColumnVirtualization: true,
    });
    await viewport.scrollTo(2000);
    const text = root.querySelector('thead')!.textContent!;
    expect(text).not.toContain('Col 0 ');
    expect(text).toContain('Col 20');
    expect(root.querySelector('tbody')!.textContent).toContain('r0c20');
    // now there is padding on the left for the columns scrolled past
    const first = root.querySelector<HTMLElement>('thead tr th:first-child')!;
    expect(parseInt(first.style.width)).toBeGreaterThan(1000);
  });

  it('exposes the virtualizer through a ref', async () => {
    const ref: { current: any } = { current: null };
    await render({
      columnVirtualizerInstanceRef: ref,
      columnVirtualizerOptions: fakeViewport(500, 400, 100).options as any,
      columns: wideColumns,
      data: [wideRow(0)],
      enableColumnVirtualization: true,
    });
    expect(ref.current.virtualColumns.length).toBeGreaterThan(0);
  });

  it('keeps pinned columns rendered while scrolling', async () => {
    const viewport = fakeViewport(500, 400, 100);
    const root = await render({
      columnVirtualizerOptions: viewport.options as any,
      columns: wideColumns,
      data: [wideRow(0)],
      enableColumnPinning: true,
      enableColumnVirtualization: true,
      initialState: { columnPinning: { end: [], start: ['c0'] } } as any,
    });
    await viewport.scrollTo(2000);
    const text = root.querySelector('thead')!.textContent!;
    expect(text).toContain('Col 0');
    expect(text).toContain('Col 20');
  });
});

describe('without virtualization', () => {
  it('renders everything', async () => {
    const root = await render({
      columns: rowColumns,
      data: rows(60),
      enablePagination: false,
    });
    expect(bodyRows(root)).toHaveLength(60);
  });
});
