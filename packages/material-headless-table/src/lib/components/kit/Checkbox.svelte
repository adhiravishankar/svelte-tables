<script lang="ts">
  import Checkbox from '@smui/checkbox';

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

<span class="hdt-kit-checkbox">
  <Checkbox
    {checked}
    {disabled}
    {indeterminate}
    input$aria-label={label}
    input$onclick={(event: MouseEvent) => {
      event.stopPropagation();
      onchange(!checked);
    }}
    touch
  />
</span>

<style>
  .hdt-kit-checkbox {
    display: inline-flex;
    height: 2.5rem;
    margin: -0.4rem;
    width: 2.5rem;
  }
</style>
