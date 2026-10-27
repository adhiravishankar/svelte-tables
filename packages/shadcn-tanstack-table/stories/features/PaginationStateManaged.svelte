<script lang="ts">
  import {
    MaterialSvelteTable,
    type MRT_PaginationState,
  } from '../../src/lib';
  import { people, personColumns } from '../data';

  let pagination = $state<MRT_PaginationState>({ pageIndex: 2, pageSize: 5 });
</script>

<p>
  Page {pagination.pageIndex + 1}, {pagination.pageSize} rows per page
  <button onclick={() => (pagination = { ...pagination, pageIndex: 0 })}>Back to first page</button>
</p>
<MaterialSvelteTable
  options={{
    columns: personColumns,
    data: people,
    onPaginationChange: (updater) => {
      pagination = typeof updater === 'function' ? updater(pagination) : updater;
    },
    state: {
      get pagination() {
        return pagination;
      },
    },
  }}
/>
