import type { Seed } from '../sibling_deps.ts';
import { random } from '../sibling_deps.ts';
import { getWeightedIndex } from './getWeightedIndex.ts';

/**
 * Returns a pseudo-random item from the cumulative weights, with odds reflecting the cumulative weights.
 * If the array is empty, throws an error.
 */
export function pickWeightedIndex(
  cumulativeWeights: ReadonlyArray<number>,
  options: PickRandomOptions = {},
): Integer {
  assertCumulativeWeightsAreValid(cumulativeWeights);

  const cumulativeWeight = cumulativeWeights[cumulativeWeights.length - 1];
  const targetWeight = random(options) * cumulativeWeight;
  // Because the array is non-empty, the target weight is guaranteed to be within the range of the
  // cumulative weights.
  return getWeightedIndex(cumulativeWeights, targetWeight) as Integer;
}

export function assertCumulativeWeightsAreValid(cumulativeWeights: ReadonlyArray<number>): void | never {
  if (cumulativeWeights.length === 0) {
    throw new Error('Cannot pick an item from an empty array.');
  }

  if (cumulativeWeights[cumulativeWeights.length - 1] === 0) {
    throw new Error('Cannot pick an item from an array with total weight 0.');
  }
}

export interface PickRandomOptions {
  seed?: Seed | undefined;
}

type Integer = number;
