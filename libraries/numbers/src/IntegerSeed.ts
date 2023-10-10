import { getFakeMathRandom } from './getFakeMathRandom.ts';

const MAX_INTEGER = 2 ** 31 - 1; // 2147483647

/**
 * Class wrapper for `toIntegerSeed` that provides static properties for generating new seeds.
 */
export class IntegerSeed {
  static max = MAX_INTEGER; // 2147483647
  static multiplier = 16807;
  static toInt(value = Math.random()): number {
    return toIntegerSeed(value);
  }
  static next(seed: number): number {
    return (seed * IntegerSeed.multiplier) % IntegerSeed.max;
  }
}

/**
 * Accepts any number as input and deterministically returns an integer in the range [1, 2147483647].
 */
function toIntegerSeed(value: number): number {
  let integer = (() => {
    // If the value is already an integer, we can use it directly
    if (Number.isInteger(value)) return value;

    // Otherwise, get a deterministic integer from the value
    return Math.floor(getFakeMathRandom(value) * MAX_INTEGER);
  })();

  // Constrain the integer to the range [1, MAX_INTEGER]
  integer = integer % MAX_INTEGER;
  if (integer <= 0) {
    integer += MAX_INTEGER;
  }
  return integer;
}
