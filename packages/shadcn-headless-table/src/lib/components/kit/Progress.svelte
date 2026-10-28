<script lang="ts">
  /** An indeterminate progress bar for the loading state. */
</script>

<div aria-busy="true" aria-label="Loading" class="hdt-progress" role="progressbar">
  <div class="hdt-progress-bar"></div>
</div>

<style>
  .hdt-progress {
    background: color-mix(in srgb, var(--primary) 20%, transparent);
    height: 4px;
    overflow: hidden;
    position: relative;
    width: 100%;
  }
  .hdt-progress-bar {
    animation: hdt-progress-indeterminate 1.5s ease-in-out infinite;
    background: var(--primary);
    height: 100%;
    width: 40%;
  }
  @keyframes hdt-progress-indeterminate {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(250%);
    }
  }
</style>
