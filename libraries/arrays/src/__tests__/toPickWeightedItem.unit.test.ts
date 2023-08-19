import { assertEquals, assertThrows, describe, it } from '../../dev_deps.ts';
import { toPickWeightedItem } from '../toPickWeightedItem.ts';

describe('toPickWeightedItem()', () => {
  it('returns one item from the array using weights', () => {
    const items = [1, 2, 3, 4];
    const weights = [1, 1, 1, 1];
    const pickItem = toPickWeightedItem(items, weights);

    assertEquals(items.includes(pickItem()), true);
  });

  it('if the array has a single item, returns the item', () => {
    const items = [1];
    const weights = [1];
    const pickItem = toPickWeightedItem(items, weights);

    assertEquals(pickItem(), 1);
  });

  it('accepts a read-only array', () => {
    const items = Object.freeze([1, 2, 3, 4]);
    const weights = Object.freeze([1, 1, 1, 1]);
    const pickItem = toPickWeightedItem(items, weights);

    assertEquals(items.includes(pickItem()), true);
  });

  it('if the array is empty, throws an error', () => {
    const throwingFn = () => toPickWeightedItem([], []);
    assertThrows(
      throwingFn,
      Error,
      'Cannot create function with an empty array.',
    );
  });

  it('throws an error if weights array and items array are of different lengths', () => {
    const items = [1, 2, 3, 4];
    const weights = [1, 1];
    const throwingFn = () => toPickWeightedItem(items, weights);

    assertThrows(
      throwingFn,
      Error,
      'The number of weights must match the number of items.',
    );
  });

  it('allows a seed in options to produce deterministic results', () => {
    const items = [1, 2, 3, 4];
    const weights = [1, 1, 1, 1];
    const options = { seed: 12345 };
    const pickItem = toPickWeightedItem(items, weights);

    assertEquals(pickItem(options), pickItem(options));
  });
});
