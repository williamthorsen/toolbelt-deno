import { pickRandomWeightedIndex } from './pickRandomWeightedIndex.ts';

/**
 * Returns a random item from the array using weighted odds.
 * If the array is empty, throws an error.
 */
export function toPickRandomWeightedItem<T>(
  items: ReadonlyArray<T>,
  cumulativeWeights: ReadonlyArray<number>,
): (options?: Options) => T {
  // By performing this check now, we can guarantee that the returned function always returns a defined value.
  if (items.length === 0) {
    throw new Error('Cannot create function with an empty array.');
  }

  if (cumulativeWeights.length !== items.length) {
    throw new Error('The number of weights must match the number of items.');
  }

  return function pickRandomWeightedItem(options: Options = {}): T {
    const index = pickRandomWeightedIndex(cumulativeWeights, options);
    return items[index];
  };
}

interface Options {
  seed?: number | undefined;
}
