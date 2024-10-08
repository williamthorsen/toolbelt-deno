import { assertEquals, assertInstanceOf, assertNotEquals, describe, it } from '../../dev_deps.ts';

import type { Seed, SeededGenerator } from '../evaluateSeed.ts';
import { IntegerSeed } from '../IntegerSeed.ts';
import { pickInteger } from '../pickInteger.ts';
import { Int32SeededRng, IntSeededRng, SeededRng } from '../SeededRng.ts';

describe('SeededRng class', () => {
  // Argument for clone is that it always leaves the seed of the parent unchanged.
  describe('static clone()', () => {
    const SEED_NUMBER = 1234;
    const getRngLike = (): SeededGenerator & { peek(): number } => {
      let base = SEED_NUMBER;
      return {
        next: (n = 1) => {
          const value = 2 * base;
          base += n;
          return value;
        },
        peek: () => {
          return 2 * base;
        },
        get seed() {
          return base;
        },
      };
    };
    for (const seedInput of [SEED_NUMBER, () => SEED_NUMBER]) {
      it(`given a seed of type ${typeof seedInput}, SeededRng.clone(seed) has the same result as new SeededRng(seed).clone()`, () => {
        const staticRng = SeededRng.clone(seedInput);
        const instanceRng = new SeededRng(seedInput).clone();

        assertEquals(staticRng?.next(), instanceRng?.next());
        assertEquals(staticRng?.next(), instanceRng?.next());
      });
    }

    // But if `seed` is self-incrementing, then
    // - the seed of `SeededRng.clone(seed)` is the same as its parent's seed, but
    // - the seed of `new SeededRng(seed).clone()` is advanced by one relative to its parent's.
    for (
      const [label, seedInputFn] of [
        ['SeededRng', () => new SeededRng(SEED_NUMBER)],
        ['SeededGenerator', getRngLike],
      ] as const
    ) {
      it('produces consistent results', () => {
        assertEquals(seedInputFn().seed, SEED_NUMBER);
        assertEquals(seedInputFn().seed, seedInputFn().seed);
        assertEquals(seedInputFn().next(), seedInputFn().next());
      });

      it(`given an RNG seed of type ${label}, SeededRng.clone(seed) behaves differently from new SeededRng.clone(input)`, () => {
        // Create identical inputs
        const seedInput1 = seedInputFn();
        const seedInput2 = seedInputFn();
        assertEquals(seedInput1.seed, SEED_NUMBER);
        assertEquals(seedInput2.seed, SEED_NUMBER);

        // Using the first input: `static clone` creates an RNG without advancing the input seed.
        // Result: The clone RNG's seed is the same as the input RNG's seed.
        const staticRng = SeededRng.clone(seedInput1);
        assertEquals(seedInput1.seed, SEED_NUMBER);
        assertEquals(staticRng?.seed, SEED_NUMBER);

        // Using the second input: `constructor` + `clone`
        // - `constructor`: The input RNG is evaluated, yielding the 1st pseudorandom value.
        //   Result: The input RGN's seed is incremented, and the intermediate RGN's seed is the 1st pseudorandom value.
        // - `clone`: The intermediate RNG is cloned without yielding a value; is seed is inherited by the clone RNG.
        //   Result: The clone RNG's seed is the same as 1st pseudorandom value.
        const instanceRng = new SeededRng(seedInput2).clone(); // advances the input seed
        assertNotEquals(seedInput2.seed, SEED_NUMBER); // the input seed is no longer the same as the input seed
        assertNotEquals(instanceRng.seed, seedInput2.seed); // and the parent's seed has advanced
      });
    }

    it('given an RNG, returns a new RNG', () => {
      const seedRng = new SeededRng();

      const rng = SeededRng.clone(seedRng);

      assertInstanceOf(rng, SeededRng);
    });

    it('given a number, returns an RNG that uses that number as the seed', () => {
      const seed = 1;
      const expected = seed;

      const actual = SeededRng.clone(seed)?.seed;

      assertEquals(actual, expected);
    });

    it('given undefined, returns undefined', () => {
      const input = undefined;
      const expected = undefined;

      const actual = SeededRng.clone(input);

      assertEquals(actual, expected);
    });

    it('given a function, invokes the function and returns an RNG that uses its result to create a seed', () => {
      const seed = 1234.5;
      const seedFn = () => seed;
      // TODO: This is under-the-hood knowledge. Test in a way that doesn't rely on implementation details.
      const expected = IntegerSeed.toInt(seed);

      const actual = SeededRng.clone(seedFn)?.seed;

      assertEquals(IntegerSeed.toInt(actual), expected);
    });

    it('by default, the clone\'s seed is the same as the parent\'s', () => {
      const parentRng = new SeededRng();
      const cloneRng = SeededRng.clone(parentRng);

      assertEquals(cloneRng?.seed, parentRng.seed);
    });

    it('if invoked with nIncrements>0, advances the seed by n relative to the parent\'s', () => {
      const N_INCREMENTS = 3;
      const parentRng = new SeededRng();
      const childRng = SeededRng.clone(parentRng, N_INCREMENTS);
      parentRng.next(N_INCREMENTS);

      assertEquals(childRng?.seed, parentRng.seed);
    });
  });

  describe('static cloneOrCreate()', () => {
    it('if a seed is given, returns an RNG that uses the same seed', () => {
      const seed = 1234;
      const expectedSeed = seed;

      const actualSeed = SeededRng.cloneOrCreate(seed).seed;

      assertEquals(actualSeed, expectedSeed);
    });

    it('if no seed is given, return a new RNG', () => {
      const seed = undefined;
      const rng = SeededRng.cloneOrCreate(seed);

      assertInstanceOf(
        rng,
        SeededRng,
      );
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

    it('creates a child having the same seed as its parent', () => {
      const parentRng = new SeededRng();
      const childRng = parentRng.clone();

      assertEquals(childRng.seed, parentRng.seed);
    });
  });

  describe('peek()', () => {
    it('returns the next value without incrementing the seed', () => {
      const rng = new SeededRng();
      const expected = rng.peek();

      const actual = rng.next();

      assertEquals(actual, expected);
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
    ['Int', IntSeededRng, 2 ** 31 - 1],
    ['Int32', Int32SeededRng, 2 ** 31 - 1],
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
      it('returns a new instance of the same class with the same seed', () => {
        const parentRng = new Rng();

        const childRng = parentRng.clone();

        assertInstanceOf(childRng, Rng);
        assertEquals(childRng.seed, parentRng.seed);
      });
    });

    describe('next()', () => {
      it('generates integer values', () => {
        const rng = new Rng(1234.5);
        const oldSeed = rng.seed;

        assertEquals(Number.isInteger(rng.next()), true);
        assertNotEquals(rng.seed, oldSeed);
      });
    });
  });
}
