/**
 * Returns an array containing the items from the input iterable that are duplicated.
 */
export function getDuplicates<T>(items: Iterable<T>): T[] {
  const duplicates = new Set<T>();
  const seen = new Set<T>();
  for (const item of items) {
    if (seen.has(item)) {
      duplicates.add(item);
    } else {
      seen.add(item);
    }
  }
  return Array.from(duplicates);
}
