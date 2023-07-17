//
/**
 * Type-safe version of `Array.prototype.includes`.
 * Returns `true` if `element` is in `array`.
 */
export function includes<T extends readonly unknown[]>(array: T, element: unknown): element is T[number] {
  return array.includes(element);
}
