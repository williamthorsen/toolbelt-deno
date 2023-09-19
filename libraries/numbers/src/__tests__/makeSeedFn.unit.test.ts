import { assertEquals, assertNotEquals, describe, it } from '../../dev_deps.ts';

import { makeSeedFn, spawnSeedFn } from '../makeSeedFn.ts';

describe('makeSeedFn()', () => {
  it.skip('returns an object containing a function whose output, when invoked successively, is a deterministic pseudo-random series of numbers', () => {
    const [random1, seed] = makeSeedFn();
    const [random2] = makeSeedFn(seed);

    const values1 = [
      random1(),
      random1(),
      random1(),
    ];

    const values2 = [
      random2(),

      random2(),
      random2(),
    ];

    assertEquals(values1, values2);
  });

  it('accepts as the seed a function that returns a number', () => {
    const seedFn = () => 1234;
    const [random1, seed] = makeSeedFn(seedFn);
    const [random2] = makeSeedFn(seed);

    assertEquals(random1(), random2());
  });

  it('if the seed is a generator, returns different results when used more than once', () => {
    const [seedFn] = makeSeedFn();
    const [random1] = makeSeedFn(seedFn);
    const [random2] = makeSeedFn(seedFn);

    assertNotEquals(random1(), random2());
  });
});

describe('spawnSeedFn()', () => {
  it('given a number, returns a deterministic number generator that uses that number as the seed', () => {
    const seed = 1234;

    const seedFn = spawnSeedFn(seed);

    assertEquals(seedFn instanceof Function, true);
  });

  it('given undefined, returns undefined', () => {
    const seed = undefined;
    const expected = undefined;

    const actual = spawnSeedFn(seed);

    assertEquals(actual, expected);
  });

  it('given a function, evaluates the function and return a new pseudo-random number generator using the result a seed', () => {
    const seed = () => 1;

    const generator1 = spawnSeedFn(seed);
    const generator2 = spawnSeedFn(seed);

    assertEquals(generator1 && generator1(), generator2 && generator2());
    assertNotEquals(generator1, undefined);
  });
});
