import { assertEquals, assertNotStrictEquals, describe, it } from '../../dev_deps.ts';
import { toAddendsFromCumulativeSums } from '../toAddendsFromCumulativeSums.ts';

describe('toAddendsFromCumulativeSums()', () => {
  it('returns an array containing the sums that progressively add up to the cumulative weights', () => {
    const cumulativeSums = [1, 3, 6, 10.5];
    const expectedAddends = [1, 2, 3, 4.5];

    const addends = toAddendsFromCumulativeSums(cumulativeSums);

    assertEquals(addends, expectedAddends);
  });

  it('if given an empty array, returns a new empty array', () => {
    const cumulativeSums: number[] = [];
    const expectedAddends: number[] = [];

    const addends = toAddendsFromCumulativeSums(cumulativeSums);

    assertEquals(addends, expectedAddends);
    assertNotStrictEquals(addends, expectedAddends);
  });

  it('if the array has a single element, returns a new array containing the same element', () => {
    const cumulativeSums = [1];
    const expectedAddends = [1];

    const addends = toAddendsFromCumulativeSums(cumulativeSums);

    assertEquals(addends, expectedAddends);
    assertNotStrictEquals(addends, expectedAddends);
  });

  it('accepts negative cumulative sums and can return negative addends', () => {
    const cumulativeSums = [-1, 3, -6, 10.5];
    const expectedAddends = [-1, 4, -9, 16.5];

    const addends = toAddendsFromCumulativeSums(cumulativeSums);

    assertEquals(addends, expectedAddends);
  });
});
