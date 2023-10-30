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
  assertCumulativeWeights(cumulativeWeights);

  const cumulativeWeight = cumulativeWeights[cumulativeWeights.length - 1];
  const targetWeight = random(options) * cumulativeWeight;
  // Because the array is non-empty, the target weight is guaranteed to be within the range [0, cumulativeWeight).
  return getWeightedIndex(cumulativeWeights, targetWeight) as Integer;
}

export function assertCumulativeWeights(weights: ReadonlyArray<number>, nItems = weights.length): void | never {
  if (weights.length !== nItems) {
    throw new Error('The number of weights must match the number of items.');
  }

  assertPositiveWeights(weights);
  assertAscendingWeights(weights);

  if (weights[weights.length - 1] === 0) {
    throw new Error('Cannot pick an item from an array with total weight 0.');
  }
}

/**
 * Verifies that the values in the numeric series are in ascending order.
 */
function assertAscendingWeights(values: ReadonlyArray<number>): void | never {
  for (let i = 1; i < values.length; i++) {
    if (values[i] < values[i - 1]) {
      throw new Error('Cumulative weights must be in ascending order.');
    }
  }
}

function assertPositiveWeights(weights: ReadonlyArray<number>): void | never {
  if (weights.length === 0) {
    throw new Error('Cannot pick an item from an empty array.');
  }

  if (weights.some((weight) => weight < 0)) {
    throw new Error('Weights cannot be negative.');
  }
}

export interface PickRandomOptions {
  seed?: Seed | undefined;
}

type Integer = number;
