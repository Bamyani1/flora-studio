export interface JustifyOptions {
  /** Ideal row height as a fraction of the row width */
  targetHeight: number;
  /** Tallest a row may render, as a fraction of the row width */
  maxHeight: number;
  maxPerRow: number;
}

export interface JustifiedRow {
  /** Inclusive */
  start: number;
  /** Exclusive */
  end: number;
  /** flex-grow for each of two centering spacers; 0 when the photos fill the row */
  spacer: number;
}

/**
 * Splits photos into rows that each fill the width at one shared height. A row of
 * aspect ratios summing to S renders 1/S widths tall, so the partition minimises the
 * squared distance from `targetHeight` over all rows (exact DP, n is small).
 */
export function justifyRows(
  ratios: readonly number[],
  { targetHeight, maxHeight, maxPerRow }: JustifyOptions,
): JustifiedRow[] {
  const n = ratios.length;
  const cost = new Array<number>(n + 1).fill(Infinity);
  const rowStart = new Array<number>(n + 1).fill(0);
  cost[0] = 0;

  for (let end = 1; end <= n; end++) {
    let sum = 0;
    for (let start = end - 1; start >= 0 && end - start <= maxPerRow; start--) {
      sum += ratios[start];
      const candidate = cost[start] + (1 / sum - targetHeight) ** 2;
      if (candidate < cost[end]) {
        cost[end] = candidate;
        rowStart[end] = start;
      }
    }
  }

  const minSum = 1 / maxHeight;
  const rows: JustifiedRow[] = [];
  for (let end = n; end > 0; end = rowStart[end]) {
    const start = rowStart[end];
    let sum = 0;
    for (let i = start; i < end; i++) sum += ratios[i];
    rows.unshift({ start, end, spacer: sum < minSum ? (minSum - sum) / 2 : 0 });
  }
  return rows;
}

/**
 * Index where the second column starts, for a two-column stack filled column-first
 * (so reading order stays the archive order). Heights are in column widths; the
 * second column starts `offset` lower. Minimises the taller column.
 */
export function balanceColumns(heights: readonly number[], offset: number): number {
  if (heights.length <= 1) return heights.length;
  const total = heights.reduce((sum, h) => sum + h, 0);
  let left = 0;
  let split = 1;
  let tallest = Infinity;
  for (let k = 1; k < heights.length; k++) {
    left += heights[k - 1];
    const taller = Math.max(left, offset + total - left);
    if (taller < tallest) {
      tallest = taller;
      split = k;
    }
  }
  return split;
}
