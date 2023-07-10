/**
 * Type-safe replacement for `Object.prototype.hasOwnProperty.call(target, property)`
 */
export function hasOwnProperty<T extends object, P extends PropertyKey>(
  target: T,
  property: P,
): target is T extends T & Record<P, infer V> ? T & Record<P, V> : never {
  return Object.prototype.hasOwnProperty.call(target, property);
}
