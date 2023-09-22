import { assertEquals, describe, it } from '../../dev_deps.ts';

import { isScalar } from '../isScalar.ts';
import { nonscalars, scalars } from './primitives.fixture.ts';

describe('isScalar()', () => {
  describe('nonscalars', () => {
    for (const [label, value] of nonscalars) {
      it(`returns false for ${label}`, () => {
        assertEquals(isScalar(value), false);
      });
    }

    it('returns false for a function', () => {
      const value = () => {};
      assertEquals(isScalar(value), false);
    });
  });

  describe('scalars', () => {
    it('returns true for null', () => {
      assertEquals(
        isScalar(null),
        true,
      );
    });

    for (const [label, value] of scalars) {
      it(`returns true for ${label}`, () => {
        assertEquals(isScalar(value), true);
      });
    }
  });
});
