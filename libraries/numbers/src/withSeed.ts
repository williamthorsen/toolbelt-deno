import type { EmptyObject, Seed } from './numbers.types.ts';
import { spawnSeedFn } from './makeSeedFn.ts';

/**
 * Given a seed-acception function and an optional seed, returns a new function that passes the seed to the function.
 */
export function withSeed<TOptions extends object, R>(
  fn: (options?: OptionsWithSeed<TOptions>) => R,
  seed: Seed | undefined,
): (options?: TOptions) => R;
export function withSeed<TOptions extends object, R>(
  fn: (options: OptionsWithSeed<TOptions>) => R,
  seed: Seed | undefined,
): (options: TOptions) => R;

// Implementation
export function withSeed<TOptions extends object, R>(
  fn: (options?: OptionsWithSeed<TOptions> | OptionsWithSeed<EmptyObject>) => R,
  seed: Seed | undefined,
) {
  const spawnedSeed = spawnSeedFn(seed);
  return function (options?: TOptions) {
    return fn({ ...options, seed: spawnedSeed });
  };
}

type OptionsWithSeed<O> = O & { seed?: Seed };
