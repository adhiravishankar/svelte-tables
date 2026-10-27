<script lang="ts" generics="TData extends MRT_RowData">
  import { untrack } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { createMaterialSvelteTable } from '../createMaterialSvelteTable.svelte';
  import type {
    MRT_RowData,
    MRT_TableInstance,
    MRT_TableOptions,
  } from '../types';
  import MRT_TablePaper from './table/MRT_TablePaper.svelte';

  /**
   * Renders a table. Pass either options (a table is created for you) or a
   * `table` made with `createMaterialSvelteTable` when you need the instance.
   */
  type Props =
    | ({ table: MRT_TableInstance<TData>; options?: never } & HTMLAttributes<HTMLDivElement>)
    | ({ options: MRT_TableOptions<TData>; table?: never } & HTMLAttributes<HTMLDivElement>);

  let { options, table: providedTable, ...rest }: Props = $props();

  // the table is created once; reactive options must be passed as getters
  const table: MRT_TableInstance<TData> = untrack(
    () => providedTable ?? createMaterialSvelteTable(options!),
  );
</script>

<MRT_TablePaper {table} {...rest} />
