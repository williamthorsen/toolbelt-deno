import { assertEquals, assertNotStrictEquals, describe, it } from '../../dev_deps.ts';
import { omitNullish } from '../omitNullish.ts';

describe('omitNullish()', () => {
  it('removes properties with null or undefined values', () => {
    const obj = { a: 1, b: undefined, c: null, d: 3 };
    const expected = { a: 1, d: 3 };

    const actual = omitNullish(obj);

    assertEquals(actual, expected);
  });

  it('returns an empty object when all properties are null or undefined', () => {
    const obj = { a: undefined, b: null };
    const expected = {};

    const actual = omitNullish(obj);

    assertEquals(actual, expected);
  });

  it('returns an identical object when no properties are null or undefined', () => {
    const obj = { a: 1, b: 2, c: 3 };
    const expected = { a: 1, b: 2, c: 3 };

    const actual = omitNullish(obj);

    assertEquals(actual, expected);
  });

  it('returns an identical object for an empty input object', () => {
    const obj = {};
    const expected = {};

    const actual = omitNullish(obj);

    assertNotStrictEquals(actual, obj);
    assertEquals(actual, expected);
  });

  it('given a class instance, returns an object literal containing its non-nullish properties', () => {
    class MyClass {
      a = 1;
      b = undefined;
      c = null;
      fn(): void {}
    }
    const instance = new MyClass();
    const expected = { a: 1 };

    const actual = omitNullish(instance);

    assertEquals(actual, expected);
  });
});
