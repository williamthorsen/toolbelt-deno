import { shuffle } from './shuffle.ts';

/**
 * Returns an array with `n` items picked randomly from the given array.
 * TODO: Optionally throw an error if `n` is greater than the length of the array.
 */
export function pickRandomItems<T>(items: ReadonlyArray<T>, n: number): T[] {
  // Clone the original array to avoid modifying it
  const tempItems = [...items];

  // Shuffle the cloned array
  shuffle(tempItems);

  // Return first `n` elements from the shuffled array
  return tempItems.slice(0, n);
}
