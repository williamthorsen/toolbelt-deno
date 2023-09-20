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

function checkIsRngLike(seed: Seed): seed is DeterministicRng {
  return (typeof seed === 'object' && 'next' in seed && 'seed' in seed);
}

export type DeterministicRng = { next(): number; seed: number };

export type Seed = number | DeterministicRng | (() => number) | undefined;
