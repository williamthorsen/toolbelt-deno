/**
 * Returns a new array with the items shuffled.
 */
export function shuffle<T>(items: ReadonlyArray<T>): T[] {
  const tempItems = [...items];
  shuffleInPlace(tempItems);
  return tempItems;
}

/**
 * Uses the Fisher-Yates algorithm to shuffle an array in place.
 * Time complexity: O(n)
 */
export function shuffleInPlace<T>(items: T[]): void {
  // Fisher-Yates algorithm
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
}
