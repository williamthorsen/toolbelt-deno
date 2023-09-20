/**
 * Returns the sum of the given addends, wrapping around from 0 when the given max is exceeded.
 */
export function wrapSum(max: number, ...addends: number[]): number {
  return addends.reduce((sum, addend) => {
    const result = (sum + addend) % max;
    return result >= 0 ? result : result + max;
  }, 0);
}
