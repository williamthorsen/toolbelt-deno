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
      const seed1 = new Seed();
      const seed2 = seed1.clone();

      const values1 = [
        seed1.next(),
        seed1.next(),
        seed1.next(),
      ];

      const values2 = [
        seed2.next(),
        seed2.next(),
        seed2.next(),
      ];

      assertEquals(values1, values2);
      assertNotEquals(values1[0], values1[1]);
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
});

describe('Int32Seed class', () => {
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

  it('if the seed generator exceeds 2^32 - 1, safely wraps around from 0', () => {
    const seed = new Int32Seed(MAX_INT_32);
    const expectedBase = 1;

    seed.next();

    assertEquals(seed.base, expectedBase);
  });
});

describe('IntSeed class', () => {
  it('generates an integer base', () => {
    const seed = new IntSeed();
    assertEquals(Number.isInteger(seed.base), true);
  });

  it('generates integer values', () => {
    const seed = new IntSeed();
    assertEquals(Number.isInteger(seed.next()), true);
    assertEquals(Number.isInteger(seed.next()), true);
  });

  it('if the seed generator exceeds MAX_SAFE_INTEGER, safely wraps around from 0', () => {
    const seed = new IntSeed(Number.MAX_SAFE_INTEGER);
    seed.next();
    const expectedBase = 1;

    assertEquals(seed.base, expectedBase);
  });
});
