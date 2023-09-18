import type { Seed } from '../sibling_deps.ts';
import { makeRandom } from '../sibling_deps.ts';

/**
 * Returns a new array with the items shuffled.
 */
export function shuffle<T>(items: ReadonlyArray<T>, options: Options = {}): T[] {
  const tempItems = [...items];
  shuffleInPlace(tempItems, options);
  return tempItems;
}

/**
 * Uses the Fisher-Yates algorithm to shuffle an array in place.
 * Time complexity: O(n)
 */
export function shuffleInPlace<T>(items: T[], options: Options = {}): void {
  const [random] = makeRandom(options.seed);

  // Fisher-Yates algorithm
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
}

interface Options {
  seed?: Seed | undefined;
}
