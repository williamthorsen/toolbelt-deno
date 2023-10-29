/**
 * Returns an array in which each element contains the running total of the input array up to the same index.
 */
export function accumulateWeights(weights: ReadonlyArray<number | undefined>): number[] {
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

/** @deprecated Use `accumulateWeights` */
export const getCumulativeWeights = accumulateWeights;

/**
 * Wrapper for `accumulateWeights` that accepts an array of items and a function that extracts the weight of each item.
 */
export function accumulateItemWeights<T>(items: ReadonlyArray<T>, getWeight: (item: T, index?: number) => number) {
  return accumulateWeights(items.map(getWeight));
}
