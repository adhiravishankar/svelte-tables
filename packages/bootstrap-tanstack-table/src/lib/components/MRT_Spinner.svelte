<script lang="ts">
  /** A small indeterminate circular progress indicator. */
  let { size = 18 }: { size?: number } = $props();
</script>

<svg
  aria-hidden="true"
  class="mrt-spinner"
  height={size}
  viewBox="22 22 44 44"
  width={size}
>
  <circle
    cx="44"
    cy="44"
    fill="none"
    r="20.2"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-width="3.6"
  />
</svg>

<style>
  .mrt-spinner {
    animation: mrt-spin 1.4s linear infinite;
    display: inline-block;
  }
  .mrt-spinner circle {
    animation: mrt-dash 1.4s ease-in-out infinite;
    stroke-dasharray: 80px, 200px;
    stroke-dashoffset: 0;
  }
  @keyframes mrt-spin {
    to {
      transform: rotate(360deg);
    }
  }
  @keyframes mrt-dash {
    0% {
      stroke-dasharray: 1px, 200px;
      stroke-dashoffset: 0;
    }
    50% {
      stroke-dasharray: 100px, 200px;
      stroke-dashoffset: -15px;
    }
    100% {
      stroke-dasharray: 100px, 200px;
      stroke-dashoffset: -125px;
    }
  }
</style>
