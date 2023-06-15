import { scale } from './scale.ts';

/**
 * Returns a number generator whose output, when invoked successively, is a pseudo-random
 * series of numbers that deterministically depend on the initial seed.
 * This is not intended to be a cryptographically secure random number generator.
 */
export function createNumberGenerator(seed: number) {
  let base = seed;
  return function seededRandom(options: Options = {}) {
    const { min = 0, max = 1 } = options;

    // Scale it to the given range.
    return scale(getFakeMathRandom(base++), { min, max });
  };
}

/**
 * Deterministically computes and returns a number in the range [0, 1) based on the input.
 */
function getFakeMathRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;

  // Get the decimal part of the number, which is in the range [-1, 1];
  // add 1 if it is negative, to change its range to [0, 1).
  return x - Math.floor(x);
}

interface Options {
  max?: number;
  min?: number;
}
