import { assertEquals, assertNotEquals, describe, it } from '../../dev_deps.ts';

import { spawnSeedFn } from '../spawnSeedFn.ts';
import { Seed } from '../numbers.types.ts';
import { random } from '../random.ts';

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

describe('spawnSeedFn() demonstration', () => {
  function seedConsumer(rawSeed: Seed, useToSeedGenerator = false): number[] {
    const seed = useToSeedGenerator ? spawnSeedFn(rawSeed) : rawSeed;
    return [
      random({ seed }),
      random({ seed }),
    ];
  }

  // Demonstrates what can happen if a numeric seed is consumed without the use of `spawnSeedFn`.
  it('without spawnSeedFn, uses the same seed more than once', () => {
    const seed = 1234;

    const [a1, b1] = seedConsumer(seed);
    const [a2, b2] = seedConsumer(seed);

    assertEquals([a1, a1, a1, a1], [a1, a2, b1, b2]);
  });

  it('with spawnSeedFn, gives a deterministic but new result each time the seed is used', () => {
    const SPAWN_TRUE = true;
    const seed = 1234;

    const [a1, b1] = seedConsumer(seed, SPAWN_TRUE);
    const [a2, b2] = seedConsumer(seed, SPAWN_TRUE);

    assertNotEquals(a1, b1);
    assertNotEquals(a2, b2);
    assertEquals([a1, b1], [a2, b2]);
  });
});
