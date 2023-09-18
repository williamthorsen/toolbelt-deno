import { evaluate } from './evaluate.ts';
import { makeRandom } from './makeRandom.ts';
import type { Seed } from './numbers.types.ts';
import { pickInteger } from './pickInteger.ts';

// For reference:
// const MAX_INT_32 = 4294967295; // 2^32 - 1
// const MAX_INT_53 = 9007199254740991; // 2^53 - 1; aka Number.MAX_SAFE_INTEGER

/**
 * Creates a function that, when successively invoked, produces a deterministic pseudo-random sequence of integers.
 * Also returns the seed that can be used to create a new generator that produces the same sequence.
 *
 * This function behaves identically to `makeRandom`, except for the range of the ouput:
 * - `makeRandom`: floating point numbers in the range [0, 1)
 * - `makeSeedFn`: integers in the range [1, MAX_SAFE_INTEGER)
 *
 * In short, use this function when user-friendly seeds are needed.
 */
export function makeSeedFn(seed?: Seed): [seedFn: () => number, baseSeed: number] {
  return makeCustomSeedFn({ seed, min: 1, max: Number.MAX_SAFE_INTEGER });
}

/**
 * Creates an integer seed and a function that returns a pseudo-random number between min and max.
 * Not currently exposed in the public API, but retained here to allow for future use.
 */
function makeCustomSeedFn(options: Options): [seedFn: () => number, baseSeed: number] {
  const base = evaluate(options.seed) ?? pickInteger(options);
  const [pickNumber, baseSeed] = makeRandom(base);
  return [() => pickInteger({ ...options, seed: pickNumber }), baseSeed];
}

interface Options {
  seed?: Seed | undefined;
  min: number;
  max: number;
}
