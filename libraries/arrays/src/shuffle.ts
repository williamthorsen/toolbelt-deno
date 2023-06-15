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
  const random = options.seed === undefined ? Math.random : createNumberGenerator(options.seed);

  // Fisher-Yates algorithm
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
}

/**
 * These functions are copied from libraries/numbers/src/createNumberGenerator.ts
 * to avoid the need for an import from a different module when published as a Node.js package.
 */
export function createNumberGenerator(seed: number) {
  let base = seed;
  return function seededRandom() {
    const x = Math.sin(base++) * 10000;
    return x - Math.floor(x);
  };
}

interface Options {
  seed?: number | undefined;
}
