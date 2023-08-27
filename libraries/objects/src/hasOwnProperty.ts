/**
 * Type-safe replacement for `Object.prototype.hasOwnProperty.call(target, property)`
 */
export function hasOwnProperty<T, P extends PropertyKey>(
  target: T,
  property: P,
): target is T & Record<P, unknown> {
  if (target === null) {
    return false;
  }

  if (!['object', 'function'].includes(typeof target)) {
    return false;
  }

  return Object.prototype.hasOwnProperty.call(target, property);
}
