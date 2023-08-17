import type { PickRandomOptions } from './pickWeightedIndex.ts';
import { pickWeightedIndex } from './pickWeightedIndex.ts';
import { getCumulativeWeights } from './getCumulativeWeights.ts';

/**
 * Returns a function that pseudo-randomly picks an item from the array using weighted odds, which are derived
 * from the provided distribution.
 */
export function toPickFromDistribution<T>(
  items: T[],
  distribution: Distribution,
  options: Options<T>
): (pickRandomOptions?: PickRandomOptions) => T {
  const { defaultWeight = 0, getName } = options;

  const filteredItems: T[] = [];
  const filteredWeights: number[] = [];

  items.forEach(item => {
    const weight = distribution[getName(item)] || defaultWeight;
    if (weight > 0) {
      filteredItems.push(item);
      filteredWeights.push(weight);
    }
  });

  if (filteredItems.length === 0) {
    throw new Error('Cannot create function with an empty array.');
  }

  const cumulativeWeights = getCumulativeWeights(filteredWeights);

  return function pickFromDistribution(pickRandomOptions: PickRandomOptions = {}) {
    const index = pickWeightedIndex(cumulativeWeights, pickRandomOptions);
    return filteredItems[index];
  }
}

interface Distribution {
  [key: string]: number;
}

interface Options<T> {
  defaultWeight?: number;
  getName: (item: T) => string;
}
