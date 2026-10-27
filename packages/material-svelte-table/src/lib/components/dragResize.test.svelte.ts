import { flushSync, mount, unmount } from 'svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';
import MaterialSvelteTable from './MaterialSvelteTable.svelte';
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
  document.body.innerHTML = '';
  vi.useRealTimers();
});

const fire = (el: EventTarget, type: string, init: EventInit & Record<string, any> = {}) => {
  const event = new MouseEvent(type, { bubbles: true, cancelable: true, ...init });
  el.dispatchEvent(event);
  flushSync();
  return event;
};

const headers = (root: HTMLElement) =>
  Array.from(root.querySelectorAll('thead th')).map((th) =>
    th.querySelector('.mrt-head-cell-label')?.textContent?.trim(),
  );
const headCell = (root: HTMLElement, name: string) =>
  Array.from(root.querySelectorAll<HTMLElement>('thead th')).find((th) =>
    th.textContent?.includes(name),
  )!;
const handleIn = (el: Element) =>
  el.querySelector<HTMLElement>('button[aria-label="Move"]')!;
/** v9 applies drag moves once per animation frame. */
const frame = () =>
  new Promise<void>((resolve) =>
    requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
  );
const sizeVar = (root: HTMLElement, id: string) =>
  root.querySelector<HTMLElement>('table')!.style.getPropertyValue(`--header-${id}-size`);

describe('column dragging', () => {
  it('shows a drag handle only when dragging is possible', () => {
    expect(render().querySelectorAll('button[aria-label="Move"]')).toHaveLength(0);
    document.body.innerHTML = '';
    const root = render({ enableColumnOrdering: true });
    expect(root.querySelectorAll('thead button[aria-label="Move"]')).toHaveLength(3);
    document.body.innerHTML = '';
    const off = render({ enableColumnDragging: false, enableColumnOrdering: true });
    expect(off.querySelectorAll('thead button[aria-label="Move"]')).toHaveLength(0);
  });

  it('reorders columns by dragging a header onto another', () => {
    const root = render({ enableColumnOrdering: true });
    const handle = handleIn(headCell(root, 'City'));
    fire(handle, 'dragstart');
    // the dragged column is outlined
    expect(headCell(root, 'City').getAttribute('style')).toContain('dashed');
    fire(headCell(root, 'Name'), 'dragenter');
    expect(headCell(root, 'Name').getAttribute('style')).toContain('2px dashed');
    fire(handle, 'dragend');
    expect(headers(root)).toEqual(['City', 'Name', 'Age']);
    // borders are cleared again
    expect(headCell(root, 'City').getAttribute('style')).not.toContain('dashed');
  });

  it('can drop on a body cell as well', () => {
    const root = render({ enableColumnOrdering: true });
    const handle = handleIn(headCell(root, 'Age'));
    fire(handle, 'dragstart');
    fire(root.querySelector('tbody tr td:nth-child(3)')!, 'dragenter');
    fire(handle, 'dragend');
    expect(headers(root)).toEqual(['Name', 'City', 'Age']);
  });

  it('respects enableColumnOrdering: false on a column', () => {
    const root = render({
      columns: [columns[0], { ...columns[1], enableColumnOrdering: false }, columns[2]],
      enableColumnOrdering: true,
    });
    expect(
      headCell(root, 'Age').querySelector('button[aria-label="Move"]'),
    ).toBeNull();
    const handle = handleIn(headCell(root, 'City'));
    fire(handle, 'dragstart');
    fire(headCell(root, 'Age'), 'dragenter');
    fire(handle, 'dragend');
    expect(headers(root)).toEqual(['Name', 'Age', 'City']);
  });

  it('groups by dropping a column on the drop zone', () => {
    const root = render({ enableGrouping: true, enableTopToolbar: true });
    expect(root.querySelector('.mrt-drop-zone')).toBeNull();
    const handle = handleIn(headCell(root, 'City'));
    fire(handle, 'dragstart');
    const zone = root.querySelector('.mrt-drop-zone')!;
    expect(zone).not.toBeNull();
    expect(zone.textContent).toContain('Drop to group by City');
    fire(zone, 'dragenter');
    fire(handle, 'dragend');
    expect(root.querySelector('.mrt-drop-zone')).toBeNull();
    // grouped by city: two groups
    expect(root.querySelectorAll('tbody tr')).toHaveLength(2);
  });
});

describe('row dragging and pinning', () => {
  it('tracks the dragged and hovered rows', () => {
    const states: string[] = [];
    const root = render({
      enableRowDragging: true,
      enableRowOrdering: true,
      rowDragHandleProps: ({ table, row }) => ({
        ondragend: () => {
          const { draggingRow, hoveredRow } = table.mrtState;
          states.push(`${draggingRow?.id}->${hoveredRow?.id}`);
          void row;
        },
      }),
    });
    const handles = root.querySelectorAll<HTMLElement>('tbody button[aria-label="Move"]');
    expect(handles).toHaveLength(3);
    fire(handles[0], 'dragstart');
    expect(root.querySelector('tbody tr')!.getAttribute('style')).toContain('opacity: 0.5');
    fire(root.querySelectorAll('tbody tr')[2], 'dragenter');
    fire(handles[0], 'dragend');
    // the callback saw both rows before they were cleared
    expect(states).toEqual(['0->2']);
    expect(root.querySelector('tbody tr')!.getAttribute('style')).not.toContain('opacity: 0.5');
  });

  it('pins rows to the top', () => {
    const root = render({ enableRowPinning: true, rowPinningDisplayMode: 'sticky' });
    const pins = root.querySelectorAll<HTMLButtonElement>('tbody button[aria-label="Pin"]');
    expect(pins).toHaveLength(3);
    pins[2].click();
    flushSync();
    // a sticky pinned row keeps its place in the list and sticks when scrolled
    const rows = Array.from(root.querySelectorAll('tbody tr'));
    expect(rows.map((r) => r.getAttribute('data-pinned'))).toEqual([null, null, 'true']);
    expect(rows[2].getAttribute('style')).toContain('position: sticky');
    // the pinned row now offers to unpin
    expect(rows[2].querySelector('button[aria-label="Pin"]')).not.toBeNull();
    rows[2].querySelector<HTMLButtonElement>('button[aria-label="Pin"]')!.click();
    flushSync();
    expect(root.querySelector('tbody tr[data-pinned]')).toBeNull();
  });

  it('offers top and bottom pins in top-and-bottom mode', () => {
    const root = render({ enableRowPinning: true, rowPinningDisplayMode: 'top-and-bottom' });
    expect(
      root.querySelector('tbody tr')!.querySelectorAll('button[aria-label="Pin"]'),
    ).toHaveLength(2);
  });
});

describe('column resizing', () => {
  const resizeOptions = { enableColumnResizing: true } as const;

  it('shows a resize handle on each column', () => {
    const root = render(resizeOptions);
    expect(root.querySelectorAll('thead .mrt-resize-handle')).toHaveLength(3);
    expect(render().querySelectorAll('.mrt-resize-handle')).toHaveLength(0);
  });

  it('resizes a column by dragging its handle', () => {
    const root = render(resizeOptions);
    const before = Number(sizeVar(root, 'name'));
    expect(before).toBe(180);
    const handle = headCell(root, 'Name').querySelector('.mrt-resize-handle')!;
    fire(handle, 'mousedown', { clientX: 100 });
    // while dragging, the column is outlined and body cells follow
    fire(document, 'mousemove', { clientX: 160 });
    expect(Number(sizeVar(root, 'name'))).toBe(240);
    expect(headCell(root, 'Name').getAttribute('style')).toContain('border-right: 2px solid');
    fire(document, 'mouseup', { clientX: 160 });
    expect(Number(sizeVar(root, 'name'))).toBe(240);
    expect(headCell(root, 'Name').getAttribute('style')).not.toContain('2px solid');
    // other columns are untouched
    expect(Number(sizeVar(root, 'age'))).toBe(180);
  });

  it('respects min and max sizes', async () => {
    const root = render({
      ...resizeOptions,
      columns: [{ ...columns[0], maxSize: 200, minSize: 100 }, columns[1], columns[2]],
    });
    const handle = headCell(root, 'Name').querySelector('.mrt-resize-handle')!;
    fire(handle, 'mousedown', { clientX: 100 });
    fire(document, 'mousemove', { clientX: 400 });
    expect(Number(sizeVar(root, 'name'))).toBe(200);
    fire(document, 'mousemove', { clientX: -400 });
    await frame();
    flushSync();
    expect(Number(sizeVar(root, 'name'))).toBe(100);
    fire(document, 'mouseup', { clientX: -400 });
  });

  it('only applies the size when released in onEnd mode', () => {
    const root = render({ ...resizeOptions, columnResizeMode: 'onEnd' });
    const handle = headCell(root, 'Name').querySelector('.mrt-resize-handle')! as HTMLElement;
    fire(handle, 'mousedown', { clientX: 100 });
    fire(document, 'mousemove', { clientX: 150 });
    expect(Number(sizeVar(root, 'name'))).toBe(180);
    expect(handle.style.transform).toBe('translateX(50px)');
    fire(document, 'mouseup', { clientX: 150 });
    expect(Number(sizeVar(root, 'name'))).toBe(230);
  });

  it('resets a column size on double click', () => {
    const root = render(resizeOptions);
    const handle = headCell(root, 'Name').querySelector('.mrt-resize-handle')!;
    fire(handle, 'mousedown', { clientX: 100 });
    fire(document, 'mousemove', { clientX: 140 });
    fire(document, 'mouseup', { clientX: 140 });
    expect(Number(sizeVar(root, 'name'))).toBe(220);
    fire(handle, 'dblclick');
    expect(Number(sizeVar(root, 'name'))).toBe(180);
  });

  it('uses the grid layout without growing columns when resizing', () => {
    const root = render(resizeOptions);
    expect(root.querySelector('table')!.style.display).toBe('grid');
    // the spacer column soaks up the remaining space
    expect(root.querySelector('thead th:last-child')!.getAttribute('style')).toContain('flex: 1 0 auto');
  });
});
