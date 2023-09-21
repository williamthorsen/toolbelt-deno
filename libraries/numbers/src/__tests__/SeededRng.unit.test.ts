import { assertAlmostEquals, assertEquals, assertInstanceOf, assertNotEquals, describe, it } from '../../dev_deps.ts';

import type { Seed } from '../evaluateSeed.ts';
import { pickInteger } from '../pickInteger.ts';
import { Int32SeededRng, IntSeededRng, SeededRng } from '../SeededRng.ts';

describe('SeededRng class', () => {
  const DEFAULT_INCREMENT = 1;

  describe('static clone()', () => {
    it('given an RNG, returns a new RNG', () => {
      const seedRng = new SeededRng();

      const rng = SeededRng.clone(seedRng);

      assertInstanceOf(rng, SeededRng);
    });

    it('given a number, returns an RNG that uses that number as the seed', () => {
      const seed = 1;
      const expected = seed + DEFAULT_INCREMENT;

      const actual = SeededRng.clone(seed)?.seed;

      assertEquals(actual, expected);
    });

    it('given undefined, returns undefined', () => {
      const input = undefined;
      const expected = undefined;

      const actual = SeededRng.clone(input);

      assertEquals(actual, expected);
    });

    it('given a function, invokes the function and returns an RNG that uses the result as the seed', () => {
      const seed = 1234.5;
      const seedFn = () => seed;
      const expected = seed + DEFAULT_INCREMENT;

      const actual = SeededRng.clone(seedFn)?.seed;

      assertEquals(actual, expected);
    });

    it('by default, the clone\'s seed is advanced by 1 relative to the parent\'s', () => {
      const rng = new SeededRng();
      const clone = SeededRng.clone(rng);

      rng.next();

      assertEquals(clone?.seed, rng.seed);
    });

    it('if invoked with nIncrements=0, the clone has the same seed as the parent', () => {
      const rng = new SeededRng();
      const clone = SeededRng.clone(rng, 0);

      assertEquals(clone?.seed, rng.seed);
    });

    it('if invoked with nIncrements=n, advances the seed by n relative to the parent\'s', () => {
      const rng = new SeededRng();
      const clone = SeededRng.clone(rng, 2);
      rng.next() && rng.next();

      assertEquals(clone?.seed, rng.seed);
    });

    it('if invoked with nIncrements<0, rewinds the seed by nIncrements', () => {
      const rng = new SeededRng();
      const rngSeed = rng.seed;
      rng.next() && rng.next();

      const clone = SeededRng.clone(rng, -2);

      assertAlmostEquals(clone?.seed, rngSeed);
    });
  });

  describe('static spawn()', () => {
    it('given a numeric seed, returns an RNG that uses the number as its seed', () => {
      const seed = 1234;

      const rng1 = SeededRng.spawn(seed);
      const rng2 = SeededRng.spawn(seed);

      assertNotEquals(rng1 ?? rng2, undefined);
      assertEquals(rng1?.next(), rng2?.next());
    });

    it('given undefined, returns undefined', () => {
      const seed = undefined;
      const expected = undefined;

      const actual = SeededRng.spawn(seed);

      assertEquals(actual, expected);
    });

    it('given a function, invokes the function and returns an RNG that uses the result as the seed', () => {
      const seedFn = () => 1;

      const rng1 = SeededRng.spawn(seedFn);
      const rng2 = SeededRng.spawn(seedFn);

      assertNotEquals(rng1 ?? rng2, undefined);
      assertEquals(rng1?.next(), rng2?.next());
    });

    it('given a SeededRng object, consumes a value in the instance', () => {
      const seedRng = new SeededRng();

      const rng1 = SeededRng.spawn(seedRng);
      const rng2 = SeededRng.spawn(seedRng);

      assertNotEquals(rng1 ?? rng2, undefined);
      assertNotEquals(rng1?.next(), rng2?.next());
    });
  });

  describe('constructor', () => {
    it('returns a SeededRng instance with a seed value', () => {
      const rng = new SeededRng();

      assertInstanceOf(rng, SeededRng);
      assertNotEquals(rng.seed, undefined);
    });

    it('returns an object containing a function whose output, when invoked successively, is a deterministic pseudo-random series of numbers', () => {
      const rng1 = new SeededRng(1);
      const rng2 = new SeededRng(1);

      const seedValues = [
        rng1.next(),
        rng1.next(),
        rng1.next(),
      ];

      const cloneValues = [
        rng2.next(),
        rng2.next(),
        rng2.next(),
      ];

      assertEquals(seedValues, cloneValues);
      assertNotEquals(seedValues[0], seedValues[1]);
    });

    it('accepts as the seed a function that returns a number', () => {
      const seedFn = () => 1234;
      const rng1 = new SeededRng(seedFn);
      const rng2 = new SeededRng(seedFn);

      assertEquals(rng1.next(), rng2.next());
    });

    it('if the seed is a number generator, returns different results when used more than once', () => {
      const inputRng = new SeededRng();
      const seed1 = new SeededRng(inputRng);
      const seed2 = new SeededRng(inputRng);

      assertNotEquals(seed1.next(), seed2.next());
    });
  });

  describe('get rng', () => {
    it('returns a function that successively returns values from the instance', () => {
      const rng1 = new SeededRng(1234);
      const rng2 = new SeededRng(1234);

      const generate1 = rng1.rng;
      const generate2 = rng2.rng;

      const result1 = generate1();
      const result2 = generate2();

      assertEquals(result1, result2);
    });

    it('the function shares state with its instance', () => {
      const rng1 = new SeededRng(1234);
      const rng2 = new SeededRng(1234);

      // Gets a value from rng1, changing its next value relative to rng2.
      const generate1 = rng1.rng;
      generate1();

      // These would be equal if `generate1()` had not been called.
      const result1 = rng1.next();
      const result2 = rng2.next();

      assertNotEquals(result1, result2);
    });
  });

  describe('clone()', () => {
    it('if invoked with nIncrements, advances n values from the current value', () => {
      const rng = new SeededRng();
      const clone = rng.clone(2);

      rng.next() && rng.next();

      assertEquals(clone.seed, rng.seed);
    });
  });

  describe('withSeed() - configured base function', () => {
    function pickLetter(options?: { seed?: Seed }): string {
      const letterIndex = pickInteger({ min: 0, max: 25, seed: options?.seed });

      return String.fromCharCode(97 + letterIndex);
    }

    // Returns a random letter of the alphabet.
    it('returns a function that uses the SeededRng to produce deterministic pseudorandom outputs', () => {
      const getNextLetter = SeededRng.withSeed(pickLetter, 1234);

      const letter1 = getNextLetter();
      const actual = [
        letter1,
        getNextLetter(),
        getNextLetter(),
      ];

      assertNotEquals(actual, [letter1, letter1, letter1]);
    });

    it('returns a function that successively produces the same outputs when given the same seed', () => {
      const seed = 1234;
      const fn1 = SeededRng.withSeed(pickLetter, seed);
      const fn2 = SeededRng.withSeed(pickLetter, seed);

      const letters1 = [fn1(), fn1(), fn1()];
      const letters2 = [fn2(), fn2(), fn2()];

      assertEquals(letters1, letters2);
    });
  });
});

for (
  const [preset, Rng, max] of [
    ['Int', IntSeededRng, Number.MAX_SAFE_INTEGER],
    ['Int32', Int32SeededRng, 2 ** 32 - 1],
  ] as const
) {
  const className = `${preset}SeededRng`;
  describe(`${className} class`, () => {
    describe('static clone()', () => {
      it('returns a new instance of the same class', () => {
        const rng = new Rng(1234.5);

        const clone = Rng.clone(rng);

        assertInstanceOf(clone, Rng);
      });
    });

    describe('constructor', () => {
      it(`returns an instance of ${className}`, () => {
        const rng = new Rng();

        assertInstanceOf(rng, Rng);
      });

      it('generates an integer seed', () => {
        const rng = new Rng();
        assertEquals(Number.isInteger(rng.seed), true);
      });

      it('can start with a non-integer seed if provided by the caller', () => {
        const input = 1324.5;
        const rng = new Rng(input);
        assertEquals(rng.seed, input);
      });

      it('always generates integer values', () => {
        const seed = new Rng(1234.5);
        assertEquals(Number.isInteger(seed.next()), true);
        assertEquals(Number.isInteger(seed.next()), true);
      });

      it(`if the input seed exceeds max (${max}), uses modulo max`, () => {
        const expectedSeed = 1;

        const rng = new Rng(max + 1);

        assertEquals(rng.seed, expectedSeed);
      });
    });

    describe('static spawn()', () => {
      it('returns a new instance of the same class', () => {
        const rng = new Rng();

        const spawned = Rng.spawn(rng);

        assertInstanceOf(spawned, Rng);
      });
    });

    describe('clone()', () => {
      it('returns a new instance of the same class', () => {
        const rng = new Rng();

        const clone = rng.clone();

        assertInstanceOf(clone, Rng);
      });
    });

    describe('next()', () => {
      it('generates integer values', () => {
        const rng = new Rng(1234.5);
        assertEquals(Number.isInteger(rng.next()), true);
        assertEquals(Number.isInteger(rng.next()), true);
      });

      it(`if the seed generator exceeds ${max}, safely wraps around from 0`, () => {
        const rng = new Rng(max);
        const expectedNextBase = 1;

        rng.next();

        assertEquals(rng.seed, expectedNextBase);
      });
    });
  });
}
