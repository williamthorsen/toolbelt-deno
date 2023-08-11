import { random } from './random.ts';

/**
 * Returns a random integer between the bounds inclusive.
 * If the bounds are not integers, they are truncated to integers.
 */
export function pickRandomInt(params: Params): number {
  const { min = 0, max, seed } = params;

  if (!Number.isFinite(min) || !Number.isFinite(max)) {
    throw new Error('Invalid range: min and max must be finite.');
  }

  if (min > max) {
    throw new Error('Invalid range: min must be less than or equal to max.');
  }

  const start = Math.trunc(Math.min(min, max));
  const end = Math.trunc(Math.max(min, max));

  if (start === end) {
    return start;
  }
  const range = end - start + 1;

  return start + Math.floor(random({ seed }) * range);
}

interface Params {
  max: number;
  min?: number | undefined;
  seed?: number | undefined;
}
