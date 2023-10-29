import { toCumulativeValues } from './toCumulativeValues.ts';
import { pickWeightedItem } from './pickWeightedItem.ts';

/**
 * Returns a function that pseudo-randomly picks an item from the array using weighted odds, which are derived
 * from the provided distribution.
 */
export function toPickWeightedItemFromDistribution<TItem, TCategory extends string>(
  items: ReadonlyArray<TItem>,
  distribution: Partial<Distribution<TCategory>>,
  params: Params<TItem, TCategory>,
): ReturnType<typeof pickWeightedItem<TItem>> {
  const { defaultWeight = 0, getCategory } = params;

  const filteredItems: TItem[] = [];
  const filteredWeights: number[] = [];

  items.forEach((item) => {
    const weight = distribution[getCategory(item)] ?? defaultWeight;
    if (weight > 0) {
      filteredItems.push(item);
      filteredWeights.push(weight);
    }
  });

  if (filteredItems.length === 0) {
    throw new Error('Cannot create function with an empty array.');
  }

  const cumulativeWeights = toCumulativeValues(filteredWeights);

  return pickWeightedItem(filteredItems, cumulativeWeights);
}

type Distribution<TCategory extends string> = Record<TCategory, number>;

interface Params<TItem, TCategory> {
  defaultWeight?: number | undefined;
  getCategory: (item: TItem) => TCategory;
}
