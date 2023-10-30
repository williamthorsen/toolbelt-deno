import { itTodo } from '../../../testing/itTodo.ts';
import { assertArrayIncludes, assertEquals, describe, it } from '../../dev_deps.ts';
import { pickItems } from '../pickItems.ts';

// Seed for use in deterministic tests.
const SEED = 1;

describe('pickItems', () => {
  const array = [1, 2, 3, 4];

  it('returns empty array when n is 0', () => {
    assertEquals(pickItems(array, 0), []);
  });

  it('returns array with n items when given multi-item array', () => {
    const picked = pickItems(array, 2);
    assertEquals(picked.length, 2);
    assertArrayIncludes(array, picked);
  });

  it('if n is greater than array length, returns all items', () => {
    const picked = pickItems(array, 5);
    assertEquals(picked.length, array.length);
  });

  it('given a seed, deterministically picks items', () => {
    const items = Array.from({ length: 100 }, (_, i) => i);
    // This snapshot is intended to confirm that, despite any code changes, seeds produce consistent results.
    const snapshot = [
      [58, 75, 60],
      [38, 69, 19],
      [87, 50, 60],
    ];

    const pickedItems = [
      pickItems(items, 3, { seed: SEED + 1 }),
      pickItems(items, 3, { seed: SEED + 2 }),
      pickItems(items, 3, { seed: SEED + 3 }),
    ];

    assertEquals(pickedItems, snapshot);
  });

  it('given an offset, skips that number of items', () => {
    const offset = 2;

    // Get the first 4 items.
    const picked = pickItems(array, 4, { seed: SEED });

    // Skip the first 2 items and get the next 4.
    const pickedWithOffset = pickItems(array, 4, { offset, seed: SEED });

    // The nth items of the offset array should line up with the (n + offset)th items of the un-offset array.
    // Starting: [1, 2, 3, 4]
    // Picked:   [_, _, 3, 4, ?, ?]
    //                  ^- ^- overlap
    assertEquals(pickedWithOffset.slice(0, offset), picked.slice(-offset));
  });

  it('given an offset that makes n exceed the length of the array, returns the remaining items', () => {
    const offset = 2;

    const pickedWithOffset = pickItems(array, array.length, { offset });

    assertEquals(pickedWithOffset.length, array.length - offset);
  });

  it('given an offset that exceeds the length of the array, returns an empty array', () => {
    const offset = 5;

    const pickedWithOffset = pickItems(array, 2, { offset });

    assertEquals(pickedWithOffset, []);
  });

  itTodo('optionally throws error when n is greater than array length');
});
