import type { Seed } from '../sibling_deps.ts';
import { random } from '../sibling_deps.ts';
import { itemAt } from './itemAt.ts';

/**
 * Returns a random item from the array.
 * If the array is empty, throws an error.
 */
export function pickItem<T>(items: ReadonlyArray<T>, options: Options = {}): T {
  if (items.length === 0) {
    throw new Error('Cannot pick an item from an empty array.');
  }
  return itemAt(items, Math.floor(random(options) * items.length));
}

interface Options {
  seed?: Seed | undefined;
}
