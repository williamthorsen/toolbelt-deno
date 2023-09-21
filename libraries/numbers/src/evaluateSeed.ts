export function evaluateSeed(seed: Seed | undefined): number | undefined {
  if (typeof seed === 'number') {
    return seed;
  } else if (checkIsRngLike(seed)) {
    return seed.next();
  } else if (seed instanceof Function) {
    return seed();
  }
  return undefined;
}

export function checkIsRngLike(seed: Seed): seed is SeededGenerator {
  return (typeof seed === 'object' && 'next' in seed && 'seed' in seed);
}

/**
 * Interface describing an object that returns a sequence of numbers.
 */
export type SeededGenerator = { next(): number; seed: number };

export type Seed = number | SeededGenerator | (() => number) | undefined;
