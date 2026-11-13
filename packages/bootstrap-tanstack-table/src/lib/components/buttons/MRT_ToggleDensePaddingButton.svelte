<script lang="ts" generics="TData extends MRT_RowData">
  import type { MRT_RowData, MRT_TableInstance } from '../../types';
  import MRT_IconButton from './MRT_IconButton.svelte';

  let {
    table,
    ...rest
  }: { table: MRT_TableInstance<TData>; [key: string]: any } = $props();

  const density = $derived(table.mrtState.density);
  const Icon = $derived(
    density === 'compact'
      ? table.options.icons.DensitySmallIcon
      : density === 'comfortable'
        ? table.options.icons.DensityMediumIcon
        : table.options.icons.DensityLargeIcon,
  );

  const toggle = () =>
    table.setDensity(
      density === 'comfortable'
        ? 'compact'
        : density === 'compact'
          ? 'spacious'
          : 'comfortable',
    );
</script>

<MRT_IconButton
  label={table.options.localization.toggleDensity}
  onclick={toggle}
  {...rest}
>
  <Icon />
</MRT_IconButton>
