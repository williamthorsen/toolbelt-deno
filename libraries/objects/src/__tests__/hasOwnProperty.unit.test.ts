import { assertEquals, describe, it } from '../../dev_deps.ts';

import { hasOwnProperty } from '../hasOwnProperty.ts';

describe('hasOwnProperty()', () => {
  it('returns true if the object has the property', () => {
    const target = { a: 'a' };

    assertEquals(hasOwnProperty(target, 'a'), true);
  });

  it('if the object does not have the property, returns false', () => {
    const target = { a: 'a' };

    assertEquals(hasOwnProperty(target, 'b'), false);
  });

  it('if the object is an array and the key is an initialized index, returns true', () => {
    const target = ['a', undefined];

    assertEquals(hasOwnProperty(target, '0'), true);
    assertEquals(hasOwnProperty(target, '1'), true);
  });

  it('if the object is an array and the key is an uninitialized index, returns false', () => {
    const target = ['a'];

    assertEquals(hasOwnProperty(target, '1'), false);
  });

  it('accepts a function as target', () => {
    const target = () => {};
    target.a = 'a';

    assertEquals(hasOwnProperty(target, 'a'), true);
  });

  it('accepts an array as target', () => {
    const target: Array<string> & { a?: string } = ['value'];
    target.a = 'a';

    assertEquals(hasOwnProperty(target, 'a'), true);
  });

  it('if the property is inherited, returns false', () => {
    const targetsAndProperties = [
      [Object.create({ a: 'a' }), 'a'],
      ['string', 'toString'],
    ];

    for (const [target, property] of targetsAndProperties) {
      assertEquals(hasOwnProperty(target, property), false);
    }
  });

  for (const value of [null, undefined, 1, true, Symbol('a')]) {
    it(`if the target is ${typeof value}, returns false`, () => {
      assertEquals(hasOwnProperty(value, 'a'), false);
    });
  }

  it('correctly narrows the type', () => {
    interface Target {
      a: string;
    }
    const fn = (value: Target | unknown): void => {
      if (value && hasOwnProperty(value, 'a')) {
        // This code will not compile if the type of `value` is not narrowed to `Target`.
        assertEquals(value.a, 'a');
      }
    };
    for (const value of [{ a: 'a' }, null, undefined, 1, true, Symbol('a')]) {
      fn(value);
    }
  });
});
