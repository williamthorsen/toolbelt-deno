/**
 * Returns an array in which each element contains the running total of the input array up to the same index.
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
 * Wrapper for `toCumulativeValues` that accepts an array of items and a function that extracts the weight of each item.
 */
export function accumulateWeights<T>(items: ReadonlyArray<T>, getWeight: (item: T, index?: number) => number) {
  return toCumulativeValues(items.map(getWeight));
}
