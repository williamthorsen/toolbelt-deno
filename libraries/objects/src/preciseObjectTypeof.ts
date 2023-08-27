import { checkIsPlainObject } from './checkIsPlainObject.ts';

/**
 * Returns `typeof value`, except that the "object" type is replaced by more precise types:
 * - "array" for arrays
 * - "null" for null
 * - "plainobject" for plain objects
 * - "instance" for all other objects
 */
export function preciseObjectTypeof(value: unknown): string {
  if (typeof value !== 'object') {
    return typeof value;
  }

  if (Array.isArray(value)) {
    return 'array';
  }

  if (value === null) {
    return 'null';
  }

  if (checkIsPlainObject(value)) {
    return 'plainobject';
  }

  return 'instance';
}
