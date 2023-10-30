/**
 * Extracts and returns weights from an array of items.
 * If all weights are undefined, returns an array of uniform weights.
 * If any weights are defined, undefined weights are treated as 0.
 * @items The array of items.
 * @getWeight A function that extracts the weight of each item.
 */
export function extractWeights<T>(
  items: ReadonlyArray<T>,
  getWeight: (item: T, index: number, items: ReadonlyArray<T>) => number | undefined,
): number[] {
  if (items.every((item, index, items) => getWeight(item, index, items) === undefined)) {
    return items.map(() => 1);
  }
  return items.map((item, index, items) => getWeight(item, index, items) ?? 0);
}
