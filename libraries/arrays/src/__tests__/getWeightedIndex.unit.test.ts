import { assertEquals, describe, it } from '../../dev_deps.ts';
import { getWeightedIndex } from '../getWeightedIndex.ts';

describe('getWeightedIndex()', () => {
  it('returns the correct index based on target weight', () => {
    const cumulativeWeights = [1, 3, 6, 10, 15];
    const targetWeight = 7;
    const expectedIndex = 3;

    const index = getWeightedIndex(cumulativeWeights, targetWeight);

    assertEquals(index, expectedIndex);
  });

  it('if the target weight is 0, returns the first index', () => {
    const cumulativeWeights = [1, 3, 6, 10, 15];
    const targetWeight = 0;
    const expectedIndex = 0;

    const index = getWeightedIndex(cumulativeWeights, targetWeight);

    assertEquals(index, expectedIndex);
  });

  it('if the target weight is negative, returns undefined', () => {
    const cumulativeWeights = [1, 3, 6, 10, 15];
    const targetWeight = -1;
    const expectedIndex = undefined;

    const index = getWeightedIndex(cumulativeWeights, targetWeight);

    assertEquals(index, expectedIndex);
  });

  it('if the input array is empty, returns undefined', () => {
    const cumulativeWeights: number[] = [];
    const targetWeight = 5;
    const expectedIndex = undefined;

    const index = getWeightedIndex(cumulativeWeights, targetWeight);

    assertEquals(index, expectedIndex);
  });

  it('if the target weight is greater than the highest cumulative weight, returns undefined', () => {
    const cumulativeWeights = [1, 3, 6, 10, 15];
    const targetWeight = 20;
    const expectedIndex = undefined;

    const index = getWeightedIndex(cumulativeWeights, targetWeight);

    assertEquals(index, expectedIndex);
  });

  it('if the target weight is equal only to the highest cumulative weight, returns the highest index', () => {
    const cumulativeWeights = [1, 3, 6, 10, 15];
    const targetWeight = 15;
    const expectedIndex = 4;

    const index = getWeightedIndex(cumulativeWeights, targetWeight);

    assertEquals(index, expectedIndex);
  });
});
