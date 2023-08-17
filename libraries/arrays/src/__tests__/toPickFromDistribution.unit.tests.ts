import { assertEquals, assertThrows, describe, it } from '../../dev_deps.ts';
import { toPickFromDistribution } from './toPickFromDistribution.ts';
import type { PickRandomOptions } from './pickWeightedIndex.ts';

describe('toPickFromDistribution()', () => {

  it('returns a function that picks an item based on weights', () => {
    const items = ['a', 'b', 'c'];
    const distribution = { 'a': 1, 'b': 2, 'c': 3 };
    const options = { getName: (item: string) => item };

    const pickFromDistribution = toPickFromDistribution(items, distribution, options);

    let pickedItem = pickFromDistribution();
    assertEquals(typeof pickedItem, 'string');
    assertEquals(items.includes(pickedItem), true);
  });

  it('picks an item using a custom default weight', () => {
    const items = ['a', 'b', 'c'];
    const distribution = { 'a': 1, 'b': 0 };
    const options = { defaultWeight: 3, getName: (item: string) => item };

    const pickFromDistribution = toPickFromDistribution(items, distribution, options);

    let pickedItem = pickFromDistribution();
    assertEquals(items.includes(pickedItem), true);
  });

  it('excludes items with zero or negative weights', () => {
    const items = ['a', 'b', 'c'];
    const distribution = { 'a': 1, 'b': 0, 'c': -1 };
    const options = { getName: (item: string) => item };

    const pickFromDistribution = toPickFromDistribution(items, distribution, options);

    let pickedItem = pickFromDistribution();
    assertEquals(pickedItem, 'a');
  });

  it('accepts read-only arrays', () => {
    const items = Object.freeze(['a', 'b', 'c']);
    const distribution = { 'a': 1, 'b': 2, 'c': 3 };
    const options = { getName: (item: string) => item };

    const pickFromDistribution = toPickFromDistribution(items, distribution, options);

    let pickedItem = pickFromDistribution();
    assertEquals(items.includes(pickedItem), true);
  });

  it('throws an error if all weights are zero or negative', () => {
    const items = ['a', 'b', 'c'];
    const distribution = { 'a': 0, 'b': -1, 'c': -2 };
    const options = { getName: (item: string) => item };

    const throwingFn = () => toPickFromDistribution(items, distribution, options);

    assertThrows(
      throwingFn,
      Error,
      'Cannot create function with an empty array.'
    );
  });

  it('throws an error if the items array is empty', () => {
    const items: string[] = [];
    const distribution = { 'a': 1, 'b': 2, 'c': 3 };
    const options = { getName: (item: string) => item };

    const throwingFn = () => toPickFromDistribution(items, distribution, options);

    assertThrows(
      throwingFn,
      Error,
      'Cannot create function with an empty array.'
    );
  });

  it('accepts and uses PickRandomOptions when picking an item', () => {
    const items = ['a', 'b', 'c'];
    const distribution = { 'a': 1, 'b': 2, 'c': 3 };
    const options = { getName: (item: string) => item };
    const pickOptions: PickRandomOptions = {/* mock some options */};

    const pickFromDistribution = toPickFromDistribution(items, distribution, options);

    let pickedItem = pickFromDistribution(pickOptions);
    assertEquals(typeof pickedItem, 'string');
    assertEquals(items.includes(pickedItem), true);
  });

});
