/**
 * Returns the sum two numbers, wrapping around from 0 if the result exceeds `Number.MAX_SAFE_INTEGER`.
 */
export function sumWithWrap(a: number, b: number) {
  return a > Number.MAX_SAFE_INTEGER - b ? a - Number.MAX_SAFE_INTEGER + b : a + b;
}
