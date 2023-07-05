/**
 * Returns true if the given value is a plain object (i.e., an object created with the `Object`
 * constructor or with the object literal syntax, and not a function, class instance, null, or array).
 */
export function isPlainObject(value: PlainObject | unknown): value is PlainObject {
  return value instanceof Object && Object.getPrototypeOf(value) === Object.prototype;
}

export type PlainObject = { [key: string]: unknown } & ({ bind?: never } | { call?: never });
