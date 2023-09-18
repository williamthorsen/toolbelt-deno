import { evaluate } from './evaluate.ts';
import { getFakeMathRandom } from './getFakeMathRandom.ts';
import type { Seed } from './numbers.types.ts';

/**
 * Returns a number generator whose output, when invoked successively after being seeded,
 * is a pseudo-random series of numbers.
 * Similar to `createNumberGenerator()`, but always returns a determistic function and also returns the seed
 * that can be used to create a new generator that gives the same output.
 */
export function makeSeededRandom(seed?: Seed) {
  let base = evaluate(seed) ?? Math.random();
  return {
    random(): number {
      return getFakeMathRandom(base++);
    },
    seed: base,
  };
}
