import { assertEquals, describe, it } from '../../dev_deps.ts';
import { accumulateWeights } from '../accumulateWeights.ts';

describe('accumulateWeights', () => {
  it('uses the given function to get the weight of each item', () => {
    const items = [{ weight: 1 }, { weight: 2 }, { weight: 3 }];
    const getWeight = (item: { weight: number }) => item.weight;

    const cumulativeWeights = accumulateWeights(items, getWeight);

    assertEquals(cumulativeWeights, [1, 3, 6]);
  });

  it('accepts a predicate function that returns undefined', () => {
    const items = [{ weight: 1 }, { weight: 2 }, {}];
    const getWeight = (item: { weight?: number }) => item.weight;

    const cumulativeWeights = accumulateWeights(items, getWeight);

    assertEquals(cumulativeWeights, [1, 3, 3]);
  });

  it('if all weights are undefined, returns uniform cumulative weights', () => {
    const items = [{ weight: undefined }, { weight: undefined }, {}];
    const getWeight = (item: { weight?: number }) => item.weight;
    const uniformWeight = 1 / items.length;
    const expectedCumulativeWeights = items.map((_, index) => uniformWeight * (index + 1));

    const actualCumulativeWeights = accumulateWeights(items, getWeight);

    assertEquals(actualCumulativeWeights, expectedCumulativeWeights);
  });
});
