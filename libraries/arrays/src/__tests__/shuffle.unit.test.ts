import { assert, assertArrayIncludes, assertEquals, describe, it } from '../../dev_deps.ts';
import { SeededRng } from '../../sibling_deps.ts';
import { shuffle, shuffleInPlace } from '../shuffle.ts';

describe('shuffle', () => {
  it('if given an empty array, returns an equivalent empty array', () => {
    const original: number[] = [];
    const shuffled = shuffle(original);

    assert(shuffled !== original);
    assertEquals(shuffle([]), []);
  });

  it('if given a single-item array, returns an equivalent single-item array', () => {
    assertEquals(shuffle([1]), [1]);
  });

  it('if given a multi-item array, returns a new array with the same contents', () => {
    const original = [1, 2, 3];

    const shuffled = shuffle(original);

    assert(shuffled !== original);
    assertEquals(shuffled.length, original.length);
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

  it('given a seed, deterministically shuffles the array', () => {
    const original = [1, 2, 3];
    const duplicate = [...original];

    shuffleInPlace(original, { seed: 1234 });
    shuffleInPlace(duplicate, { seed: 1234 });

    assertEquals(original, duplicate);
  });

  it('given a SeededRng instance with a given seed, deterministically shuffles the ray', () => {
    const seedFn1 = new SeededRng(1234.5).rng;
    const seedFn2 = new SeededRng(1234.5).rng;
    const original = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const duplicate = [...original];

    shuffleInPlace(original, { seed: seedFn1 });
    shuffleInPlace(duplicate, { seed: seedFn2 });

    // console.log({ original, duplicate });

    assertEquals(original, duplicate);
  });
});
