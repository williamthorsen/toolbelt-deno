/**
 * Returns a random item from the array.
 * If the array is empty, throws an error.
 */
export function pickRandomItem<T>(items: ReadonlyArray<T>): T {
  if (items.length === 0) {
    throw new Error('Cannot pick an item from an empty array');
  }
  return items[Math.floor(Math.random() * items.length)];
}
