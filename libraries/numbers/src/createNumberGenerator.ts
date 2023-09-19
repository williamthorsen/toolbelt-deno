import { Seed } from './numbers.types.ts';
import { makeSeedFn } from './makeSeedFn.ts';

/**
 * Returns a number generator whose output, when invoked successively, is a pseudo-random
 * series of numbers that deterministically depend on the initial seed (or pseudo-random if no seed is given).
 * This is not intended to be a cryptographically secure random number generator.
 */
export function createNumberGenerator(seed?: Seed) {
  return seed === undefined ? Math.random : makeSeedFn(seed)[0];
}
