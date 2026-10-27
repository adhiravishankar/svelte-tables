import { type DropdownOption } from '../types';

export const parseFromValuesOrFunc = <T, U>(
  fn: ((arg: U) => T) | T | undefined,
  arg: U,
): T | undefined => (fn instanceof Function ? fn(arg) : fn);

export const getValueAndLabel = (
  option?: DropdownOption | null,
): { label: string; value: string } => {
  let label: string = '';
  let value: string = '';
  if (option) {
    if (typeof option !== 'object') {
      label = option;
      value = option;
    } else {
      label = option.label ?? option.value;
      value = option.value ?? label;
    }
  }
  return { label, value };
};

/** Delays `fn` until `wait` ms have passed since the last call. */
export const debounce = <Args extends unknown[]>(
  fn: (...args: Args) => void,
  wait: number,
) => {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  const debounced = (...args: Args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), wait);
  };
  debounced.clear = () => clearTimeout(timeout);
  return debounced;
};
