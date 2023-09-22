/**
 * Returns true if the given value is a non-null nonscalar:
 * - its `typeof` is "object"
 * - but the value is not `null`
 */
export function isNonNullObject(value: unknown): value is object {
  return typeof value === 'object' && value !== null;
}
