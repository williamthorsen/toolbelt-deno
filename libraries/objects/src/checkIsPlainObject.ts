/**
 * Returns true if the given value is a plain object (i.e., an object created with the `Object`
 * constructor or with the object literal syntax, and not a function, class instance, null, or array).
 */
export function checkIsPlainObject<T extends PlainObject>(value: T | unknown): value is T {
  return value instanceof Object && Object.getPrototypeOf(value) === Object.prototype;
}

/**
 * @deprecated Use `checkIsPlainObject` instead.
 */
export const isPlainObject = checkIsPlainObject;

export type PlainObject = { [key: string]: unknown } & ({ bind?: never } | { call?: never });
