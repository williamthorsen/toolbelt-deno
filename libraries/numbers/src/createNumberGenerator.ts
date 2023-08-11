import { getFakeMathRandom } from './getFakeMathRandom.ts';

/**
 * Returns a number generator whose output, when invoked successively, is a pseudo-random
 * series of numbers that deterministically depend on the initial seed.
 * This is not intended to be a cryptographically secure random number generator.
 */
export function createNumberGenerator(seed?: number | undefined) {
  if (seed === undefined) {
    return Math.random;
  }
  let base = seed;
  return function seededRandom() {
    return getFakeMathRandom(base++);
  };
}
