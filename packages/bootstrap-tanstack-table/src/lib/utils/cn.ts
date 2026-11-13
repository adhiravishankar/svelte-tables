import { clsx, type ClassValue } from 'clsx';

// Bootstrap classes don't collide the way Tailwind utilities do, so a plain
// clsx (no tailwind-merge dedup) is all `cn` needs here.
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, 'child'> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type WithoutChildren<T> = T extends { children?: any }
  ? Omit<T, 'children'>
  : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & {
  ref?: U | null;
};
