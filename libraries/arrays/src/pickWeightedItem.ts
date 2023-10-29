import type { Seed } from '../sibling_deps.ts';
import { assertCumulativeWeights, pickWeightedIndex } from './pickWeightedIndex.ts';

/**
 * Returns a random item from the array using weighted odds.
 * If the array is empty, throws an error.
 */
export function pickWeightedItem<T>(
  items: ReadonlyArray<T>,
  cumulativeWeights: ReadonlyArray<number>,
): (options?: PickWeightedItemOptions) => T {
  // By performing this check now, we can guarantee that the returned function always returns a defined value.
  assertCumulativeWeights(cumulativeWeights, items.length);

  return function pickItem(options: PickWeightedItemOptions = {}): T {
    const index = pickWeightedIndex(cumulativeWeights, options);
    return items[index];
  };
}

export interface PickWeightedItemOptions {
  seed?: Seed | undefined;
}

/** @deprecated Use `pickWeightedItem` instead. */
export const toPickWeightedItem = pickWeightedItem;
