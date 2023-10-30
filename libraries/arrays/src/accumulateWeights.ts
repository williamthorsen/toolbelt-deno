import { toCumulativeValues } from './toCumulativeValues.ts';

/**
 * Extracts weights from an array of items and returns an array of cumulative weights.
 * If all weights are undefined, returns an array of uniformly cumulative weights.
 * If any weights are defined, undefined weights are treated as 0.
 * @items The array of items.
 * @getWeight A function that extracts the weight of each item.
 */
export function accumulateWeights<T>(
  items: ReadonlyArray<T>,
  getWeight: (item: T, index: number, items: ReadonlyArray<T>) => number | undefined,
): number[] {
  if (items.every((item, index, items) => getWeight(item, index, items) === undefined)) {
    return items.map((_, index) => index + 1);
  }
  return toCumulativeValues(items.map(getWeight));
}
