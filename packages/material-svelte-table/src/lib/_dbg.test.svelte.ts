import { flushSync, mount } from 'svelte';
import { it } from 'vitest';
import MaterialSvelteTable from './components/MaterialSvelteTable.svelte';

it('virt', async () => {
  const target = document.createElement('div');
  document.body.appendChild(target);
  const ref: any = { current: null };
  let notify: any;
  mount(MaterialSvelteTable as any, { props: { options: {
    columns: [{ accessorKey: 'id', header: 'Id' }],
    data: Array.from({ length: 500 }, (_, i) => ({ id: `row-${i}` })),
    enableBottomToolbar: false, enableTopToolbar: false, enablePagination: false,
    enableRowVirtualization: true,
    rowVirtualizerInstanceRef: ref,
    rowVirtualizerOptions: {
      observeElementOffset: (_: any, cb: any) => { notify = cb; cb(0, false); return () => {}; },
      observeElementRect: (_: any, cb: any) => { console.log('RECT observed'); cb({ width: 800, height: 300 }); return () => {}; },
    } } }, target });
  flushSync();
  await Promise.resolve(); flushSync();
  const v = ref.current;
  console.log('STATE', !!v, 'count', v?.options.count, 'scrollEl', !!v?.scrollElement, 'rect', JSON.stringify(v?.scrollRect), 'items', v?.getVirtualItems().length, 'rows', target.querySelectorAll('tbody tr').length);
});
