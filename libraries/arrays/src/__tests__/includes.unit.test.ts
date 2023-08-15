import { assertEquals, describe, it } from '../../dev_deps.ts';
import { includes } from '../includes.ts';

describe('includes()', () => {
  it('returns true if the array includes the item', () => {
    const arr = [1, 2, 3];

    assertEquals(includes(arr, 2), true);
  });

  it('returns false if the array does not include the item', () => {
    const arr = [1, 2, 3];

    assertEquals(includes(arr, 4), false);
  });

  it('works correctly with readonly arrays', () => {
    const arr = ['a', 'b', 'c'] as const;

    assertEquals(includes(arr, 'b'), true);
    assertEquals(includes(arr, 'd'), false);
  });

  it('works correctly with array of different types', () => {
    const arr = [1, 'a', true, null, undefined] as const;

    assertEquals(includes(arr, 1), true);
    assertEquals(includes(arr, 'a'), true);
    assertEquals(includes(arr, true), true);
    assertEquals(includes(arr, null), true);
    assertEquals(includes(arr, undefined), true);
    assertEquals(includes(arr, 'b'), false);
  });
});
