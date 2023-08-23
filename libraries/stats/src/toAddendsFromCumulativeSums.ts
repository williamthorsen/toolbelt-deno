/**
 * Given an array of cumulative weights, returns the weights for each interval.
 */
export function toAddendsFromCumulativeSums(cumulativeSums: number[]): number[] {
  if (cumulativeSums.length < 1) {
    return cumulativeSums;
  }

  const addends = [cumulativeSums[0]];
  for (let i = 1; i < cumulativeSums.length; i++) {
    addends.push(cumulativeSums[i] - cumulativeSums[i - 1]);
  }
  return addends;
}
