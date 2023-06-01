/**
 * Returns a random integer between the bounds inclusive.
 * If the bounds are not integers, they are truncated to integers.
 */
export function pickRandomInt(bound1: number, bound2 = 0): number {
  const start = Math.trunc(Math.min(bound1, bound2));
  const end = Math.trunc(Math.max(bound1, bound2));

  const range = end - start + 1;

  return start + Math.floor(Math.random() * range);
}
