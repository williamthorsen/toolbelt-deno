/**
 * Returns an array in which each element contains the running total of the input array up to the same index.
 * Undefined values are treated as 0.
 */
export function toCumulativeValues(weights: ReadonlyArray<number | undefined>): number[] {
  const cumulativeWeights: number[] = [];
  let cumulativeWeight = 0;

  for (const weight of weights) {
    const addend = weight ?? 0;
    if (addend < 0) {
      throw new Error('All weights must be non-negative numbers.');
    }

    cumulativeWeight += addend;
    cumulativeWeights.push(cumulativeWeight);
  }

  return cumulativeWeights;
}

/** @deprecated Use `toCumulativeValues` */
export const getCumulativeWeights = toCumulativeValues;

/**
 * Wrapper for `toCumulativeValues` allowing it to be used with items that are not weights but have extractable weights.
 * @items The array of items.
 * @getWeight A function that extracts the weight of each item.
 */
export function accumulateWeights<T>(
  items: ReadonlyArray<T>,
  getWeight: (item: T, index: number, items: ReadonlyArray<T>) => number | undefined,
) {
  return toCumulativeValues(items.map(getWeight));
}
