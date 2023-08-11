import { scale } from './scale.ts';
import { createNumberGenerator } from './createNumberGenerator.ts';

/**
 * Returns a random number in the range [min, max).
 */
export function random(options: Options = {}) {
  const { min = 0, max = 1, seed } = options;
  const random = createNumberGenerator(seed);

  return scale(random(), { min, max });
}

interface Options {
  max?: number;
  min?: number;
  seed?: number;
}
