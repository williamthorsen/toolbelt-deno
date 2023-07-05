import { isPlainObject, type PlainObject } from './isPlainObject.ts';
import type { CompareKeys } from './objects.types.ts';

/**
 * Returns a new object whose keys are sorted alphabetically or by a custom comparator function.
 */
export function sortKeys<T extends PlainObject>(
  data: T,
  compare: CompareKeys = (keyA, keyB) => keyA < keyB ? -1 : 1,
): T {
  if (!isPlainObject(data)) {
    return data;
  }

  const sortedEntries = Object.entries(data)
    .sort(([keyA], [keyB]) => compare(keyA, keyB))
    .map(([key, value]) => [key, value]);

  return Object.fromEntries(sortedEntries);
}
