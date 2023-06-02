import { itTodo } from '../../../testing/itTodo.ts';
import { assertArrayIncludes, assertEquals, describe, it } from '../../dev_deps.ts';
import { pickRandomItems } from '../pickRandomItems.ts';

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

  itTodo('optionally throws error when n is greater than array length');
});
