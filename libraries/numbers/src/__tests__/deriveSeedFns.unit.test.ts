import { assertEquals, assertInstanceOf, assertThrows, describe, it } from '../../dev_deps.ts';

import { deriveMakeSeedFn, deriveSeedFns, deriveSpawnSeedFn } from '../deriveSeedFns.ts';
import { evaluate } from '../evaluate.ts';
import type { Seed } from '../numbers.types.ts';

// Testable number generator: It returns a value in the range [0, 10] if given a seed, or 1 if no seed.
function makeGenerateNumber() {
  return (options?: { seed?: Seed }) => Math.floor(evaluate(options?.seed || 0) * 10) + 1;
}

describe('deriveMakeSeedFn() & deriveSeedFns()', () => {
  const generateNumber = makeGenerateNumber();

  const makeSeedFn1 = deriveMakeSeedFn(generateNumber)({});
  const [makeSeedFn2] = deriveSeedFns(generateNumber)({});

  it('returns a custom makeSeedFn that returns a tuple containing a number-generator and base seed', () => {
    for (const makeSeedFn of [makeSeedFn1, makeSeedFn2]) {
      const [seedFn, baseSeed] = makeSeedFn();

      assertInstanceOf(seedFn, Function);
      assertEquals(Number.isFinite(baseSeed), true);
    }
  });

  it('the seedFn uses the custom base function and gives consistent results', () => {
    for (const makeSeedFn of [makeSeedFn1, makeSeedFn2]) {
      const seed = 5;
      const expectedBaseSeed = seed;

      const [seedFn1, actualBaseSeed] = makeSeedFn(seed);
      const [seedFn2] = makeSeedFn(seed);

      const [value1, value2] = [seedFn1(), seedFn2()];

      assertEquals(actualBaseSeed, expectedBaseSeed);
      assertEquals(value1, value2);
      assertEquals(Number.isInteger(value1), true);
    }
  });

  it('if given a seed, returns it as the baseSeed', () => {
    const seed = 1234;
    const makeSeedFn = deriveMakeSeedFn(generateNumber)({});
    const expectedBaseSeed = seed;

    const [_, actualBaseSeed] = makeSeedFn(seed);

    assertEquals(actualBaseSeed, expectedBaseSeed);
  });

  for (const deriveFn of [deriveMakeSeedFn, deriveSeedFns]) {
    it('if a seed is passed to the configuration, throws an error', () => {
      const seed = 1234;

      const throwingFn = () => deriveFn(generateNumber)({ seed });
      assertThrows(throwingFn, Error, 'Unexpected seed value. Omit the seed when deriving the function.');
    });
  }

  it('if the seed generator exceeds MAX_SAFE_INTEGER, safely wraps around from 0', () => {
    const generateMaxNumber = () => Number.MAX_SAFE_INTEGER;
    const [seedFn] = deriveMakeSeedFn(generateMaxNumber)({})();

    let base: number | undefined = undefined;
    seedFn((newBase: number) => base = newBase);

    assertEquals(base, 1);
  });
});

describe('deriveSpawnSeedFn() & deriveSeedFns()', () => {
  const generateNumber = makeGenerateNumber();

  const spawnSeedFn = deriveSpawnSeedFn(deriveMakeSeedFn(generateNumber)({}));
  const [_, spawnSeedFn2] = deriveSeedFns(generateNumber)({});

  it('returns a function', () => {
    assertInstanceOf(spawnSeedFn, Function);
    assertInstanceOf(spawnSeedFn2, Function);
  });

  describe('custom spawnSeedFn()', () => {
    it('passes through undefined', () => {
      const seedFn = spawnSeedFn();

      assertEquals(seedFn, undefined);
    });

    it('if given a seed that is number or function, evaluates the seed and uses the result as a seed for the number-generating function', () => {
      const seed = 10;
      const seedFn1 = spawnSeedFn(seed);
      const seedFn2 = spawnSeedFn(seed);

      // We don't know what the result will be, we only know that the same seed always produces the same result
      // and the result will always be an integer (because our number-generating function produces integers).
      const [value1, value2] = [seedFn1 && seedFn1(), seedFn2 && seedFn2()];

      assertEquals(value1, value2);
      assertEquals(Number.isInteger(value1), true);
    });
  });
});
