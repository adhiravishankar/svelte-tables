<script lang="ts">
  import { Checkbox } from '../ui/checkbox';

  let {
    checked,
    disabled = false,
    indeterminate = false,
    label,
    onchange,
  }: {
    checked: boolean;
    disabled?: boolean;
    indeterminate?: boolean;
    /** Accessible name. */
    label: string;
    onchange: (checked: boolean) => void;
  } = $props();
</script>

<Checkbox
  aria-label={label}
  {checked}
  {disabled}
  {indeterminate}
  onCheckedChange={(value) => onchange(value)}
  onclick={(event: MouseEvent) => event.stopPropagation()}
/>
