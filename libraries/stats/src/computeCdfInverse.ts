import { Gaussian } from '../deps.ts';

/**
 * Returns the inverse of the cumulative distribution function (CDF) for a normal distribution
 */
export function computeCdfInverse(probability: number, options: Options): number {
  const {
    mean = 0,
    standardDeviation = 1,
  } = options;

  if (standardDeviation <= 0) {
    throw new Error('Standard deviation must be greater than zero.');
  }

  const distribution = new Gaussian(mean, standardDeviation);

  return distribution.ppf(probability);
}

interface Options {
  standardDeviation?: number | undefined;
  mean?: number | undefined;
}
