import { TimeUnit } from './TimeUnit.ts';

/**
 * Represents a point in time.
 */
export class Timestamp {
  _format: TimestampFormatEnum;
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
  constructor(dateTime?: TimestampInput, options: TimestampOptions = {}) {
    const { format = 'iso', timeUnit = TimeUnit.Millis } = options;
    if (dateTime instanceof Timestamp) {
      this._millis = dateTime._millis;
    } else if (dateTime) {
      this._millis = new Date(dateTime).getTime();
    } else {
      this._millis = Date.now();
    }
    this._format = format;
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

  clone(options: TimestampOptions = {}): Timestamp {
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
   * Returns a timestamp in the format `YYYY-MM-DD HH:MM[:SS[.000]] UTC` (depending on the time unit).
   * It is the same format as `Date.toISOString()` but with a space instead of a `T` and ` UTC` instead of `Z`.
   * This date format is human-readable, sortable, and accepted by the Date constructor.
   * TODO: Decide how to handle hours.
   */
  toHumaneUtcString(options: TimestampOptions = {}): string {
    const { timeUnit = this.timeUnit } = options;

    if (timeUnit === TimeUnit.Hours) {
      throw new Error('Method does not support TimeUnit.Hours time unit.');
    }

    const isoString = this.toIsoString({ timeUnit });
    if (timeUnit.inMillis <= TimeUnit.Minutes.inMillis) {
      return isoString
        .replace(/T/, ' ')
        .replace(/Z$/, ' UTC');
    }
    return `${isoString} UTC`;
  }

  /**
   * Returns a timestamp in the format `YYYY-MM-DDTHH:MM[:SS[.000]]Z` (depending on the time unit).
   */
  toIsoString(options: Omit<TimestampOptions, 'format'> = {}): string {
    const { timeUnit = this.timeUnit } = options;
    const isoDateTime = this.toDate().toISOString();
    switch (timeUnit) {
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
        throw new Error(`Unexpected time unit: ${timeUnit}`);
    }
  }

  toLocaleDateTimeString(locales?: Intl.LocalesArgument, options?: Intl.DateTimeFormatOptions): string {
    const date = new Date(this._millis);
    return date.toLocaleDateString(locales, options) + ' ' + date.toLocaleTimeString(locales, options);
  }

  toString(options: TimestampOptions = {}): string {
    const {
      format = this._format,
      timeUnit = this._timeUnit,
    } = options;
    if (format === 'humane') {
      return this.toHumaneUtcString({ timeUnit });
    }
    return this.toIsoString({ timeUnit });
  }
}

// region --- Types ---
type TimestampFormatEnum = 'humane' | 'iso';

export type TimestampInput = Date | number | string | Timestamp;

interface TimestampOptions {
  format?: TimestampFormatEnum;
  timeUnit?: TimeUnit | undefined;
}
// endregion - Types
