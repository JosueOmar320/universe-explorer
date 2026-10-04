export type PaginationItem = number | 'ellipsis-start' | 'ellipsis-end';

/**
 * Builds a compact page list with a constant number of slots, e.g. for page 6 of 42:
 * `[1, 'ellipsis-start', 5, 6, 7, 'ellipsis-end', 42]`.
 * A constant length keeps the control from shifting width while paging.
 */
export function getPaginationRange(
  currentPage: number,
  totalPages: number,
  siblingCount = 1,
): PaginationItem[] {
  // first + last + current + 2 ellipses + siblings on both sides
  const totalSlots = siblingCount * 2 + 5;

  if (totalPages <= totalSlots) {
    return range(1, totalPages);
  }

  const leftSibling = Math.max(currentPage - siblingCount, 1);
  const rightSibling = Math.min(currentPage + siblingCount, totalPages);
  const showStartEllipsis = leftSibling > 2;
  const showEndEllipsis = rightSibling < totalPages - 1;
  const edgeRangeLength = totalSlots - 2; // slots left after one ellipsis + one boundary page

  if (!showStartEllipsis) {
    return [...range(1, edgeRangeLength), 'ellipsis-end', totalPages];
  }

  if (!showEndEllipsis) {
    return [1, 'ellipsis-start', ...range(totalPages - edgeRangeLength + 1, totalPages)];
  }

  return [1, 'ellipsis-start', ...range(leftSibling, rightSibling), 'ellipsis-end', totalPages];
}

function range(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}
