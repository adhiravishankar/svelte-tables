import { type Range, defaultRangeExtractor } from '@tanstack/virtual-core';

/**
 * When scrolling, the `draggingRow` or `draggingColumn` can be removed from the
 * document because of virtualization, and then the `dragend` event on the grab
 * handle never fires. Keep the dragged item in `getVirtualItems()` to avoid it.
 */
export const extraIndexRangeExtractor = (
  range: Range,
  draggingIndex?: number,
) => {
  const newIndexes = defaultRangeExtractor(range);
  if (draggingIndex === undefined) return newIndexes;
  if (
    draggingIndex >= 0 &&
    draggingIndex < Math.max(range.startIndex - range.overscan, 0)
  ) {
    newIndexes.unshift(draggingIndex);
  }
  if (draggingIndex >= 0 && draggingIndex > range.endIndex + range.overscan) {
    newIndexes.push(draggingIndex);
  }
  return newIndexes;
};
