import { itTodo } from '../../../testing/itTodo.ts';
import { assertArrayIncludes, assertEquals, describe, it } from '../../dev_deps.ts';
import { pickRandomItems } from '../pickRandomItems.ts';

// Seed for use in deterministic tests.
const SEED = 1;

describe('pickRandomItems', () => {
  const array = [1, 2, 3];

  it('returns empty array when n is 0', () => {
    assertEquals(pickRandomItems(array, 0), []);
  });

  it('returns array with n items when given multi-item array', () => {
    const picked = pickRandomItems(array, 2);
    assertEquals(picked.length, 2);
    assertArrayIncludes(array, picked);
  });

  it('if n is greater than array length, returns all items', () => {
    const picked = pickRandomItems(array, 4);
    assertEquals(picked.length, 3);
  });

  it('given a seed, deterministically picks items', () => {
    const picked1 = pickRandomItems(array, 2, { seed: SEED });
    const picked2 = pickRandomItems(array, 2, { seed: SEED });

    assertEquals(picked1, picked2);
  });

  it('given an offset, skips that number of items', () => {
    const offset = 1;
    const picked = pickRandomItems(array, 2, { seed: SEED });

    const pickedWithOffset = pickRandomItems(array, 2, { offset: 1, seed: SEED });

    assertEquals(pickedWithOffset, picked.slice(offset));
  });

  it('given an offset exceeds the length of the array, returns an empty array', () => {
    const offset = 5;

    const pickedWithOffset = pickRandomItems(array, 2, { offset });

    assertEquals(pickedWithOffset, []);
  });

  itTodo('optionally throws error when n is greater than array length');
});
