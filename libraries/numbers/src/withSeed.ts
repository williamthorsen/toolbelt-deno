import type { EmptyObject } from './numbers.types.ts';
import type { SeedLike } from './Seed.ts';
import { Seed } from './Seed.ts';

/**
 * Given a seed-acception function and an optional seed, returns a new function that passes the seed to the function.
 *
 * @deprecated Use `Seed.withSeed` instead.
 */
export function withSeed<TOptions extends object, R>(
  fn: (options?: OptionsWithSeed<TOptions>) => R,
  seed: SeedLike | undefined,
): (options?: TOptions) => R;
export function withSeed<TOptions extends object, R>(
  fn: (options: OptionsWithSeed<TOptions>) => R,
  seed: SeedLike | undefined,
): (options: TOptions) => R;

// Implementation
export function withSeed<TOptions extends object, R>(
  fn: (options?: OptionsWithSeed<TOptions> | OptionsWithSeed<EmptyObject>) => R,
  seed: SeedLike | undefined,
) {
  const spawnedSeed = Seed.spawn(seed); // stored outside the function to create a closure
  return function (options?: TOptions) {
    return fn({ ...options, seed: spawnedSeed });
  };
}

type OptionsWithSeed<O> = O & { seed?: SeedLike };
