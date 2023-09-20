import { scale } from './scale.ts';
import type { SeedLike } from './Seed.ts';
import { getFakeMathRandom } from './getFakeMathRandom.ts';
import { Seed } from './Seed.ts';

/**
 * Returns a scaled random number in the range [min, max).
 */
export function random(options: Options = {}) {
  const { min = 0, max = 1 } = options;

  const seed = Seed.evaluate(options.seed);
  const randomNumber = seed === undefined ? Math.random() : getFakeMathRandom(seed);

  return scale(randomNumber, { min, max });
}

interface Options {
  max?: number | undefined;
  min?: number | undefined;
  seed?: SeedLike | undefined;
}
