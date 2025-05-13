/**
 * Returns true if the value is a non-null object.
 */
export function isObject(value: unknown): value is Record<PropertyKey, unknown> {
  return typeof value === 'object' && value !== null;
}
