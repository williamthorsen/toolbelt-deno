import { itTodo } from '../../../testing/itTodo.ts';
import { assertArrayIncludes, assertEquals, describe, it } from '../../dev_deps.ts';
import { pickRandomItems } from '../pickRandomItems.ts';

// Seed for use in deterministic tests.
const SEED = 1;

describe('pickRandomItems', () => {
  const array = [1, 2, 3, 4];

  it('returns empty array when n is 0', () => {
    assertEquals(pickRandomItems(array, 0), []);
  });

  it('returns array with n items when given multi-item array', () => {
    const picked = pickRandomItems(array, 2);
    assertEquals(picked.length, 2);
    assertArrayIncludes(array, picked);
  });

  it('if n is greater than array length, returns all items', () => {
    const picked = pickRandomItems(array, 5);
    assertEquals(picked.length, array.length);
  });

  it('given a seed, deterministically picks items', () => {
    const picked1 = pickRandomItems(array, 2, { seed: SEED });
    const picked2 = pickRandomItems(array, 2, { seed: SEED });

    assertEquals(picked1, picked2);
  });

  it('given an offset, skips that number of items', () => {
    const offset = 2;

    // Get the first 4 items.
    const picked = pickRandomItems(array, 4, { seed: SEED });

    // Skip the first 2 items and get the next 4.
    const pickedWithOffset = pickRandomItems(array, 4, { offset, seed: SEED });

    // The nth items of the offset array should line up with the (n + offset)th items of the un-offset array.
    // Starting: [1, 2, 3, 4]
    // Picked:   [_, _, 3, 4, ?, ?]
    //                  ^- ^- overlap
    assertEquals(pickedWithOffset.slice(0, offset), picked.slice(-offset));
  });

  it('given an offset that makes n exceed the length of the array, returns the remaining items', () => {
    const offset = 2;

    const pickedWithOffset = pickRandomItems(array, array.length, { offset });

    assertEquals(pickedWithOffset.length, array.length - offset);
  });

  it('given an offset that exceeds the length of the array, returns an empty array', () => {
    const offset = 5;

    const pickedWithOffset = pickRandomItems(array, 2, { offset });

    assertEquals(pickedWithOffset, []);
  });

  itTodo('optionally throws error when n is greater than array length');
});
