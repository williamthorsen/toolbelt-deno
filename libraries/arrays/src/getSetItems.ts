/**
 * Returns an array of the items in the set of values in the iterable.
 */
export function getSetItems<T>(iterable: Iterable<T>): T[] {
  return Array.from(new Set(iterable));
}
