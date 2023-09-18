import { assertEquals, assertNotEquals, describe, it } from '../../dev_deps.ts';

import { makeIntSeedFn, spawnIntSeedFn } from '../makeIntSeedFn.ts';

describe('makeIntSeedFn()', () => {
  it('returns a tuple containing a deterministic number-generating function and a seed that can be used to get a new function with the same behaviour', () => {
    const [random1, seed] = makeIntSeedFn();
    const [random2] = makeIntSeedFn(seed);

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
    const [random1, seed] = makeIntSeedFn(seedFn);
    const [random2] = makeIntSeedFn(seed);

    assertEquals(random1(), random2());
  });

  it('if the seed is a generator, returns different results when used more than once', () => {
    const [seedFn] = makeIntSeedFn();
    const [random1] = makeIntSeedFn(seedFn);
    const [random2] = makeIntSeedFn(seedFn);

    assertNotEquals(random1(), random2());
  });
});

describe('spawnIntSeedFn()', () => {
  it('given a number, returns a deterministic number generator that uses that number as the seed', () => {
    const seed = 1234;

    const seedFn = spawnIntSeedFn(seed);

    assertEquals(seedFn instanceof Function, true);
  });

  it('given undefined, returns undefined', () => {
    const seed = undefined;
    const expected = undefined;

    const actual = spawnIntSeedFn(seed);

    assertEquals(actual, expected);
  });

  it('given a function, evaluates the function and return a new pseudo-random number generator using the result a seed', () => {
    const seed = () => 1;

    const generator1 = spawnIntSeedFn(seed);
    const generator2 = spawnIntSeedFn(seed);

    assertEquals(generator1 && generator1(), generator2 && generator2());
    assertNotEquals(generator1, undefined);
  });
});
