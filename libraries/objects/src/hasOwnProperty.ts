/**
 * Type-safe replacement for `Object.prototype.hasOwnProperty.call(target, property)`
 */
export function hasOwnProperty<T extends object, P extends PropertyKey>(
  target: T,
  property: P,
): target is T extends T & Record<P, infer V> ? T & Record<P, V> : never {
  return Object.prototype.hasOwnProperty.call(target, property);
}

/**
 * Same function, but doesn't trigger a type error
 */
/*
export function hasOwnProperty<T, P extends PropertyKey>(
  target: T,
  property: P
): target is T extends T & Record<P, infer V> ? T & Record<P, V> : never {
  if (typeof target !== 'object' || target === null) {
    return false;
  }
  return Object.prototype.hasOwnProperty.call(target, property);
}
 */
