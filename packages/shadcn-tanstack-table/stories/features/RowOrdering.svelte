<script lang="ts">
  import { untrack } from 'svelte';
  import { ShadcnSvelteTable } from '../../src/lib';
  import { employeeColumns, employees } from '../data';

  let {
    columnOrdering = false,
    selection = false,
  }: { columnOrdering?: boolean; selection?: boolean } = $props();

  let data = $state(untrack(() => employees.slice(0, 15).map((e) => ({ ...e }))));
</script>

<!-- dragging a row onto another moves it: the table tells you which two rows -->
<ShadcnSvelteTable
  options={{
    columns: employeeColumns,
    get data() {
      return data;
    },
    enableColumnOrdering: columnOrdering,
    enablePagination: false,
    enableRowOrdering: true,
    enableRowSelection: selection,
    enableSorting: false,
    rowDragHandleProps: ({ table }) => ({
      ondragend: () => {
        const { draggingRow, hoveredRow } = table.mrtState;
        if (hoveredRow && 'index' in hoveredRow && draggingRow) {
          const copy = [...data];
          copy.splice(hoveredRow.index as number, 0, copy.splice(draggingRow.index, 1)[0]);
          data = copy;
        }
      },
    }),
  }}
/>
