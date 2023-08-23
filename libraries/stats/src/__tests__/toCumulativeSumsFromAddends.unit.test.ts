import { assertEquals, assertNotStrictEquals, describe, it } from '../../dev_deps.ts';
import { toCumulativeSumsFromAddends } from '../toCumulativeSumsFromAddends.ts';

describe('toCumulativeSumsFromAddends()', () => {
  it('returns an array containing the cumulative sums of the addends', () => {
    const addends = [1, 2, 3, 4.5];
    const expectedSums = [1, 3, 6, 10.5];

    const sums = toCumulativeSumsFromAddends(addends);

    assertEquals(sums, expectedSums);
  });

  it('if given an empty array, returns a new empty array', () => {
    const addends: number[] = [];
    const expectedSums: number[] = [];

    const sums = toCumulativeSumsFromAddends(addends);

    assertEquals(sums, expectedSums);
    assertNotStrictEquals(sums, expectedSums);
  });

  it('if the array has a single element, returns a new array containing the same element', () => {
    const addends = [1];
    const expectedSums = [1];

    const sums = toCumulativeSumsFromAddends(addends);

    assertEquals(sums, expectedSums);
    assertNotStrictEquals(sums, expectedSums);
  });

  it('accepts negative addends and can return negative cumulative sums', () => {
    const addends = [-1, 4, -9, 16.5];
    const expectedSums = [-1, 3, -6, 10.5];

    const sums = toCumulativeSumsFromAddends(addends);

    assertEquals(sums, expectedSums);
  });
});
