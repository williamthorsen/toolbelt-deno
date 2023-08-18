import { getCumulativeWeights } from './getCumulativeWeights.ts';
import { toPickWeightedItem } from './toPickWeightedItem.ts';

/**
 * Returns a function that pseudo-randomly picks an item from the array using weighted odds, which are derived
 * from the provided distribution.
 */
export function toPickWeightedItemFromDistribution<T>(
  items: ReadonlyArray<T>,
  distribution: Distribution,
  params: Params<T>,
): ReturnType<typeof toPickWeightedItem<T>> {
  const { defaultWeight = 0, getName } = params;

  const filteredItems: T[] = [];
  const filteredWeights: number[] = [];

  items.forEach((item) => {
    const weight = distribution[getName(item)] ?? defaultWeight;
    if (weight > 0) {
      filteredItems.push(item);
      filteredWeights.push(weight);
    }
  });

  if (filteredItems.length === 0) {
    throw new Error('Cannot create function with an empty array.');
  }

  const cumulativeWeights = getCumulativeWeights(filteredWeights);

  return toPickWeightedItem(filteredItems, cumulativeWeights);
}

interface Distribution {
  [key: string]: number;
}

interface Params<T> {
  defaultWeight?: number;
  getName: (item: T) => string;
}
