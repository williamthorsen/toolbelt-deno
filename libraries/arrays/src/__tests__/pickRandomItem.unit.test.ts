import { assertArrayIncludes, assertEquals, assertThrows, describe, it } from '../../dev_deps.ts';
import { pickRandomItem } from '../pickRandomItem.ts';

describe('pickRandomItem()', () => {
  it('returns one item', () => {
    const sourceArray = [1, 2, 3, 4];

    const randomItem = pickRandomItem(sourceArray);

    assertArrayIncludes(sourceArray, [randomItem]);
  });

  it('if the array has a single item, returns the item', () => {
    assertEquals(pickRandomItem([1]), 1);
  });

  it('if the array is empty, throws an error', () => {
    const throwingFn = () => pickRandomItem([]);
    assertThrows(
      throwingFn,
      Error,
      'Cannot pick an item from an empty array',
    );
  });
});
