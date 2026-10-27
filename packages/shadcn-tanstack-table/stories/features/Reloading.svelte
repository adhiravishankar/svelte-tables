<script lang="ts">
  import { ShadcnSvelteTable } from '../../src/lib';
  import { employeeColumns, makeEmployees } from '../data';

  let data = $state(makeEmployees(15));
  let isLoading = $state(false);
  let isRefetching = $state(false);

  async function reload() {
    isRefetching = true;
    await new Promise((resolve) => setTimeout(resolve, 1500)); // pretend API call
    data = makeEmployees(15);
    isRefetching = false;
  }

  async function firstLoad() {
    data = [];
    isLoading = true;
    await new Promise((resolve) => setTimeout(resolve, 1500));
    data = makeEmployees(15);
    isLoading = false;
  }
</script>

<p>
  <button onclick={reload}>Refetch (keeps the rows)</button>
  <button onclick={firstLoad}>First load (skeletons)</button>
</p>
<ShadcnSvelteTable
  options={{
    columns: employeeColumns,
    get data() {
      return data;
    },
    state: {
      get isLoading() {
        return isLoading;
      },
      get showProgressBars() {
        return isRefetching;
      },
    },
  }}
/>
