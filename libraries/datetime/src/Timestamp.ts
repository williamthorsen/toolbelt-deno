import { TimeUnit } from './TimeUnit.ts';

/**
 * Represents a point in time.
 */
export class Timestamp {
  _millis: number;
  _timeUnit: TimeUnit;

  // region | Static methods
  static fromMillis(milliseconds: number): Timestamp {
    return new Timestamp(new Date(milliseconds));
  }

  static fromSeconds(seconds: number): Timestamp {
    return new Timestamp(new Date(seconds * 1000), { timeUnit: TimeUnit.Seconds });
  }
  // endregion

  // region | Public methods
  constructor(dateTime?: TimestampInput, options: { timeUnit?: TimeUnit } = {}) {
    const { timeUnit = TimeUnit.Millis } = options;
    if (dateTime instanceof Timestamp) {
      this._millis = dateTime._millis;
    } else if (dateTime) {
      this._millis = new Date(dateTime).getTime();
    } else {
      this._millis = Date.now();
    }
    this._timeUnit = timeUnit;
  }

  get millis(): number {
    return this._millis;
  }

  get seconds(): number {
    return TimeUnit.convert(this._millis, TimeUnit.Millis, TimeUnit.Seconds);
  }

  get timeUnit(): TimeUnit {
    return this._timeUnit;
  }

  clone(options: { timeUnit?: TimeUnit } = {}): Timestamp {
    return new Timestamp(this._millis, options);
  }

  public setTimeUnit(timeUnit: TimeUnit): Timestamp {
    this._timeUnit = timeUnit;
    return this;
  }

  toDate(): Date {
    return new Date(this._millis);
  }

  /**
   * Returns a timestamp in the format `YYYY-MM-DDTHH:MM[:SS[.000]]Z` (depending on the granularity).
   */
  toIsoString(options: TimestampFormatOptions = {}): string {
    const { granularity = this.timeUnit } = options;
    const isoDateTime = this.toDate().toISOString();
    switch (granularity) {
      case TimeUnit.Millis:
        return isoDateTime;
      case TimeUnit.Seconds:
        return isoDateTime.replace(/\.\d{3}Z$/, 'Z');
      case TimeUnit.Minutes:
        return isoDateTime.replace(/:\d{2}\.\d{3}Z$/, 'Z');
      case TimeUnit.Hours:
        return isoDateTime.replace(/:\d{2}:\d{2}\.\d{3}Z$/, 'Z');
      case TimeUnit.Days:
        return isoDateTime.split('T')[0];
      default:
        throw new Error(`Unexpected time unit: ${granularity}`);
    }
  }

  toLocaleDateTimeString(locales?: Intl.LocalesArgument, options?: Intl.DateTimeFormatOptions): string {
    const date = new Date(this._millis);
    return date.toLocaleDateString(locales, options) + ' ' + date.toLocaleTimeString(locales, options);
  }

  toString(): string {
    return this.toIsoString();
  }
}

// region --- Types ---
export type TimestampInput = Date | number | string | Timestamp;

interface TimestampFormatOptions {
  granularity?: TimeUnit | undefined;
}
// endregion - Types
