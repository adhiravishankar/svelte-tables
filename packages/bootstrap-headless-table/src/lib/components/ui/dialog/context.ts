/** Context shared between `Dialog.Root` and its descendants. */
export type MRT_DialogContext = {
  readonly open: boolean;
  close: () => void;
  setOpen: (open: boolean) => void;
};
