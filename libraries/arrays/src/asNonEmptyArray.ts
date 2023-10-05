import type { AnyArray, NonEmptyArray } from './arrays.types.ts';

/**
 * Returns an immutable version of the array if the array is non-empty; otherwise, throws an error.
 */
export function asNonEmptyArray<TItem>(items: AnyArray<TItem>): Readonly<NonEmptyArray<TItem>> {
  // Make a new copy only if the array is mutable.
  const frozenItems: readonly TItem[] = Object.isFrozen(items) ? items : Object.freeze([...items]);

  // Narrow the type and return
  assertNonEmptyArray(frozenItems);
  return frozenItems;
}

/**
 * Narrows the array's type to `NonEmptyArray` or throws an error.
 * @params array An immutable array.
 */
export function assertNonEmptyArray<TItem>(
  array: ReadonlyArray<TItem> & { push?: never },
): asserts array is Readonly<NonEmptyArray<TItem>> {
  if (array.length === 0) throw new Error('Invalid input. Array cannot be empty.');
}
