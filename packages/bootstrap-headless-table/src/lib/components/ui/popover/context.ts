/** Context shared between `Popover.Root` and its descendants. */
export type MRT_PopoverContext = {
  readonly open: boolean;
  close: () => void;
};
