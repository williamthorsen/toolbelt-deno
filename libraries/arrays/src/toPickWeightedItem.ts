import type { Seed } from '../../numbers/src/numbers.types.ts';
import { pickWeightedIndex } from './pickWeightedIndex.ts';

/**
 * Returns a random item from the array using weighted odds.
 * If the array is empty, throws an error.
 */
export function toPickWeightedItem<T>(
  items: ReadonlyArray<T>,
  cumulativeWeights: ReadonlyArray<number>,
): (options?: PickWeightedItemOptions) => T {
  // By performing this check now, we can guarantee that the returned function always returns a defined value.
  if (items.length === 0) {
    throw new Error('Cannot create function with an empty array.');
  }

  if (cumulativeWeights.length !== items.length) {
    throw new Error('The number of weights must match the number of items.');
  }

  return function pickWeightedItem(options: PickWeightedItemOptions = {}): T {
    const index = pickWeightedIndex(cumulativeWeights, options);
    return items[index];
  };
}

export interface PickWeightedItemOptions {
  seed?: Seed;
}
