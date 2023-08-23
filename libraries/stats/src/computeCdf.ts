/**
 * Returns the cumulative distribution function (CDF) for a normal distribution
 */
export function computeCdf(params: Params): number {
  const { mean, standardDeviation, value } = params;

  if (standardDeviation <= 0) {
    throw new Error('Standard deviation must be greater than zero.');
  }

  const z = (value - mean) / standardDeviation;
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp(-z * z / 2);
  const prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return (z > 0 ? 1 - prob : prob);
}

interface Params {
  mean: number;
  standardDeviation: number;
  value: number;
}
