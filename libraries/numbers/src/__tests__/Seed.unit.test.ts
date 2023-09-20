import { assertEquals, assertInstanceOf, assertNotEquals, describe, it } from '../../dev_deps.ts';

import { Int32Seed, IntSeed, Seed } from '../Seed.ts';

const MAX_INT_32 = 4294967295; // 2^32 - 1

describe('Seed class', () => {
  describe('constructor', () => {
    it('returns a Seed instance with a base value', () => {
      const seed = new Seed();

      assertInstanceOf(seed, Seed);
      assertNotEquals(seed.base, undefined);
    });

    it('returns an object containing a function whose output, when invoked successively, is a deterministic pseudo-random series of numbers', () => {
      const seed = new Seed();
      const clone = seed.clone();

      const seedValues = [
        seed.next(),
        seed.next(),
        seed.next(),
      ];

      const cloneValues = [
        clone.next(),
        clone.next(),
        clone.next(),
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
  // `clone()` is tested in a subclass below
});

describe('Int32Seed class', () => {
  describe('static clone()', () => {
    it('returns an instance of Int32Seed', () => {
      const seed = new Int32Seed();

      const clone = Int32Seed.clone(seed);

      assertInstanceOf(clone, Int32Seed);
    });

    it('by default, the clone\'s seed is advanced by 1 relative to the parent\'s', () => {
      const seed = new Int32Seed();
      const clone = Int32Seed.clone(seed);

      seed.next();

      assertEquals(clone?.base, seed.base);
    });

    it('if invoked with nIncrements=0, the clone has the same seed as the parent', () => {
      const seed = new Int32Seed();
      const clone = Int32Seed.clone(seed, 0);

      assertEquals(clone?.base, seed.base);
    });

    it('if invoked with nIncrements=n, advances the seed by n relative to the parent\'s', () => {
      const seed = new Int32Seed();
      const clone = Int32Seed.clone(seed, 2);
      seed.next() && seed.next();

      assertEquals(clone?.base, seed.base);
    });

    it('if invoked with nIncrements<0, rewinds the seed by nIncrements', () => {
      const seed = new Int32Seed();
      const seedBase = seed.base;
      seed.next() && seed.next();

      const clone = Int32Seed.clone(seed, -2);

      assertEquals(clone?.base, seedBase);
    });
  });

  describe('static spawn()', () => {
    it('returns an instance of Int32Seed', () => {
      const seed = new Int32Seed();

      const spawned = Int32Seed.spawn(seed);

      assertInstanceOf(spawned, Int32Seed);
    });
  });

  describe('constructor', () => {
    it('generates an integer base', () => {
      const seed = new Int32Seed();
      assertEquals(Number.isInteger(seed.base), true);
    });

    it('generates integer values', () => {
      const seed = new IntSeed();
      assertEquals(Number.isInteger(seed.next()), true);
      assertEquals(Number.isInteger(seed.next()), true);
    });

    it('if the input seed exceeds max, uses modula max', () => {
      const expectedBase = 1;

      const seed = new Int32Seed(MAX_INT_32 + 1);

      assertEquals(seed.base, expectedBase);
    });
  });

  describe('clone()', () => {
    it('returns an instance of IntSeed', () => {
      const seed = new Int32Seed();

      const clone = seed.clone();

      assertInstanceOf(clone, Int32Seed);
    });

    it('if invoked with nIncrements, advances n values from the current value', () => {
      const seed = new Int32Seed();
      const clone = seed.clone(2);

      seed.next() && seed.next();
      const expected = seed.base;

      const actual = clone.base;

      assertEquals(actual, expected);
    });
  });

  describe('next()', () => {
    it('if the seed generator exceeds 2^32 - 1, safely wraps around from 0', () => {
      const seed = new Int32Seed(MAX_INT_32);
      const expectedBase = 1;

      seed.next();

      assertEquals(seed.base, expectedBase);
    });
  });
});

describe('IntSeed class', () => {
  describe('constructor', () => {
    it('generates an integer base', () => {
      const seed = new IntSeed();
      assertEquals(Number.isInteger(seed.base), true);
    });

    it('generates integer values', () => {
      const seed = new IntSeed();
      assertEquals(Number.isInteger(seed.next()), true);
      assertEquals(Number.isInteger(seed.next()), true);
    });
  });

  describe('next()', () => {
    it('if the seed generator exceeds MAX_SAFE_INTEGER, safely wraps around from 0', () => {
      const seed = new IntSeed(Number.MAX_SAFE_INTEGER);
      const expectedBase = 1;

      seed.next();

      assertEquals(seed.base, expectedBase);
    });
  });
});
