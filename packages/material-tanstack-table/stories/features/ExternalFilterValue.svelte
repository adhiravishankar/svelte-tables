<script lang="ts">
  import {
    MaterialSvelteTable,
    createMaterialSvelteTable,
  } from '../../src/lib';
  import { employeeColumns, employees } from '../data';

  // creating the table yourself gives you its API (`setColumnFilters`, ...)
  const table = createMaterialSvelteTable({
    columns: employeeColumns,
    data: employees,
    initialState: { showColumnFilters: true },
  });
</script>

<div style="display: flex; gap: 0.5rem; margin-bottom: 1rem">
  <button onclick={() => table.setColumnFilters([{ id: 'state', value: 'Ohio' }])}>
    Filter state: Ohio
  </button>
  <button onclick={() => table.setColumnFilters([{ id: 'gender', value: 'Female' }])}>
    Filter gender: Female
  </button>
  <button onclick={() => table.resetColumnFilters(true)}>Clear filters</button>
</div>
<MaterialSvelteTable {table} />
