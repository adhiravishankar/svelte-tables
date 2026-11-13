/**
 * An attachment (`{@attach ...}`) that positions a floating panel (a menu or
 * popover) next to an arbitrary anchor element, and dismisses it on outside
 * clicks or Escape. This replaces bits-ui/Floating UI for the handful of
 * anchored panels MRT renders (`MRT_Menu`, the filter popover): no Popper
 * dependency, just `getBoundingClientRect` and `position: fixed`.
 */
export const floatingAnchor =
  (options: {
    anchor: HTMLElement;
    side?: 'bottom' | 'right';
    align?: 'start' | 'end';
    onDismiss: () => void;
  }) =>
  (node: HTMLElement) => {
    const { anchor, side = 'bottom', align = 'start', onDismiss } = options;

    const reposition = () => {
      const anchorRect = anchor.getBoundingClientRect();
      const nodeRect = node.getBoundingClientRect();
      let top: number;
      let left: number;
      if (side === 'right') {
        left = anchorRect.right;
        top =
          align === 'end'
            ? anchorRect.bottom - nodeRect.height
            : anchorRect.top;
      } else {
        top = anchorRect.bottom;
        left =
          align === 'end' ? anchorRect.right - nodeRect.width : anchorRect.left;
      }
      const margin = 4;
      left = Math.min(
        Math.max(margin, left),
        Math.max(margin, window.innerWidth - nodeRect.width - margin),
      );
      top = Math.min(
        Math.max(margin, top),
        Math.max(margin, window.innerHeight - nodeRect.height - margin),
      );
      node.style.position = 'fixed';
      node.style.top = `${top}px`;
      node.style.left = `${left}px`;
      node.style.margin = '0';
    };

    reposition();
    // the panel's size can change once its content/fonts settle
    const raf = requestAnimationFrame(reposition);

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (node.contains(target) || anchor.contains(target)) return;
      onDismiss();
    };
    const onKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onDismiss();
    };

    window.addEventListener('pointerdown', onPointerDown, true);
    window.addEventListener('keydown', onKeydown, true);
    window.addEventListener('resize', reposition);
    window.addEventListener('scroll', reposition, true);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointerdown', onPointerDown, true);
      window.removeEventListener('keydown', onKeydown, true);
      window.removeEventListener('resize', reposition);
      window.removeEventListener('scroll', reposition, true);
    };
  };
