import { evaluate } from './evaluate.ts';
import { getFakeMathRandom } from './getFakeMathRandom.ts';
import type { Seed } from './numbers.types.ts';

/**
 * Returns a number generator whose output, when invoked successively after being seeded,
 * is a pseudo-random series of numbers.
 * Similar to `createNumberGenerator()`, but always returns a determistic function and also returns a number
 * that can be used to create a new generator that gives the same output.
 */
export function makeRandom(seed?: Seed): [random: () => number, seed: number] {
  let base = evaluate(seed) ?? Math.random();
  function random(): number {
    return getFakeMathRandom(base++);
  }
  return [random, base];
}
