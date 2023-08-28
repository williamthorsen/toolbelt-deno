import { assertEquals, describe, it } from '../../dev_deps.ts';

import { hasOwnProperty } from '../hasOwnProperty.ts';

describe('hasOwnProperty()', () => {
  // Functions to test that an inferred type is correct.
  const numberFn = (_value: number): void => {};
  const stringFn = (_value: string): void => {};

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

  it('accepts any non-object value as input', () => {
    for (const value of [null, undefined, 1, true, Symbol('a')]) {
      hasOwnProperty(value, 'key');
    }
  });

  it('correctly narrows the type', () => {
    const nDict = { n: 1 };
    const sDict = { s: 's' };
    const fn = (value: { n: number } | { s: string }): void => {
      // These lines will not compile unless the type is correctly narrowed.
      hasOwnProperty(value, 'n') && numberFn(value.n);
      hasOwnProperty(value, 's') && stringFn(value.s);
    };
    fn(nDict);
    fn(sDict);
  });

  it('can infer type when the key type is a superset of the object keys', () => {
    type Key = 'a' | 'b' | 'c';

    const dict: Record<'a' | 'b', string> = { a: 'a', b: 'b' }; // keys are only a subset of `Key`

    function getValueOrEmpty(key: Key): string {
      return hasOwnProperty(dict, key) ? dict[key] : '';
    }
    getValueOrEmpty('a');
  });
});
