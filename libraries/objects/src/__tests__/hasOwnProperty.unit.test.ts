import { assertEquals, assertThrows, describe, it } from '../../dev_deps.ts';

import { hasOwnProperty } from '../hasOwnProperty.ts';

describe('hasOwnProperty()', () => {
  it('returns true if the object has the property', () => {
    const target = { a: 'a' };

    assertEquals(hasOwnProperty(target, 'a'), true);
  });

  it('if the object does not have the proprety, returns false', () => {
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

  it('if the property is inherited, returns false', () => {
    const targetsAndProperties = [
      [Object.create({ a: 'a' }), 'a'],
      ['string', 'toString'],
    ];

    for (const [target, property] of targetsAndProperties) {
      assertEquals(hasOwnProperty(target, property), false);
    }
  });

  it('if the target is null or undefined, throws a TypeError', () => {
    const targets = [null, undefined];

    for (const target of targets) {
      assertThrows(
        // deno-lint-ignore no-explicit-any
        () => hasOwnProperty(target as any, 'a'),
        TypeError,
      );
    }
  });
});
