import { itemAt } from '../sibling_deps.ts';
import { computeCdf } from './computeCdf.ts';
import { toCumulativeSumsFromAddends } from './toCumulativeSumsFromAddends.ts';

/**
 * Returns the additive & cumulative percentages of data points falling within each interval of a normal distribution
 * defined by the given mean & standard deviation.
 */
export function getNormalIntervalProbabilities(params: Params): IntervalProbabilities {
  const { mean = 0, nIntervals, standardDeviation = 1 } = params;

  // Validate nIntervals
  assertPositiveInteger(nIntervals, 'nIntervals');

  if (standardDeviation === 0) {
    const uniformProbability = 1 / nIntervals;
    const additive = Array.from({ length: nIntervals }, () => uniformProbability);
    const cumulative = toCumulativeSumsFromAddends(additive);
    return { additive, cumulative };
  }

  // Define z-scores for the intervals
  const zRange = 3 * standardDeviation;
  const zScores: number[] = Array.from({ length: nIntervals + 1 }, (_, i) => -zRange + (2 * zRange * i / nIntervals));

  // Convert z-scores to actual values based on given mean and standard deviation
  const values = zScores.map((z) => mean + z * standardDeviation);

  // Compute the CDF at all boundaries, which is one greater than the number of intervals
  const cumulativeWeights = values.map((value) => computeCdf({ value, mean, standardDeviation }));

  const weights: number[] = [];
  for (let i = 1; i < cumulativeWeights.length; i++) {
    weights.push(itemAt(cumulativeWeights, i) - itemAt(cumulativeWeights, i - 1));
  }

  // Compute the weights for each interval
  const probabilities = toProbabilitiesFromWeights(weights);
  const cumulativeProbabilities = toCumulativeSumsFromAddends(probabilities);

  return {
    additive: probabilities,
    cumulative: cumulativeProbabilities,
  };
}

export function assertPositiveInteger(value: number, label: string): void | never {
  if (!Number.isInteger(value)) {
    throw new Error(`${label} must be an integer.`);
  }
  if (value < 1) {
    throw new Error(`${label} must be greater than 0.`);
  }
}

function sum(array: number[]): number {
  return array.reduce((a, b) => a + b, 0);
}

function toProbabilitiesFromWeights(weights: number[]): number[] {
  const total = sum(weights);
  return weights.map((weight) => weight / total);
}

interface Params {
  mean?: number | undefined;
  nIntervals: number;
  standardDeviation?: number | undefined;
}

interface IntervalProbabilities {
  additive: number[];
  cumulative: number[];
}
