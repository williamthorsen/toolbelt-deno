import { assertArrayIncludes, assertEquals, assertThrows, describe, it } from '../../dev_deps.ts';
import { pickItem } from '../pickItem.ts';

describe('pickItem()', () => {
  const sourceArray = [1, 2, 3, 4];

  it('returns one item', () => {
    const randomItem = pickItem(sourceArray);

    assertArrayIncludes(sourceArray, [randomItem]);
  });

  it('if the array has a single item, returns the item', () => {
    assertEquals(pickItem([1]), 1);
  });

  it('accepts a read-only array', () => {
    const frozenArray = Object.freeze([1, 2, 3, 4]);
    pickItem(frozenArray);
  });

  it('if the array is empty, throws an error', () => {
    const throwingFn = () => pickItem([]);
    assertThrows(
      throwingFn,
      Error,
      'Cannot pick an item from an empty array.',
    );
  });

  it('given the same seed, returns the same item', () => {
    const seed = 1234;

    const randomItem1 = pickItem(sourceArray, { seed });
    const randomItem2 = pickItem(sourceArray, { seed });

    assertEquals(randomItem1, randomItem2);
  });

  it('accepts a function as a seed', () => {
    const seed = 1234;
    const seedFn = () => seed;

    const randomItem1 = pickItem(sourceArray, { seed });
    const randomItem2 = pickItem(sourceArray, { seed: seedFn });

    assertEquals(randomItem1, randomItem2);
  });
});
