import { assertEquals, describe, it } from '../../dev_deps.ts';
import { getSetItems } from '../getSetItems.ts';

describe('getSetItems(iterable)', () => {
  it('should remove duplicate items from an array', () => {
    const array = [1, 2, 3, 3, 2, 1];

    const setItems = getSetItems(array);

    const expected = [1, 2, 3];
    assertEquals(setItems, expected);
  });

  it('given an empty array, should return an empty array', () => {
    const array: number[] = [];

    const setItems = getSetItems(array);

    const expected: number[] = [];
    assertEquals(setItems, expected);
  });

  it('given an array without duplicates, should return the same array', () => {
    const array = [1, 2, 3];

    const setItems = getSetItems(array);

    const expected = [1, 2, 3];
    assertEquals(setItems, expected);
  });

  it('can handle items of mixed types', () => {
    const array = [1, 'a', false, null, undefined, true];

    const setItems = getSetItems(array);

    const expected = [1, 'a', false, null, undefined, true];
    assertEquals(setItems, expected);
  });

  it('can handle iterables other than arrays', () => {
    const toGenerateInt = function* () {
      yield 1;
      yield 1;
      yield 2;
      yield 1;
    };

    const setItems = getSetItems(toGenerateInt());

    const expected = [1, 2];
    assertEquals(setItems, expected);
  });
});
