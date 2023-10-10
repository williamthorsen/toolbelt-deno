import { assertEquals, assertNotEquals, describe, it } from '../../dev_deps.ts';

import { IntegerSeed } from '../IntegerSeed.ts';

describe('IntegerSeed class', () => {
  describe('static toInt()', () => {
    it('given an integer within range, returns it', () => {
      const input = 1234;
      const expected = input;

      const actual = IntegerSeed.toInt(input);

      assertEquals(actual, expected);
    });

    it('given an integer out of range, returns the number modulo IntegerSeed.max', () => {
      const input = IntegerSeed.max + 1;
      const expected = 1;

      const actual = IntegerSeed.toInt(input);

      assertEquals(actual, expected);
    });

    it('converts a fractional number to an integer', () => {
      const input = 0.1234;

      const output = IntegerSeed.toInt(input);

      assertEquals(Number.isInteger(output), true);
    });

    it('given an input of 0, returns the max integer', () => {
      const input = 0;

      const output = IntegerSeed.toInt(input);

      assertEquals(output, IntegerSeed.max);
      assertNotEquals(output, 0);
    });
  });
});
