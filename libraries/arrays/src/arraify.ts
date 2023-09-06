/**
 * If the value is already an array, returns that array; otherwise, returns the value in an array.
 *
 * @template T - The type of the value or values.
 * @param {T | T[]} value - The value to be returned or wrapped in an array.
 * @returns {T[]} The value wrapped in an array or the original array.
 *
 * @example
 * arraify(5);        // [5]
 * arraify([1, 2, 3]); // [1, 2, 3]
 */
export function arraify<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value];
}
