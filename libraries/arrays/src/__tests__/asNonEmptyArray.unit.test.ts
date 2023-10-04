import { assertEquals, assertStrictEquals, assertThrows, describe, it } from '../../dev_deps.ts';

import { asNonEmptyArray, assertNonEmptyArray } from '../asNonEmptyArray.ts';

describe('asNonEmptyArray()', () => {
  it('if the array is non-empty and immutable, returns it', () => {
    const items = Object.freeze(['item']);

    const result = asNonEmptyArray(items);

    assertStrictEquals(result, items);
  });

  it('if the array is non-empty and mutable, returns an immutable copy', () => {
    const items = ['item'];

    const result = asNonEmptyArray(items);

    assertEquals([...result], items);
    assertEquals(Object.isFrozen(result), true);
  });

  it('if the array is empty, throws an error', () => {
    const throwingFn = () => asNonEmptyArray([]);

    assertThrows(throwingFn, Error, 'Invalid input. Array cannot be empty.');
  });

  it('accepts a tuple', () => {
    const items = ['item'] as const;

    const result = asNonEmptyArray(items);

    assertEquals(result, items);
  });

  it('accepts a read-only array', () => {
    const items: readonly string[] = ['item'];

    const result = asNonEmptyArray(items);

    assertEquals(result, items);
  });
});

describe('assertNonEmptyArray()', () => {
  it('if array is immutable and non-empty, does nothing', () => {
    const items = Object.freeze(['item']);
    assertNonEmptyArray(items);
  });

  it('if array is immutable and empty, throws an error', () => {
    const items = Object.freeze([]);

    const throwingFn = () => assertNonEmptyArray(items);

    assertThrows(throwingFn, Error, 'Invalid input. Array cannot be empty.');
  });
});
