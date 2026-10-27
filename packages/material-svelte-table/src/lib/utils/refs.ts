import { type MRT_Ref } from '../types';

/**
 * An attachment (`{@attach ...}`) that stores the element in an MRT ref while
 * it is mounted. Refs are plain holders, so unlike `bind:this` this works
 * inside conditional blocks without reactivity warnings.
 */
export const attachRef =
  <T extends Element>(ref: MRT_Ref<T>) =>
  (node: T) => {
    ref.current = node;
    return () => {
      if (ref.current === node) ref.current = null;
    };
  };
