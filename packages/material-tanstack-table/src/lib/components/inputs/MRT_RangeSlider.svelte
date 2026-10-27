<script lang="ts">
  /**
   * A dual-thumb range slider built from two overlapping native range inputs.
   * `onchange` fires with the committed value when a thumb is released.
   */
  let {
    max,
    min,
    onchange,
    value = $bindable(),
    ...rest
  }: {
    max: number;
    min: number;
    onchange?: (value: [number, number]) => void;
    value: [number, number];
    [key: string]: any;
  } = $props();

  const span = $derived(max - min || 1);
  const low = $derived(((value[0] - min) / span) * 100);
  const high = $derived(((value[1] - min) / span) * 100);

  const step = $derived(rest.step ?? (Number.isInteger(min) && Number.isInteger(max) ? 1 : (max - min) / 100));

  function setLow(next: number) {
    value = [Math.min(next, value[1]), value[1]];
  }
  function setHigh(next: number) {
    value = [value[0], Math.max(next, value[0])];
  }
  const commit = () => onchange?.(value);
</script>

<div class="mrt-range-slider">
  <div class="mrt-range-track">
    <div class="mrt-range-fill" style="left: {low}%; width: {high - low}%"></div>
  </div>
  <input
    aria-label="Minimum"
    {max}
    {min}
    onchange={commit}
    oninput={(e) => setLow(+e.currentTarget.value)}
    {step}
    type="range"
    value={value[0]}
    {...rest}
  />
  <input
    aria-label="Maximum"
    {max}
    {min}
    onchange={commit}
    oninput={(e) => setHigh(+e.currentTarget.value)}
    {step}
    type="range"
    value={value[1]}
    {...rest}
  />
  <div class="mrt-range-values">
    <span>{value[0]}</span>
    <span>{value[1]}</span>
  </div>
</div>

<style>
  .mrt-range-slider {
    height: 2.25rem;
    margin: 0 4px;
    position: relative;
  }
  .mrt-range-track {
    background: var(--mrt-divider);
    border-radius: 2px;
    height: 4px;
    left: 0;
    position: absolute;
    right: 0;
    top: 10px;
  }
  .mrt-range-fill {
    background: var(--mdc-theme-primary, #6200ee);
    border-radius: 2px;
    height: 100%;
    position: absolute;
  }
  input[type='range'] {
    accent-color: var(--mdc-theme-primary, #6200ee);
    appearance: none;
    background: none;
    height: 24px;
    left: 0;
    margin: 0;
    pointer-events: none;
    position: absolute;
    top: 0;
    width: 100%;
  }
  input[type='range']::-webkit-slider-thumb {
    appearance: none;
    background: var(--mdc-theme-primary, #6200ee);
    border-radius: 50%;
    cursor: pointer;
    height: 16px;
    pointer-events: auto;
    width: 16px;
  }
  input[type='range']::-moz-range-thumb {
    background: var(--mdc-theme-primary, #6200ee);
    border: 0;
    border-radius: 50%;
    cursor: pointer;
    height: 16px;
    pointer-events: auto;
    width: 16px;
  }
  .mrt-range-values {
    color: var(--mrt-text-secondary);
    display: flex;
    font-size: 0.75rem;
    justify-content: space-between;
    position: absolute;
    top: 22px;
    width: 100%;
  }
</style>
