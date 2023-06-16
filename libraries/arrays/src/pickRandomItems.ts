import { shuffle } from './shuffle.ts';

/**
 * Returns an array with `n` items picked randomly from the given array.
 * Optionally accepts a seed that makes the results deterministic.
 * TODO: Optionally throw an error if `n` is greater than the length of the array.
 */
export function pickRandomItems<T>(items: ReadonlyArray<T>, n: number, options: Options = {}): T[] {
  const { seed } = options;

  const tempItems = shuffle(items, { seed });

  return tempItems.slice(0, n);
}

interface Options {
  seed?: number | undefined;
}
