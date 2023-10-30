import { toCumulativeValues } from './toCumulativeValues.ts';
import { extractWeights } from './extractWeights.ts';

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
  const weights = extractWeights(items, getWeight);
  return toCumulativeValues(weights);
}
