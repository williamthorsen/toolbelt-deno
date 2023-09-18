import { assertEquals, describe, it } from '../../dev_deps.ts';

import { withSeed } from '../withSeed.ts';
import { pickInteger } from '../pickInteger.ts';
import { Seed } from '../numbers.types.ts';

describe('withSeed()', () => {
  // Returns a random letter of the alphabet.
  function getLetter(options?: { seed?: Seed }): string {
    const letterIndex = pickInteger({ min: 0, max: 25, seed: options?.seed });

    return String.fromCharCode(97 + letterIndex);
  }

  it('returns a function that successively produces the same outputs when given the same seed', () => {
    const seed = 1234;
    const fn1 = withSeed(getLetter, seed);
    const fn2 = withSeed(getLetter, seed);

    const letters1 = [fn1(), fn1(), fn1()];
    const letters2 = [fn2(), fn2(), fn2()];

    assertEquals(letters1, letters2);
  });
});
