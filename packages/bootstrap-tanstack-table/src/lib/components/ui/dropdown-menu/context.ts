/** Context shared between `DropdownMenu.Root` and its descendants. */
export type MRT_DropdownMenuContext = {
  readonly open: boolean;
  close: () => void;
};
