/**
 * Returns an immutable version of the array if the array is non-empty; otherwise, throws an error.
 */
export function asNonEmptyArray<TItem>(items: Readonly<TItem[]>): Immutable<NonEmptyArray<TItem>> {
  // Make a new copy only if the array is mutable.
  const frozenItems = Object.isFrozen(items) ? items : Object.freeze([...items]);

  // Narrow the type and return
  assertNonEmptyArray(frozenItems);
  return frozenItems;
}

/**
 * Narrows the type of the array to a mutable non-empty array or throws an error.
 */
export function assertNonEmptyArray<TArray extends ReadonlyArray<unknown>>(
  items: Immutable<TArray>,
): asserts items is Immutable<NonEmptyArray<TArray[0]>> {
  if (items.length === 0) throw new Error('Invalid input. Array cannot be empty.');
}

type Immutable<TArray extends ReadonlyArray<unknown>> = TArray extends unknown[] ? never : Readonly<TArray>;

type NonEmptyArray<TItem> = [TItem, ...TItem[]];
