import { assertEquals, assertNotEquals, describe, it } from '../../dev_deps.ts';

import { makeSeedFn } from '../makeSeedFn.ts';

describe('makeSeedFn()', () => {
  it('returns a tuple containing a deterministic number-generating function and a seed that can be used to get a new function with the same behaviour', () => {
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
