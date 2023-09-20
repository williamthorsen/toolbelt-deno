import { getFakeMathRandom } from './getFakeMathRandom.ts';
import type { SeedLike } from './Seed.ts';
import { Seed } from './Seed.ts';

/**
 * Returns a number generator whose output, when invoked successively after being seeded,
 * is a deterministic pseudo-random series of numbers in the range of [0, 1) (like `Math.random()`).
 * Similar to `createNumberGenerator()`, but always returns a determistic function and also returns a number
 * that can be used to create a new generator that gives the same output.
 *
 * @deprecated Use `Seed#seedFn` instead.
 */
export function makeSeedFn(seed?: SeedLike): [seedFn: () => number, seed: number] {
  let base = Seed.evaluate(seed) ?? Math.random();
  function seedFn(): number {
    return getFakeMathRandom(base++);
  }
  return [seedFn, base];
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
 *
 * @deprecated Use `Seed.spawn` instead.
 */
export function spawnSeedFn(seed?: SeedLike): SpawnedSeedFn {
  return seed === undefined ? undefined : makeSeedFn(seed)[0];
}

export type SpawnSeedFn = (seed?: SeedLike) => SpawnedSeedFn;

export type SpawnedSeedFn = (() => number) | undefined;
