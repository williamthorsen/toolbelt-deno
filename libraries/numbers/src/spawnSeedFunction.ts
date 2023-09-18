import type { Seed } from './numbers.types.ts';
import { makeSeededRandom } from './makeSeededRandom.ts';

/**
 * If given a number-generating function, returns the function.
 * If given a number, returns a random-number generator that generates numbers deterministically from the seed.
 * If the input is undefined, returns undefined.
 *
 * Intended for use in a function that accepts a numeric seed but must make more than one pseudo-random invocation, such
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
 *
 * @deprecated Use `spawnIntSeedFn` instead.
 */
export function spawnSeedFunction(seed: Seed | undefined): (() => number) | undefined {
  if (seed === undefined) return undefined;
  return makeSeededRandom(seed).random;
}
