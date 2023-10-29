/**
 * Returns an array in which each element contains the running total of the input array up to the same index.
 * Undefined values are treated as 0.
 */
export function toCumulativeValues(values: ReadonlyArray<number | undefined>): number[] {
  const cumulativeValues: number[] = [];
  let cumulativeValue = 0;

  for (const weight of values) {
    cumulativeValue += weight ?? 0;
    cumulativeValues.push(cumulativeValue);
  }

  return cumulativeValues;
}

/** @deprecated Use `toCumulativeValues` */
export const getCumulativeWeights = toCumulativeValues;
