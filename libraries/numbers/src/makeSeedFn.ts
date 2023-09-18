import { evaluate } from './evaluate.ts';
import { getFakeMathRandom } from './getFakeMathRandom.ts';
import type { Seed } from './numbers.types.ts';

/**
 * Returns a number generator whose output, when invoked successively after being seeded,
 * is a pseudo-random series of numbers.
 * Similar to `createNumberGenerator()`, but always returns a determistic function and also returns a number
 * that can be used to create a new generator that gives the same output.
 */
export function makeSeedFn(seed?: Seed): [random: () => number, seed: number] {
  let base = evaluate(seed) ?? Math.random();
  function random(): number {
    return getFakeMathRandom(base++);
  }
  return [random, base];
}

/**
 * If given a function, returns the function. If given a number, creates & returns a function using the number as seed.
 * If the input is undefined, returns undefined.
 *
 * Intended for use in a function that accepts a seed but must make more than one pseudo-random invocation, such
 * as a function that
 * - uses a seed to get a pseudo-random result and also invokes another function that takes a seed
 * - repeatedly gets pseudo-random results that accept a seed (as in a loop)
 * - invokes multiple functions that take a seed
 *
 * Because the function must be invoked to get a seed from it, it can safely be consumed and passed to
 * other functions, without the danger that a seed will be reused.
 *
 * `undefined` is simply passed through, so that a function that accepts a seed can also accept `undefined` to mean
 * "don't use a seed".
 */
export function spawnSeedFn(seed?: Seed): (() => number) | undefined {
  return seed === undefined ? undefined : makeSeedFn(seed)[0];
}
