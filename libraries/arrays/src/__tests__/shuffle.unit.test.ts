import { assertArrayIncludes, assertEquals, assertNotEquals, describe, it } from '../../dev_deps.ts';
import { shuffle, shuffleInPlace } from '../shuffle.ts';

describe('shuffle', () => {
  it('returns empty array when given empty array', () => {
    assertEquals(shuffle([]), []);
  });

  it('returns same single-item array when given single-item array', () => {
    assertEquals(shuffle([1]), [1]);
  });

  it('returns shuffled array when given multi-item array', () => {
    const array = [1, 2, 3];

    const shuffled = shuffle(array);

    assertNotEquals(shuffled, array);
    assertEquals(shuffled.length, array.length);
    assertArrayIncludes(shuffled, [1]);
    assertArrayIncludes(shuffled, [2]);
    assertArrayIncludes(shuffled, [3]);
  });
});

describe('shuffleInPlace', () => {
  it('does not throw error when given empty array', () => {
    shuffleInPlace([]);
  });

  it('does not modify array when given single-item array', () => {
    const array = [1];
    shuffleInPlace(array);
    assertEquals(array, [1]);
  });

  it('modifies array in place when given multi-item array', () => {
    const array = [1, 2, 3];
    const original = [...array];
    shuffleInPlace(array);
    assertEquals(array.length, original.length);
    assertArrayIncludes(array, [1]);
    assertArrayIncludes(array, [2]);
    assertArrayIncludes(array, [3]);
  });
});
