import { checkIsPlainObject } from './checkIsPlainObject.ts';
import type { CompareKeys } from './objects.types.ts';

/**
 * Recursively sorts the keys in all objects in the given data structure.
 * If the input is an object, returns a new object whose keys are the sorted keys of the input object and whose
 * values are the results of calling this function on the input object's values.
 * If the input is an array, returns a new array whose elements are the results of calling this function on the
 * input array's elements.
 * Otherwise, returns the input.
 *
 * The use case for this function is to allow comparison of serialized data structures that are expected to be
 * equivalent but whose keys may be in a different order.
 */
export function sortObjectKeys<T>(
  data: T,
  compare: CompareKeys = (keyA, keyB) => keyA < keyB ? -1 : 1,
): T {
  if (typeof data === 'object' && data !== null) {
    if (Array.isArray(data)) {
      return data.map((item) => sortObjectKeys(item, compare)) as T;
    }
    if (checkIsPlainObject(data)) {
      const sortedEntries = Object.entries(data)
        .sort(([keyA], [keyB]) => compare(keyA, keyB))
        .map(([key, value]) => {
          return [key, sortObjectKeys(value, compare)];
        });

      return Object.fromEntries(sortedEntries);
    }
  }

  return data;
}
