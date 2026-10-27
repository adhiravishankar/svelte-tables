/**
 * A reactive media query. Unlike `MediaQuery` from `svelte/reactivity` it
 * tolerates environments without `matchMedia` (SSR, jsdom) and reports `false`.
 */
export const createMediaQuery = (query: string) => {
  let matches = $state(false);

  $effect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mql = window.matchMedia(query);
    matches = mql.matches;
    const onChange = (event: MediaQueryListEvent) => (matches = event.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  });

  return {
    get current() {
      return matches;
    },
  };
};
