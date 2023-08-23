import { getNormalIntervalProbabilities } from './getNormalIntervalProbabilities.ts';
import { round } from '../../numbers/src/round.ts';

/**
 * Given a probability and a number of intervals, find the set of interval probabilities following
 * the normal distribution that has the requested probability in the first and last intervals.
 */
export function findDistributionByIntervalProbability(params: Params): NormalDistribution {
  const {
    nIntervals,
    probability,
  } = params;

  // Build a map of all distributions with the given number of intervals
  const startSd = 0.5;
  const endSd = 1.2;
  const step = 0.0005;
  const distributions: { standardDeviation: number; probability: number }[] = [];
  let standardDeviation = startSd;
  while (standardDeviation <= endSd) {
    const probabilities = getNormalIntervalProbabilities({ nIntervals, standardDeviation }).additive;
    distributions.push({
      standardDeviation: round(standardDeviation, 6),
      probability: round(probabilities[0], 6),
    });
    standardDeviation += step;
  }

  // Find the distribution whose probability in the first interval is closest to the target
  const sortedDistributions = distributions.sort((a, b) => {
    return Math.abs(probability - a.probability) - Math.abs(probability - b.probability);
  });

  // Find the distribution with the closest probability in the first interval
  const target = probability;
  const tolerance = 0.01;
  const matches = sortedDistributions
    .filter((distribution) => isWithinTolerance(target, distribution.probability, tolerance));
  if (!matches.length) {
    console.log({
      bestDistributions: sortedDistributions.slice(0, 5),
    });
    throw new Error(`No matches found for target probability ${target} within tolerance of ${tolerance * 100}%`);
  }

  return {
    standardDeviation: matches[0].standardDeviation,
    intervalProbabilities: getNormalIntervalProbabilities({
      nIntervals,
      standardDeviation: matches[0].standardDeviation,
    }),
  };
}

function isWithinTolerance(value: number, target: number, tolerance: number): boolean {
  return Math.abs(1 - value / target) < tolerance;
}

interface NormalDistribution {
  standardDeviation: number;
  intervalProbabilities: ReturnType<typeof getNormalIntervalProbabilities>;
}

interface Params {
  nIntervals: number;
  probability: number;
  tolerance?: number;
}
