import { assertEquals, assertNotEquals, describe, it } from '../../dev_deps.ts';

import { makeSeededRandom } from '../makeSeededRandom.ts';

describe('makeSeededRandom()', () => {
  it('returns an object containing a function whose output, when invoked successively, is a deterministic pseudo-random series of numbers', () => {
    const { random, seed } = makeSeededRandom();
    const seededRandom = makeSeededRandom(seed).random;

    const values1 = [
      random(),
      random(),
      random(),
    ];

    const values2 = [
      seededRandom(),

      seededRandom(),
      seededRandom(),
    ];

    assertEquals(values1, values2);
  });

  it('accepts as the seed a function that returns a number', () => {
    const seedFn = () => 1234;
    const { random, seed } = makeSeededRandom(seedFn);
    const seededRandom = makeSeededRandom(seed).random;

    assertEquals(random(), seededRandom());
  });

  it('if the seed is a generator, returns different results when used more than once', () => {
    const seed = makeSeededRandom().random;
    const seededRandom1 = makeSeededRandom(seed);
    const seededRandom2 = makeSeededRandom(seed);

    assertNotEquals(seededRandom1.random(), seededRandom2.random());
  });
});
