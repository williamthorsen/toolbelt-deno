import { assertEquals, describe, it } from '../../dev_deps.ts';
import { toCumulativeValues } from '../toCumulativeValues.ts';

describe('toCumulativeValues()', () => {
  it('returns an array in which each element is the sum of the input array values up to the same index', () => {
    const input = [1, 2, 3, 4, 5];
    const expectedValues = [1, 3, 6, 10, 15];

    const actualValues = toCumulativeValues(input);

    assertEquals(actualValues, expectedValues);
  });

  it('handles negative values', () => {
    const input = [1, -1];
    const expectedValues = [1, 0];

    const actualValues = toCumulativeValues(input);

    assertEquals(actualValues, expectedValues);
  });

  it('if a value is undefined, treats it as 0', () => {
    const input = [1, undefined];
    const expectedValues = [1, 1];

    const actualValues = toCumulativeValues(input);

    assertEquals(actualValues, expectedValues);
  });

  it('if the input array is empty, returns an empty array', () => {
    const input: number[] = [];
    const expectedValues: number[] = [];

    const actualValues = toCumulativeValues(input);

    assertEquals(actualValues, expectedValues);
  });
});
