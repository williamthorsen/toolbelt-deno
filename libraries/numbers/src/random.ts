import { scale } from './scale.ts';
import { createNumberGenerator } from './createNumberGenerator.ts';
import { Seed } from './numbers.types.ts';

/**
 * Returns a scaled random number in the range [min, max).
 */
export function random(options: Options = {}) {
  const { min = 0, max = 1, seed } = options;

  // Generates a deterministic result if seed is provided; otherwise, uses Math.random().
  const random = createNumberGenerator(seed);

  return scale(random(), { min, max });
}

interface Options {
  max?: number;
  min?: number;
  seed?: Seed;
}
