import { assertEquals, assertNotEquals, describe, it } from '../../dev_deps.ts';

import { withSeed } from '../withSeed.ts';
import { pickInteger } from '../pickInteger.ts';
import type { SeedLike } from '../Seed.ts';

describe('withSeed()', () => {
  // Returns a random letter of the alphabet.
  function pickLetter(options?: { seed?: SeedLike }): string {
    const letterIndex = pickInteger({ min: 0, max: 25, seed: options?.seed });

    return String.fromCharCode(97 + letterIndex);
  }

  it('returns a function that produces pseudorandom outputs', () => {
    const seededGetLetter = withSeed(pickLetter, 1234);

    const letter1 = seededGetLetter();
    const actual = [
      letter1,
      seededGetLetter(),
      seededGetLetter(),
    ];

    assertNotEquals(actual, [letter1, letter1, letter1]);
  });
  it('returns a function that successively produces the same outputs when given the same seed', () => {
    const seed = 1234;
    const fn1 = withSeed(pickLetter, seed);
    const fn2 = withSeed(pickLetter, seed);

    const letters1 = [fn1(), fn1(), fn1()];
    const letters2 = [fn2(), fn2(), fn2()];

    assertEquals(letters1, letters2);
  });
});
