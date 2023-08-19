import { assertArrayIncludes, assertEquals, assertThrows, describe, it } from '../../dev_deps.ts';
import { pickItem } from '../pickItem.ts';

describe('pickItem()', () => {
  it('returns one item', () => {
    const sourceArray = [1, 2, 3, 4];

    const randomItem = pickItem(sourceArray);

    assertArrayIncludes(sourceArray, [randomItem]);
  });

  it('if the array has a single item, returns the item', () => {
    assertEquals(pickItem([1]), 1);
  });

  it('accepts a read-only array', () => {
    const sourceArray = Object.freeze([1, 2, 3, 4]);
    pickItem(sourceArray);
  });

  it('if the array is empty, throws an error', () => {
    const throwingFn = () => pickItem([]);
    assertThrows(
      throwingFn,
      Error,
      'Cannot pick an item from an empty array.',
    );
  });
});
