import { assertEquals, describe, it } from '../../dev_deps.ts';
import { extractWeights } from '../extractWeights.ts';

describe('extractWeights', () => {
  it('uses the given function to get the weight of each item', () => {
    const items = [{ weight: 1 }, { weight: 2 }, { weight: 3 }];
    const getWeight = (item: { weight: number }) => item.weight;

    const weights = extractWeights(items, getWeight);

    assertEquals(weights, [1, 2, 3]);
  });

  it('accepts a predicate function that returns undefined', () => {
    const items = [{ weight: 1 }, { weight: 2 }, {}];
    const getWeight = (item: { weight?: number }) => item.weight;

    const weights = extractWeights(items, getWeight);

    assertEquals(weights, [1, 2, 0]);
  });

  it('if all weights are undefined, returns uniform weights', () => {
    const items = [{ weight: undefined }, { weight: undefined }, {}];
    const getWeight = (item: { weight?: number }) => item.weight;
    const expectedWeight = 1 / items.length;
    const expectedWeights = items.map(() => expectedWeight);

    const actualWeights = extractWeights(items, getWeight);

    assertEquals(actualWeights, expectedWeights);
  });
});
