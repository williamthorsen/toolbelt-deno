import { random } from '../../numbers/src/random.ts';
import { getWeightedIndex } from './getWeightedIndex.ts';

/**
 * Returns a pseudo-random item from the cumulative weights, with odds reflecting the cumulative weights.
 * If the array is empty, throws an error.
 */
export function pickRandomWeightedIndex(
  cumulativeWeights: ReadonlyArray<number>,
  options: Options = {},
): Integer {
  if (cumulativeWeights.length === 0) {
    throw new Error('Cannot pick an item from an empty array.');
  }

  const cumulativeWeight = cumulativeWeights[cumulativeWeights.length - 1];
  const targetWeight = random(options) * cumulativeWeight;
  // Because the array is non-empty, the target weight is guaranteed to be within the range of the
  // cumulative weights.
  return getWeightedIndex(cumulativeWeights, targetWeight) as Integer;
}

interface Options {
  seed?: number | undefined;
}

type Integer = number;
