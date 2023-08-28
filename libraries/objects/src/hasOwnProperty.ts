/**
 * Type-safe replacement for `Object.prototype.hasOwnProperty.call(target, property)`
 */
export function hasOwnProperty<T, K extends PropertyKey>(
  target: T,
  key: K,
): target is T & Record<K, K extends keyof T ? T[K] : never> {
  if (target === null) {
    return false;
  }

  if (!['object', 'function'].includes(typeof target)) {
    return false;
  }

  return Object.prototype.hasOwnProperty.call(target, key);
}
