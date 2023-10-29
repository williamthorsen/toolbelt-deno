import { assertEquals, assertThrows, describe, it } from '../../dev_deps.ts';
import { accumulateWeights, toCumulativeValues } from '../toCumulativeValues.ts';

describe('toCumulativeValues()', () => {
  it('returns an array in which each element is the sum of the input array values up to the same index', () => {
    const input = [1, 2, 3, 4, 5];
    const expectedCumulativeWeights = [1, 3, 6, 10, 15];

    const cumulativeWeights = toCumulativeValues(input);

    assertEquals(cumulativeWeights, expectedCumulativeWeights);
  });

  it('if a weight is negative, throws an error', () => {
    const input = [1, -1];
    const throwingFn = () => toCumulativeValues(input);

    assertThrows(
      throwingFn,
      Error,
      'All weights must be non-negative numbers.',
    );
  });

  it('if a weight is undefined, treats it as 0', () => {
    const input = [1, undefined];
    const expectedCumulativeWeights = [1, 1];

    const cumulativeWeights = toCumulativeValues(input);

    assertEquals(cumulativeWeights, expectedCumulativeWeights);
  });

  it('if the input array is empty, returns an empty array', () => {
    const input: number[] = [];
    const expectedCumulativeWeights: number[] = [];

    const cumulativeWeights = toCumulativeValues(input);

    assertEquals(cumulativeWeights, expectedCumulativeWeights);
  });
});

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
});
