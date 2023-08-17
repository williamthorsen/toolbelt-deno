export function getCumulativeWeights(weights: ReadonlyArray<number | undefined>): Array<number> {
  const cumulativeWeights: number[] = [];
  let cumulativeWeight = 0;

  for (const weight of weights) {
    const addend = weight ?? 0;
    if (addend < 0) {
      throw new Error('All weights must be non-negative numbers.');
    }

    cumulativeWeight += addend;
    cumulativeWeights.push(cumulativeWeight);
  }

  return cumulativeWeights;
}
