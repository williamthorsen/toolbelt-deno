import { assertAlmostEquals, assertEquals, assertInstanceOf, assertNotEquals, describe, it } from '../../dev_deps.ts';

import { Seed, SeedLike } from '../Seed.ts';
import { pickInteger } from '../pickInteger.ts';
import { withSeed as deprecatedWithSeed } from '../withSeed.ts';

describe('Seed class', () => {
  describe('static clone()', () => {
    it('given a seed, returns a new seed that uses the same base seed', () => {
      const input = new Seed();

      const seed1 = Seed.clone(input);
      const seed2 = Seed.clone(input);

      assertInstanceOf(seed1, Seed);
      assertInstanceOf(seed2, Seed);
      assertEquals(seed1.next(), seed2.next());
    });

    it('given undefined, returns undefined', () => {
      const input = undefined;
      const expected = undefined;

      const actual = Seed.clone(input);

      assertEquals(actual, expected);
    });

    it('by default, the clone\'s seed is advanced by 1 relative to the parent\'s', () => {
      const seed = new Seed();
      const clone = Seed.clone(seed);

      seed.next();

      assertEquals(clone?.base, seed.base);
    });

    it('if invoked with nIncrements=0, the clone has the same seed as the parent', () => {
      const seed = new Seed();
      const clone = Seed.clone(seed, 0);

      assertEquals(clone?.base, seed.base);
    });

    it('if invoked with nIncrements=n, advances the seed by n relative to the parent\'s', () => {
      const seed = new Seed();
      const clone = Seed.clone(seed, 2);
      seed.next() && seed.next();

      assertEquals(clone?.base, seed.base);
    });

    it('if invoked with nIncrements<0, rewinds the seed by nIncrements', () => {
      const seed = new Seed();
      const seedBase = seed.base;
      seed.next() && seed.next();

      const clone = Seed.clone(seed, -2);

      assertAlmostEquals(clone?.base, seedBase);
    });
  });

  describe('static spawn()', () => {
    it('given a number, returns a seed that uses the number as its base', () => {
      const input = 1234;

      const seed1 = Seed.spawn(input);
      const seed2 = Seed.spawn(input);

      assertNotEquals(seed1 ?? seed2, undefined);
      assertEquals(seed1?.next(), seed2?.next());
    });

    it('given undefined, returns undefined', () => {
      const input = undefined;
      const expected = undefined;

      const actual = Seed.spawn(input);

      assertEquals(actual, expected);
    });

    it('given a function, evaluates the function and uses the result as its base', () => {
      const input = () => 1;

      const seed1 = Seed.spawn(input);
      const seed2 = Seed.spawn(input);

      assertNotEquals(seed1 ?? seed2, undefined);
      assertEquals(seed1?.next(), seed2?.next());
    });

    it('given a Seed instance, consumes a value in the instance', () => {
      const input = new Seed();

      const seed1 = Seed.spawn(input);
      const seed2 = Seed.spawn(input);

      assertNotEquals(seed1 ?? seed2, undefined);
      assertNotEquals(seed1?.next(), seed2?.next());
    });
  });

  describe('constructor', () => {
    it('returns a Seed instance with a base value', () => {
      const seed = new Seed();

      assertInstanceOf(seed, Seed);
      assertNotEquals(seed.base, undefined);
    });

    it('returns an object containing a function whose output, when invoked successively, is a deterministic pseudo-random series of numbers', () => {
      const seed1 = new Seed(1);
      const seed2 = new Seed(1);

      const seedValues = [
        seed1.next(),
        seed1.next(),
        seed1.next(),
      ];

      const cloneValues = [
        seed2.next(),
        seed2.next(),
        seed2.next(),
      ];

      assertEquals(seedValues, cloneValues);
      assertNotEquals(seedValues[0], seedValues[1]);
    });

    it('accepts as the base seed a function that returns a number', () => {
      const seedFn = () => 1234;
      const seed1 = new Seed(seedFn);
      const seed2 = new Seed(seedFn);

      assertEquals(seed1.next(), seed2.next());
    });

    it('if the seed is a number generator, returns different results when used more than once', () => {
      const input = new Seed();
      const seed1 = new Seed(input);
      const seed2 = new Seed(input);

      assertNotEquals(seed1.next(), seed2.next());
    });
  });

  describe('get seedFn', () => {
    it('returns a function that successively returns values from the instance', () => {
      const seed1 = new Seed(1234);
      const seed2 = new Seed(1234);

      const generate1 = seed1.seedFn;
      const generate2 = seed2.seedFn;

      const result1 = generate1();
      const result2 = generate2();

      assertEquals(result1, result2);
    });

    it('the function shares state with its instance', () => {
      const seed1 = new Seed(1234);
      const seed2 = new Seed(1234);

      // Gets a value from seed1, changing its next value relative to seed2.
      const generate1 = seed1.seedFn;
      generate1();

      // These would be equal if `generate1()` had not been called.
      const result1 = seed1.next();
      const result2 = seed2.next();

      assertNotEquals(result1, result2);
    });
  });

  describe('clone()', () => {
    it('if invoked with nIncrements, advances n values from the current value', () => {
      const seed = new Seed();
      const clone = seed.clone(2);

      seed.next() && seed.next();

      assertEquals(clone.base, seed.base);
    });
  });

  describe('withSeed()', () => {
    function pickLetter(options?: { seed?: SeedLike }): string {
      const letterIndex = pickInteger({ min: 0, max: 25, seed: options?.seed });

      return String.fromCharCode(97 + letterIndex);
    }

    // TODO: Remove `deprecatedWithSeed` after `withSeed` is removed.
    for (const withSeed of [deprecatedWithSeed, Seed.withSeed.bind(Seed)]) {
      // Returns a random letter of the alphabet.
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
    }
  });
});

describe('Seed class - int preset', () => {
  for (
    const [preset, createIntSeed, max] of [
      ['int', Seed.int, Number.MAX_SAFE_INTEGER],
      ['int32', Seed.int32, 2 ** 32 - 1],
    ] as const
  ) {
    describe('static clone()', () => {
      it(`returns a new ${preset} seed`, () => {
        const seed = createIntSeed(1234.5);

        const clone = Seed.clone(seed);

        assertInstanceOf(clone, Seed);
        assertEquals(clone?.preset, preset);
      });
    });

    describe(`static ${preset}()`, () => {
      it(`returns a new seed using the "${preset}" preset`, () => {
        const seed = createIntSeed();

        assertEquals(seed.preset, preset);
      });

      it('generates an integer base', () => {
        const seed = createIntSeed();
        assertEquals(Number.isInteger(seed.base), true);
      });

      it('can start with a non-integer base if provided by the caller', () => {
        const input = 1324.5;
        const seed = createIntSeed(input);
        assertEquals(seed.base, input);
      });

      it('always generates integer values', () => {
        const seed = createIntSeed(1234.5);
        assertEquals(Number.isInteger(seed.next()), true);
        assertEquals(Number.isInteger(seed.next()), true);
      });

      it('if the input seed exceeds max, uses modula max', () => {
        const expectedBase = 1;

        const seed = createIntSeed(max + 1);

        assertEquals(seed.base, expectedBase);
      });
    });

    describe('static spawn()', () => {
      it(`returns a new ${preset} seed`, () => {
        const seed = createIntSeed();

        const spawned = Seed.spawn(seed);

        assertInstanceOf(spawned, Seed);
      });
    });

    describe('clone()', () => {
      it(`returns a new ${preset} seed`, () => {
        const seed = createIntSeed();

        const clone = seed.clone();

        assertEquals(clone.preset, preset);
      });
    });

    describe('next()', () => {
      it('generates integer values', () => {
        const seed = createIntSeed(1234.5);
        assertEquals(Number.isInteger(seed.next()), true);
        assertEquals(Number.isInteger(seed.next()), true);
      });

      it(`if the seed generator exceeds ${max}, safely wraps around from 0`, () => {
        const seed = createIntSeed(max);
        const expectedNextBase = 1;

        seed.next();

        assertEquals(seed.base, expectedNextBase);
      });
    });
  }
});
