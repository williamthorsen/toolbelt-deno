import { TimeUnit } from './TimeUnit.ts';

/**
 * Represents a point in time.
 */
export class Timestamp {
  _milliseconds: number;
  _timeUnit: TimeUnit;

  // region | Static methods
  static fromMilliseconds(milliseconds: number): Timestamp {
    return new Timestamp(new Date(milliseconds));
  }

  static fromSeconds(seconds: number): Timestamp {
    return new Timestamp(new Date(seconds * 1000), { timeUnit: TimeUnit.Seconds });
  }
  // endregion

  // region | Public methods
  constructor(dateTime?: TimestampInput, options: { timeUnit?: TimeUnit } = {}) {
    const { timeUnit = TimeUnit.Milliseconds } = options;
    if (dateTime instanceof Timestamp) {
      this._milliseconds = dateTime._milliseconds;
    } else if (dateTime) {
      this._milliseconds = new Date(dateTime).getTime();
    } else {
      this._milliseconds = Date.now();
    }
    this._timeUnit = timeUnit;
  }

  get milliseconds(): number {
    return this._milliseconds;
  }

  /**
   * Alias for `milliseconds`.
   */
  get ms(): number {
    return this._milliseconds;
  }

  get seconds(): number {
    return TimeUnit.convert(this._milliseconds, TimeUnit.Milliseconds, TimeUnit.Seconds);
  }

  get timeUnit(): TimeUnit {
    return this._timeUnit;
  }

  clone(options: { timeUnit?: TimeUnit } = {}): Timestamp {
    return new Timestamp(this._milliseconds, options);
  }

  public setTimeUnit(timeUnit: TimeUnit): Timestamp {
    this._timeUnit = timeUnit;
    return this;
  }

  toDate(): Date {
    return new Date(this._milliseconds);
  }

  toLocaleDateTimeString(locales?: Intl.LocalesArgument, options?: Intl.DateTimeFormatOptions): string {
    const date = new Date(this._milliseconds);
    return date.toLocaleDateString(locales, options) + ' ' + date.toLocaleTimeString(locales, options);
  }

  toIsoString(options: { granularity?: TimeUnit } = {}): string {
    const { granularity = this.timeUnit } = options;
    const isoDateTime = this.toDate().toISOString();
    switch (granularity) {
      case TimeUnit.Milliseconds:
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

  toString(): string {
    return this.toIsoString();
  }
}

// region --- Types ---
export type TimestampInput = Date | number | string | Timestamp;
// endregion - Types
