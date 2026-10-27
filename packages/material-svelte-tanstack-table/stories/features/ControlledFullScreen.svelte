<script lang="ts">
  import { MaterialSvelteTable } from '../../src/lib';
  import { employeeColumns, employees } from '../data';

  let isFullScreen = $state(false);
</script>

<p>
  <button onclick={() => (isFullScreen = !isFullScreen)}>
    {isFullScreen ? 'Exit' : 'Enter'} full screen
  </button>
  (also try the toolbar button, or press Escape)
</p>
<MaterialSvelteTable
  options={{
    columns: employeeColumns,
    data: employees.slice(0, 25),
    onIsFullScreenChange: (updater) => {
      isFullScreen = typeof updater === 'function' ? updater(isFullScreen) : updater;
    },
    state: {
      get isFullScreen() {
        return isFullScreen;
      },
    },
  }}
/>
