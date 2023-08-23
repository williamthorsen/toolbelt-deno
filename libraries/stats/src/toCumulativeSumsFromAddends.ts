/**
 * Given an array of addends, returns the running total at each index.
 *
 * toCumulativeSumsFromAddends
 * toAddendsFromCumulativeSums
 */
export function toCumulativeSumsFromAddends(addends: number[]): number[] {
  if (addends.length < 1) {
    return addends;
  }

  let sum = addends[0];
  const cumulativeSums = [sum];
  for (let i = 1; i < addends.length; i++) {
    sum += addends[i];
    cumulativeSums.push(sum);
  }
  return cumulativeSums;
}
