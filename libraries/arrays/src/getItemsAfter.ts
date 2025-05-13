/** Returns an object containing the smaller time units for a given time unit. */
function getItemsAfter<T>(items: readonly T[], item: T): T[] {
  const index = items.indexOf(item);
  return index !== -1 ? items.slice(index + 1) : [];
}

