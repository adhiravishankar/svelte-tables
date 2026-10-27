import { createRawSnippet, flushSync, mount, unmount } from 'svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';
import MaterialSvelteTable from './MaterialSvelteTable.svelte';
import { createMaterialSvelteTable } from '../createMaterialSvelteTable.svelte';
import {
  type MRT_ColumnDef,
  type MRT_TableInstance,
  type MRT_TableOptions,
} from '../types';

type Person = { age: number; city: string; name: string };

const columns: MRT_ColumnDef<Person>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'age', header: 'Age' },
  {
    accessorKey: 'city',
    editSelectOptions: ['Paris', 'Rome'],
    editVariant: 'select',
    header: 'City',
  },
];

const people: Person[] = [
  { age: 30, city: 'Paris', name: 'Carol' },
  { age: 25, city: 'Rome', name: 'Alice' },
];

let target: HTMLElement;
let app: ReturnType<typeof mount> | undefined;
let cleanup: (() => void) | undefined;

/** Creates the table first so tests can drive its API (e.g. `setCreatingRow`). */
const render = (options: Partial<MRT_TableOptions<Person>> = {}) => {
  let table!: MRT_TableInstance<Person>;
  cleanup = $effect.root(() => {
    table = createMaterialSvelteTable<Person>({
      columns,
      data: people,
      enableBottomToolbar: false,
      enableTopToolbar: false,
      ...options,
    });
  });
  target = document.createElement('div');
  document.body.appendChild(target);
  app = mount(MaterialSvelteTable<Person>, { props: { table }, target });
  flushSync();
  return { root: target, table };
};

afterEach(() => {
  if (app) unmount(app);
  cleanup?.();
  app = undefined;
  cleanup = undefined;
  target?.remove();
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

const type = (input: HTMLInputElement, value: string) => {
  input.value = value;
  input.dispatchEvent(new Event('input', { bubbles: true }));
  flushSync();
};
const bodyInputs = (root: HTMLElement) =>
  Array.from(
    root.querySelectorAll<HTMLInputElement>(
      'tbody input:not([type="checkbox"])',
    ),
  );
const button = (root: ParentNode, label: string) =>
  root.querySelector<HTMLButtonElement>(`button[aria-label="${label}"]`)!;
const buttonByText = (text: string) =>
  Array.from(document.body.querySelectorAll<HTMLButtonElement>('button')).find(
    (b) => b.textContent?.trim() === text,
  )!;

describe('cell editing', () => {
  it('opens an input on double click and closes it on blur', () => {
    const blurred: string[] = [];
    const { root } = render({
      editDisplayMode: 'cell',
      editTextFieldProps: () => ({
        input$onblur: (e: FocusEvent) =>
          blurred.push((e.target as HTMLInputElement).value),
      }),
      enableEditing: true,
    });
    expect(bodyInputs(root)).toHaveLength(0);
    const cell = root.querySelector('tbody tr td')!;
    cell.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
    flushSync();
    const [input] = bodyInputs(root);
    expect(input).toBeTruthy();
    expect(input.value).toBe('Carol');
    type(input, 'Caroline');
    input.dispatchEvent(new FocusEvent('blur'));
    flushSync();
    expect(blurred).toEqual(['Caroline']);
    expect(bodyInputs(root)).toHaveLength(0);
  });

  it('commits on Enter', () => {
    const { root, table } = render({
      editDisplayMode: 'cell',
      enableEditing: true,
    });
    root
      .querySelector('tbody tr td')!
      .dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
    flushSync();
    const [input] = bodyInputs(root);
    type(input, 'X');
    input.focus();
    input.dispatchEvent(
      new KeyboardEvent('keydown', { bubbles: true, key: 'Enter' }),
    );
    flushSync();
    expect(table.mrtState.editingCell).toBe(null);
  });

  it('does not edit when editing is disabled for the column', () => {
    const { root } = render({
      columns: [{ ...columns[0], enableEditing: false }, columns[1]],
      editDisplayMode: 'cell',
      enableEditing: true,
    });
    root
      .querySelector('tbody tr td')!
      .dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
    flushSync();
    expect(bodyInputs(root)).toHaveLength(0);
  });
});

describe('row editing', () => {
  it('edits a row inline and saves the changed values', () => {
    const onEditingRowSave = vi.fn(({ exitEditingMode }) => exitEditingMode());
    const { root } = render({
      editDisplayMode: 'row',
      enableEditing: true,
      onEditingRowSave,
    });
    button(root, 'Edit').click();
    flushSync();
    // only the edited row has inputs; the other still has an edit button
    expect(
      root.querySelectorAll('tbody tr')[0].querySelectorAll('input'),
    ).toHaveLength(2);
    expect(button(root.querySelectorAll('tbody tr')[1], 'Edit')).toBeTruthy();
    const [name, age] = bodyInputs(root);
    type(name, 'Caroline');
    name.dispatchEvent(new FocusEvent('blur'));
    type(age, '31');
    age.dispatchEvent(new FocusEvent('blur'));
    const select = root.querySelector<HTMLSelectElement>('tbody select')!;
    select.value = 'Rome';
    select.dispatchEvent(new Event('change', { bubbles: true }));
    flushSync();
    button(root, 'Save').click();
    flushSync();
    expect(onEditingRowSave).toHaveBeenCalledTimes(1);
    expect(onEditingRowSave.mock.calls[0][0].values).toEqual({
      age: '31',
      city: 'Rome',
      name: 'Caroline',
    });
    expect(bodyInputs(root)).toHaveLength(0);
  });

  it('cancels editing', () => {
    const onEditingRowCancel = vi.fn();
    const { root, table } = render({
      editDisplayMode: 'row',
      enableEditing: true,
      onEditingRowCancel,
    });
    button(root, 'Edit').click();
    flushSync();
    button(root, 'Cancel').click();
    flushSync();
    expect(onEditingRowCancel).toHaveBeenCalledTimes(1);
    expect(table.mrtState.editingRow).toBe(null);
  });

  it('shows no save button without a save handler', () => {
    const { root } = render({ editDisplayMode: 'row', enableEditing: true });
    button(root, 'Edit').click();
    flushSync();
    expect(button(root, 'Save')).toBeNull();
    expect(button(root, 'Cancel')).toBeTruthy();
  });
});

describe('table editing', () => {
  it('shows an input in every cell', () => {
    const { root } = render({ editDisplayMode: 'table', enableEditing: true });
    // two text columns x two rows
    expect(bodyInputs(root)).toHaveLength(4);
    expect(root.querySelectorAll('tbody select')).toHaveLength(2);
  });
});

describe('modal editing', () => {
  it('edits a row in a dialog', () => {
    const onEditingRowSave = vi.fn(({ exitEditingMode }) => exitEditingMode());
    const { root, table } = render({
      editDisplayMode: 'modal',
      enableEditing: true,
      onEditingRowSave,
    });
    expect(document.body.querySelector('.mdc-dialog')).toBeNull();
    button(root, 'Edit').click();
    flushSync();
    const dialog = document.body.querySelector('.mdc-dialog')!;
    expect(dialog).not.toBeNull();
    expect(dialog.querySelector('.mdc-dialog__title')?.textContent).toContain(
      'Edit',
    );
    const inputs = Array.from(
      dialog.querySelectorAll<HTMLInputElement>('input'),
    );
    expect(inputs).toHaveLength(2);
    type(inputs[0], 'Caroline');
    inputs[0].dispatchEvent(new FocusEvent('blur'));
    flushSync();
    buttonByText('Save').click();
    flushSync();
    expect(onEditingRowSave.mock.calls[0][0].values.name).toBe('Caroline');
    expect(table.mrtState.editingRow).toBe(null);
    expect(document.body.querySelector('.mdc-dialog--open')).toBeNull();
  });

  it('lets a snippet replace the dialog content', () => {
    const editRowDialogContent = createRawSnippet<[any]>(() => ({
      render: () => `<div class="custom-dialog">custom</div>`,
    }));
    const { root } = render({
      editDisplayMode: 'modal',
      editRowDialogContent,
      enableEditing: true,
    });
    button(root, 'Edit').click();
    flushSync();
    expect(document.body.querySelector('.custom-dialog')).not.toBeNull();
    expect(document.body.querySelector('.mdc-dialog__title')).toBeNull();
  });
});

describe('creating rows', () => {
  it('creates a row in a dialog', () => {
    const onCreatingRowSave = vi.fn(({ exitCreatingMode }) =>
      exitCreatingMode(),
    );
    const { table } = render({
      createDisplayMode: 'modal',
      enableEditing: true,
      onCreatingRowSave,
    });
    table.setCreatingRow(true);
    flushSync();
    const dialog = document.body.querySelector('.mdc-dialog')!;
    expect(dialog).not.toBeNull();
    const [name] = Array.from(
      dialog.querySelectorAll<HTMLInputElement>('input'),
    );
    type(name, 'Zed');
    name.dispatchEvent(new FocusEvent('blur'));
    flushSync();
    buttonByText('Save').click();
    flushSync();
    expect(onCreatingRowSave).toHaveBeenCalledTimes(1);
    expect(onCreatingRowSave.mock.calls[0][0].values.name).toBe('Zed');
    expect(table.mrtState.creatingRow).toBe(null);
  });

  it('creates a row inline at the top', () => {
    const onCreatingRowSave = vi.fn(({ exitCreatingMode }) =>
      exitCreatingMode(),
    );
    const { root, table } = render({
      createDisplayMode: 'row',
      enableEditing: true,
      onCreatingRowSave,
    });
    table.setCreatingRow(true);
    flushSync();
    const rows = root.querySelectorAll('tbody tr');
    expect(rows).toHaveLength(3);
    expect(rows[0].querySelectorAll('input')).toHaveLength(2); // the new, empty row
    expect(rows[1].textContent).toContain('Carol');
    const [name] = bodyInputs(root);
    type(name, 'Zed');
    name.dispatchEvent(new FocusEvent('blur'));
    button(root, 'Save').click();
    flushSync();
    expect(onCreatingRowSave.mock.calls[0][0].values.name).toBe('Zed');
    expect(root.querySelectorAll('tbody tr')).toHaveLength(2);
  });

  it('inserts the new row at the bottom', () => {
    const { root, table } = render({
      createDisplayMode: 'row',
      enableEditing: true,
      positionCreatingRow: 'bottom',
    });
    table.setCreatingRow(true);
    flushSync();
    const rows = root.querySelectorAll('tbody tr');
    expect(rows[2].querySelectorAll('input')).toHaveLength(2);
  });
});

describe('custom edit components', () => {
  it('renders an Edit snippet instead of the input', () => {
    const Edit = createRawSnippet<[any]>(() => ({
      render: () => `<i class="my-edit">edit</i>`,
    }));
    const { root } = render({
      columns: [{ ...columns[0], Edit }, columns[1]],
      editDisplayMode: 'table',
      enableEditing: true,
    });
    expect(root.querySelectorAll('.my-edit')).toHaveLength(2);
  });
});

describe('click to copy', () => {
  it('copies a cell value and confirms', () => {
    const writeText = vi.fn();
    Object.assign(navigator, { clipboard: { writeText } });
    const { root } = render({ enableClickToCopy: true });
    const copy = root.querySelector<HTMLButtonElement>(
      'tbody .mrt-copy-button',
    )!;
    expect(copy.title).toBe('Click to copy');
    copy.click();
    flushSync();
    expect(writeText).toHaveBeenCalledWith('Carol');
    expect(copy.title).toBe('Copied to clipboard');
  });

  it('does not wrap cells when disabled for the column', () => {
    const { root } = render({
      columns: [{ ...columns[0], enableClickToCopy: false }, columns[1]],
      enableClickToCopy: true,
    });
    const firstRow = root.querySelector('tbody tr')!;
    expect(
      firstRow.querySelectorAll('td')[0].querySelector('.mrt-copy-button'),
    ).toBeNull();
    expect(
      firstRow.querySelectorAll('td')[1].querySelector('.mrt-copy-button'),
    ).not.toBeNull();
  });
});

describe('cell action menu', () => {
  it('opens on right click with copy and edit items', () => {
    const writeText = vi.fn();
    Object.assign(navigator, { clipboard: { writeText } });
    const { root, table } = render({
      editDisplayMode: 'cell',
      enableCellActions: true,
      enableClickToCopy: 'context-menu',
      enableEditing: true,
    });
    root
      .querySelector('tbody tr td')!
      .dispatchEvent(
        new MouseEvent('contextmenu', { bubbles: true, cancelable: true }),
      );
    flushSync();
    expect(table.mrtState.actionCell?.id).toBeTruthy();
    const items = Array.from(
      document.body.querySelectorAll<HTMLElement>('.mdc-deprecated-list-item'),
    ).map((i) => i.textContent?.trim());
    expect(items).toEqual(['Copy', 'Edit']);
    Array.from(
      document.body.querySelectorAll<HTMLElement>('.mdc-deprecated-list-item'),
    )[0].click();
    flushSync();
    expect(writeText).toHaveBeenCalledWith('Carol');
    expect(table.mrtState.actionCell).toBe(null);
  });
});

describe('loading overlay', () => {
  it('covers the table while loading', () => {
    const { root } = render({ state: { isLoading: true } });
    expect(root.querySelector('.mrt-loading-overlay')).not.toBeNull();
    expect(
      root.querySelector('.mrt-table-container')!.getAttribute('aria-busy'),
    ).toBe('true');
  });

  it('can be turned off', () => {
    const { root } = render({
      state: { isLoading: true, showLoadingOverlay: false },
    });
    expect(root.querySelector('.mrt-loading-overlay')).toBeNull();
  });

  it('shows the overlay on demand without loading', () => {
    const { root } = render({ state: { showLoadingOverlay: true } });
    expect(root.querySelector('.mrt-loading-overlay')).not.toBeNull();
  });
});
