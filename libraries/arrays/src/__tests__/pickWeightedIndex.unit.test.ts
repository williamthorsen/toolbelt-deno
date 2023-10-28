import { assert, assertThrows, describe, it } from '../../dev_deps.ts';
import { pickWeightedIndex } from '../pickWeightedIndex.ts';

describe('pickWeightedIndex()', () => {
  it('returns an integer index from the cumulative weights array', () => {
    const cumulativeWeights = [1, 2, 3, 4];
    const index = pickWeightedIndex(cumulativeWeights);

    assert(Number.isInteger(index));
    assert(index >= 0 && index < cumulativeWeights.length);
  });

  it('if the cumulative weights array has a single element, returns the index 0', () => {
    const cumulativeWeights = [1];
    const index = pickWeightedIndex(cumulativeWeights);

    assert(Number.isInteger(index));
    assert(index === 0);
  });

  it('accepts a read-only cumulative weights array', () => {
    const cumulativeWeights = Object.freeze([1, 2, 3, 4]);
    const index = pickWeightedIndex(cumulativeWeights);

    assert(Number.isInteger(index));
    assert(index >= 0 && index < cumulativeWeights.length);
  });

  it('if the cumulative weights array is empty, throws an error', () => {
    const throwingFn = () => pickWeightedIndex([]);
    assertThrows(
      throwingFn,
      Error,
      'Cannot pick an item from an empty array.',
    );
  });

  it('if the total weight is 0, throws an error', () => {
    const throwingFn = () => pickWeightedIndex([0, 0]);
    assertThrows(
      throwingFn,
      Error,
      'Cannot pick an item from an array with total weight 0.',
    );
  });

  it('allows a seed in options to produce deterministic results', () => {
    const cumulativeWeights = [1, 2, 3, 4];
    const options = { seed: 12345 };

    const index1 = pickWeightedIndex(cumulativeWeights, options);
    const index2 = pickWeightedIndex(cumulativeWeights, options);

    assert(index1 === index2);
  });

  it('returns an index such that 0 <= index < cumulativeWeights.length', () => {
    const cumulativeWeights = [1, 2, 3, 4];
    const index = pickWeightedIndex(cumulativeWeights);

    assert(index >= 0);
    assert(index < cumulativeWeights.length);
  });
});
