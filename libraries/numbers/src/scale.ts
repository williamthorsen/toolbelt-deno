/**
 * Scales a number from one range to another.
 */
export function scale(value: number, toRange: Range, fromRange: Partial<Range> = {}): number {
  const { min: toMin, max: toMax } = toRange;
  const { min: fromMin = 0, max: fromMax = 1 } = fromRange;

  const fromMagnitude = fromMax - fromMin;
  const toMagnitude = toMax - toMin;

  const offset = value - fromMin;

  return toMin + offset * toMagnitude / fromMagnitude;
}

interface Range {
  min: number;
  max: number;
}
