import { assertEquals, describe, it } from '../../dev_deps.ts';
import { get } from '../get.ts';

describe('get()', () => {
  it('retrieves the value for the given key from the object', () => {
    const key = 'a';
    const obj = { a: 'apple', b: 'banana' };
    const getKey = get(key);

    const expected = 'apple';
    const actual = getKey(obj);

    assertEquals(actual, expected);
  });

  it('returns undefined for a nonexistent key', () => {
    const key = 'b';
    const obj: { a: string; b?: string } = { a: 'apple' };
    const expected = undefined;

    const actual = get(key)(obj);

    assertEquals(actual, expected);
  });

  it('handles nested objects', () => {
    const key = 'inner';
    const obj = { outer: 'egg', inner: { a: 'apple', b: 'banana' } };
    const expected = { a: 'apple', b: 'banana' };

    const actual = get(key)(obj);

    assertEquals(actual, expected);
  });
});
