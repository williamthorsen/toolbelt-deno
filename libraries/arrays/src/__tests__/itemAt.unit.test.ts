import { assertEquals, describe, it } from '../../dev_deps.ts';

import { itemAt } from '../itemAt.ts';

describe('itemAt()', () => {
  it('returns the correct item at the specified index', () => {
    const arr = ['a', 'b', 'c', 'd'];
    const index = 2;
    const expectedItem = 'c';

    const item = itemAt(arr, index);

    assertEquals(item, expectedItem);
  });

  it('throws a RangeError if the index is negative', () => {
    const arr = ['a', 'b', 'c', 'd'];
    const index = -1;

    let error;
    try {
      itemAt(arr, index);
    } catch (e) {
      error = e;
    }

    assertEquals(error instanceof RangeError, true);
    assertEquals(error.message, 'Index -1 is out of bounds.');
  });

  it('throws a RangeError if the index is greater than or equal to the array length', () => {
    const arr = ['a', 'b', 'c', 'd'];
    const index = 4;

    let error;
    try {
      itemAt(arr, index);
    } catch (e) {
      error = e;
    }

    assertEquals(error instanceof RangeError, true);
    assertEquals(error.message, 'Index 4 is out of bounds.');
  });

  it('returns the correct item for the first index in the array', () => {
    const arr = ['a', 'b', 'c', 'd'];
    const index = 0;
    const expectedItem = 'a';

    const item = itemAt(arr, index);

    assertEquals(item, expectedItem);
  });

  it('returns the correct item for the last index in the array', () => {
    const arr = ['a', 'b', 'c', 'd'];
    const index = 3;
    const expectedItem = 'd';

    const item = itemAt(arr, index);

    assertEquals(item, expectedItem);
  });
});
