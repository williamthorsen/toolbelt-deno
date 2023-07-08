import { assertEquals, assertNotStrictEquals, describe, it } from '../../dev_deps.ts';
import { omitUndefined } from '../omitUndefined.ts';

describe('omitUndefined()', () => {
  it('removes properties with undefined values', () => {
    const obj = { a: 1, b: undefined, c: 3 };
    const expected = { a: 1, c: 3 };

    const actual = omitUndefined(obj);

    assertEquals(actual, expected);
  });

  it('does not modify properties with null values', () => {
    const obj = { a: 1, b: null, c: 3 };
    const expected = { a: 1, b: null, c: 3 };

    const actual = omitUndefined(obj);

    assertEquals(actual, expected);
  });

  it('returns an empty object when all properties are undefined', () => {
    const obj = { a: undefined, b: undefined };
    const expected = {};

    const actual = omitUndefined(obj);

    assertEquals(actual, expected);
  });

  it('returns an identical object when no properties are undefined', () => {
    const obj = { a: 1, b: 2, c: 3 };
    const expected = { a: 1, b: 2, c: 3 };

    const actual = omitUndefined(obj);

    assertEquals(actual, expected);
  });

  it('returns an identical object for an empty input object', () => {
    const obj = {};
    const expected = {};

    const actual = omitUndefined(obj);

    assertNotStrictEquals(actual, obj);
    assertEquals(actual, expected);
  });

  it('given a class instance, returns an object literal containing its defined properties', () => {
    class MyClass {
      a = 1;
      b = undefined;
      fn(): void {}
    }
    const instance = new MyClass();
    const expected = { a: 1 };

    const actual = omitUndefined(instance);

    assertEquals(actual, expected);
  });
});
