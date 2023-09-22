import { assertEquals, describe, it } from '../../dev_deps.ts';

import { nonscalars, scalars } from './primitives.fixture.ts';
import { isNonNullObject } from '../isNonNullObject.ts';

describe('isNonNullObject()', () => {
  describe('nonscalars', () => {
    for (const [label, value] of nonscalars) {
      it(`returns true for ${label}`, () => {
        assertEquals(isNonNullObject(value), true);
      });
    }

    it(`returns false for a function`, () => {
      const value = () => {};
      assertEquals(isNonNullObject(value), false);
    });
  });

  describe('scalars', () => {
    it(`returns false for null`, () => {
      assertEquals(
        isNonNullObject(null),
        false,
      );
    });

    for (const [label, value] of scalars) {
      it(`returns false for ${label}`, () => {
        assertEquals(isNonNullObject(value), false);
      });
    }
  });
});
