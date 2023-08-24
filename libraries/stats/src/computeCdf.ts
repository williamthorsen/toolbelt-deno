import { Gaussian } from '../deps.ts';

/**
 * Returns the cumulative distribution function (CDF) for a normal distribution
 */
export function computeCdf(params: Params): number {
  const { mean = 0, standardDeviation = 1, value } = params;

  if (standardDeviation <= 0) {
    throw new Error('Standard deviation must be greater than zero.');
  }

  const distribution = new Gaussian(mean, standardDeviation);

  return distribution.cdf(value);
}

interface Params {
  mean?: number;
  standardDeviation?: number;
  value: number;
}
