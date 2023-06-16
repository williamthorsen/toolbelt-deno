import { scale } from './scale.ts';

/**
 * Returns a random number between min (inclusive) and max (exclusive).
 */
export function random(options: Options = {}) {
  const { min = 0, max = 1 } = options;

  return scale(Math.random(), { min, max });
}

interface Options {
  max?: number;
  min?: number;
}
