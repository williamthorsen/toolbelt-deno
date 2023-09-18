import { assertEquals, assertNotEquals, describe, it } from '../../dev_deps.ts';

import { spawnSeedFunction } from '../spawnSeedFunction.ts';
import { Seed } from '../numbers.types.ts';
import { random } from '../random.ts';

describe('spawnSeedFunction()', () => {
  it('given a number, returns a deterministic number generator that uses that number as the seed', () => {
    const seed = 1234;

    const seedFn = spawnSeedFunction(seed);

    assertEquals(seedFn instanceof Function, true);
  });

  it('given undefined, returns undefined', () => {
    const seed = undefined;
    const expected = undefined;

    const actual = spawnSeedFunction(seed);

    assertEquals(actual, expected);
  });

  it('given a function, evaluates the function and return a new pseudo-random number generator using the result a seed', () => {
    const seed = () => 1;

    const generator1 = spawnSeedFunction(seed);
    const generator2 = spawnSeedFunction(seed);

    assertEquals(generator1 && generator1(), generator2 && generator2());
    assertNotEquals(generator1, undefined);
  });
});

describe('spawnSeedFunction() demonstration', () => {
  function seedConsumer(rawSeed: Seed, useToSeedGenerator = false): number[] {
    const seed = useToSeedGenerator ? spawnSeedFunction(rawSeed) : rawSeed;
    return [
      random({ seed }),
      random({ seed }),
    ];
  }

  // Demonstrates what can happen if a numeric seed is consumed without the use of `spawnSeedFunction`.
  it('without spawnSeedFunction, uses the same seed more than once', () => {
    const seed = 1234;

    const [a1, b1] = seedConsumer(seed);
    const [a2, b2] = seedConsumer(seed);

    assertEquals([a1, a1, a1, a1], [a1, a2, b1, b2]);
  });

  it('with spawnSeedFunction, gives a deterministic but new result each time the seed is used', () => {
    const SPAWN_TRUE = true;
    const seed = 1234;

    const [a1, b1] = seedConsumer(seed, SPAWN_TRUE);
    const [a2, b2] = seedConsumer(seed, SPAWN_TRUE);

    assertNotEquals(a1, b1);
    assertNotEquals(a2, b2);
    assertEquals([a1, b1], [a2, b2]);
  });
});
