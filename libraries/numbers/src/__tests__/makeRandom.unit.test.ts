import { assertEquals, assertNotEquals, describe, it } from '../../dev_deps.ts';

import { makeRandom } from '../makeRandom.ts';

describe('makeRandom()', () => {
  it.skip('returns an object containing a function whose output, when invoked successively, is a deterministic pseudo-random series of numbers', () => {
    const [random1, seed] = makeRandom();
    const [random2] = makeRandom(seed);

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
    const [random1, seed] = makeRandom(seedFn);
    const [random2] = makeRandom(seed);

    assertEquals(random1(), random2());
  });

  it('if the seed is a generator, returns different results when used more than once', () => {
    const [seedFn] = makeRandom();
    const [random1] = makeRandom(seedFn);
    const [random2] = makeRandom(seedFn);

    assertNotEquals(random1(), random2());
  });
});
