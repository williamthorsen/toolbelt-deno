/**
 * Deterministically computes and returns a number in the range [0, 1) based on the input.
 * Used internally in this library. Not part of the public API.
 */
export function getFakeMathRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;

  // Get the decimal part of the number, which is in the range [-1, 1];
  // add 1 if it is negative, to change its range to [0, 1).
  return x - Math.floor(x);
}
