import { untrack } from 'svelte';
import {
  Virtualizer,
  type VirtualizerOptions,
  elementScroll,
  observeElementOffset,
  observeElementRect,
} from '@tanstack/virtual-core';

type ElementVirtualizerOptions<
  TScrollElement extends Element,
  TItemElement extends Element,
> = Omit<
  VirtualizerOptions<TScrollElement, TItemElement>,
  'observeElementOffset' | 'observeElementRect' | 'scrollToFn'
> &
  Partial<
    Pick<
      VirtualizerOptions<TScrollElement, TItemElement>,
      'observeElementOffset' | 'observeElementRect' | 'scrollToFn'
    >
  >;

/**
 * A Svelte 5 adapter for TanStack Virtual's `Virtualizer`.
 *
 * `getOptions` is read in an effect, so anything reactive it touches (row
 * counts, density, ...) re-configures the virtualizer. The returned `instance`
 * getter is reactive: read it in templates or `$derived` to follow scrolling
 * and measuring. Must be called while a component is initializing.
 */
export function createVirtualizer<
  TScrollElement extends Element,
  TItemElement extends Element,
>(getOptions: () => ElementVirtualizerOptions<TScrollElement, TItemElement>) {
  // bumped whenever the virtualizer reports a change
  let version = $state(0);
  const bump = () => untrack(() => void version++);

  const resolve = (): VirtualizerOptions<TScrollElement, TItemElement> => {
    const options = getOptions();
    return {
      observeElementOffset,
      observeElementRect,
      scrollToFn: elementScroll,
      ...options,
      onChange: (instance, sync) => {
        options.onChange?.(instance, sync);
        bump();
      },
    } as VirtualizerOptions<TScrollElement, TItemElement>;
  };

  const virtualizer = new Virtualizer<TScrollElement, TItemElement>(
    untrack(resolve),
  );

  // keep the options in sync before anything renders from them
  $effect.pre(() => {
    virtualizer.setOptions(resolve());
  });

  $effect(() => virtualizer._didMount());

  // the scroll element (the table container) is attached by a parent, so it can
  // appear one tick after this component's effects ran: retry a few times
  let retries = 0;
  $effect(() => {
    const current = version;
    if (current < 0) return;
    virtualizer._willUpdate();
    if (!getOptions().getScrollElement() && retries < 5) {
      retries++;
      queueMicrotask(bump);
    }
  });

  return {
    /** The virtualizer; reading it subscribes to its changes. */
    get instance() {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      const current = version;
      return current < 0 ? virtualizer : virtualizer;
    },
  };
}
