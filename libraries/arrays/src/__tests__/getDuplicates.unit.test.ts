import { assertEquals, describe, it } from '../../dev_deps.ts';
import { getDuplicates } from '../getDuplicates.ts';

describe('getDuplicates(array)', () => {
  it('should return an array containing one of each duplicate value', () => {
    const array = [1, 1, 2, 1];

    const duplicates = getDuplicates(array);

    const expected = [1];
    assertEquals(duplicates, expected);
  });

  it('given an array without duplicates, should return an empty array', () => {
    const array = [1, 2, 3];

    const duplicates = getDuplicates(array);

    const expected: number[] = [];
    assertEquals(duplicates, expected);
  });

  it('given an empty array, should return an empty array', () => {
    const array = [] as const;

    const duplicates = getDuplicates(array);

    const expected: number[] = [];
    assertEquals(duplicates, expected);
  });

  it('can handle items of mixed types', () => {
    const array = [1, 'a', false, null, undefined, null];

    const duplicates = getDuplicates(array);

    const expected = [null];
    assertEquals(duplicates, expected);
  });

  it('can handle iterables other than arrays', () => {
    const toGenerateInt = function* () {
      yield 1;
      yield 1;
      yield 2;
      yield 1;
    };

    const duplicates = getDuplicates(toGenerateInt());

    const expected = [1];
    assertEquals(duplicates, expected);
  });
});
