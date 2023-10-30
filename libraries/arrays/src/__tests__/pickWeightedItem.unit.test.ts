import { assertEquals, assertThrows, describe, it } from '../../dev_deps.ts';
import { pickWeightedItem } from '../pickWeightedItem.ts';
import { pickItem } from '../pickItem.ts';
import { toCumulativeValues } from '../toCumulativeValues.ts';

describe('pickWeightedItem()', () => {
  it('returns one item from the array using weights', () => {
    const items = [1, 2, 3, 4];
    const weights = [1, 1, 1, 1];
    const pickItem = pickWeightedItem(items, weights);

    assertEquals(items.includes(pickItem()), true);
  });

  it('if the array has a single item, returns the item', () => {
    const items = [1];
    const weights = [1];
    const pickItem = pickWeightedItem(items, weights);

    assertEquals(pickItem(), 1);
  });

  it('accepts a read-only array', () => {
    const items = Object.freeze([1, 2, 3, 4]);
    const weights = Object.freeze([1, 1, 1, 1]);
    const pickItem = pickWeightedItem(items, weights);

    assertEquals(items.includes(pickItem()), true);
  });

  it('if the array is empty, throws an error', () => {
    const throwingFn = () => pickWeightedItem([], []);
    assertThrows(
      throwingFn,
      Error,
      'Cannot pick an item from an empty array.',
    );
  });

  it('throws an error if weights array and items array are of different lengths', () => {
    const items = [1, 2, 3, 4];
    const weights = [1, 1];
    const throwingFn = () => pickWeightedItem(items, weights);

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
    const pickItem = pickWeightedItem(items, weights);

    assertEquals(pickItem(options), pickItem(options));
  });

  it('returns results identical to pickItem when weights are uniform', () => {
    const seed = 12345;
    const items = [1, 2, 3, 4];
    const cumulativeWeights = [1, 2, 3, 4];
    const expected = pickItem(items, { seed });

    const actual = pickWeightedItem(items, cumulativeWeights)({ seed });

    assertEquals(actual, expected);
  });

  it('given an identical seed, always returns the same result', () => {
    const items = Array.from({ length: 1000 }, (_, index) => index);
    const cumulativeWeights = toCumulativeValues(items);
    const seeds = Array.from({ length: 5 }, (_, index) => index);
    const snapshot = [
      928,
      57,
      371,
      530,
      661,
    ];
    const results = seeds.map((seed) => pickWeightedItem(items, cumulativeWeights)({ seed }));

    assertEquals(results, snapshot);
  });
});
