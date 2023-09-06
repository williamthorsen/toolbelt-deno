export class TimeUnit {
  static readonly Milliseconds = new TimeUnit('millis', 1);
  static readonly Seconds = new TimeUnit('seconds', 1_000);
  static readonly Minutes = new TimeUnit('minutes', 60_000);
  static readonly Hours = new TimeUnit('hours', 3_600_000);
  static readonly Days = new TimeUnit('days', 86_400_000);

  private constructor(public readonly label: string, public readonly inMillis: number) {
    // MAX_SAFE_INTEGER is 2^53, so by representing our duration in fromMilliseconds (the lowest
    // common unit) the highest duration we can represent is
    // 2^53 / 86*10^6 ~= 104 * 10^6 fromDays (about 100 million fromDays).
  }

  public static convert(
    amount: number,
    fromUnit: TimeUnit,
    toUnit: TimeUnit,
    options: TimeConversionOptions = {},
  ): number {
    const { decimalPlaces, throwOnFractional } = options;

    if (fromUnit.inMillis === toUnit.inMillis) {
      return amount;
    }
    const multiplier = fromUnit.inMillis / toUnit.inMillis;

    const value = amount * multiplier;

    if (!Number.isInteger(value) && throwOnFractional) {
      throw new Error(`${amount} ${fromUnit} cannot be converted into a whole number of ${toUnit}.`);
    }

    if (decimalPlaces !== undefined) {
      return Math.round(value * 10 ** decimalPlaces) / 10 ** decimalPlaces;
    }

    return value;
  }

  /**
   * Returns the time unit with highest granularity
   */
  static smallestUnit(a: TimeUnit, b: TimeUnit): TimeUnit {
    return a.inMillis < b.inMillis ? a : b;
  }

  public toString(): string {
    return this.label;
  }
}

/**
 * Options for how to convert time to a different unit.
 */
export interface TimeConversionOptions {
  readonly throwOnFractional?: boolean;
  readonly decimalPlaces?: Integer;
}

type Integer = number;
