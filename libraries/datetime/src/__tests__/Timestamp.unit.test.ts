import { assertAlmostEquals, assertEquals, assertThrows, describe, it } from '../../dev_deps.ts';
import { TimeUnit } from '../TimeUnit.ts';
import { Timestamp } from '../Timestamp.ts';

describe('Timestamp class', () => {
  describe('static fromMilliseconds()', () => {
    it('returns a Timestamp initialized with given milliseconds', () => {
      const result = Timestamp.fromMillis(1_000);
      assertEquals(result.millis, 1_000);
    });
  });

  describe('static fromSeconds()', () => {
    it('returns a Timestamp initialized with given seconds', () => {
      const result = Timestamp.fromSeconds(1);
      assertEquals(result.millis, 1_000);
    });
  });

  describe('constructor', () => {
    it('given no input, uses the current time as the timestamp', () => {
      const timestamp = new Timestamp();
      const tolerance = 2; // 2 ms - accurate enough for a test

      assertAlmostEquals(timestamp.millis, Date.now(), tolerance);
    });

    it('given a Timestamp as the input, returns a new Timestamp storing the same value', () => {
      const timestamp = Timestamp.fromSeconds(1);

      const result = new Timestamp(timestamp);

      assertEquals(result.millis, 1_000);
    });
  });

  describe('milliseconds properties', () => {
    it('returns the timestamp value in milliseconds', () => {
      const timestamp = new Timestamp(new Date(1_000));
      assertEquals(timestamp.millis, 1_000);
    });
  });

  describe('seconds property', () => {
    it('returns the timestamp value in seconds', () => {
      const timestamp = new Timestamp(new Date(1_000));
      assertEquals(timestamp.seconds, 1);
    });
  });

  describe('clone()', () => {
    it('returns a clone of the timestamp', () => {
      const original = new Timestamp(new Date(1_000));
      const clone = original.clone();

      assertEquals(clone.millis, 1_000);
      assertEquals(clone !== original, true);
    });

    it('given a timeUnit, returns a clone that uses that time unit', () => {
      const original = new Timestamp(new Date(1_000), { timeUnit: TimeUnit.Millis });

      const clone = original.clone({ timeUnit: TimeUnit.Seconds });

      assertEquals(clone.timeUnit, TimeUnit.Seconds);
      assertEquals(original.millis, clone.millis);
    });
  });

  describe('setTimeUnit()', () => {
    it('sets the time unit and without changing the stored point in time', () => {
      const timestamp = new Timestamp(new Date(1_000));
      const millis = timestamp.millis;

      timestamp.setTimeUnit(TimeUnit.Seconds);

      assertEquals(timestamp.timeUnit, TimeUnit.Seconds);
      assertEquals(timestamp.millis, millis);
    });
  });

  describe('toDate()', () => {
    it('should convert the timestamp to a Date object', () => {
      const timestamp = new Timestamp(new Date(1_000));
      const result = timestamp.toDate();

      assertEquals(result instanceof Date, true);
      assertEquals(result.getTime(), 1_000);
    });
  });

  describe('toHumaneUtcString()', () => {
    const timestamp = new Timestamp('2023-01-02T13:45:01.234Z');
    const useCases = [
      { timeUnit: TimeUnit.Millis, expectedUtc: '2023-01-02 13:45:01.234 UTC' },
      { timeUnit: TimeUnit.Seconds, expectedUtc: '2023-01-02 13:45:01 UTC' },
      { timeUnit: TimeUnit.Minutes, expectedUtc: '2023-01-02 13:45 UTC' },
      { timeUnit: TimeUnit.Days, expectedUtc: '2023-01-02 UTC' },
    ];

    for (const { expectedUtc, timeUnit } of useCases) {
      it(`when timeUnit=${timeUnit.plural}, returns ${expectedUtc}`, () => {
        const humaneUtc = timestamp.toHumaneUtcString({ timeUnit });

        assertEquals(humaneUtc, expectedUtc);
      });
    }

    it('if timeUnit=hours, throws an error', () => {
      const throwingFn = () => timestamp.toHumaneUtcString({ timeUnit: TimeUnit.Hours });

      assertThrows(throwingFn, Error, 'Method does not support TimeUnit.Hours time unit.');
    });
  });

  describe('toIsoString()', () => {
    it('returns the ISO string representation for the given time unit', () => {
      const timestamp = new Timestamp(new Date('2023-01-01T10:10:10.123Z'));

      assertEquals(timestamp.toIsoString({ timeUnit: TimeUnit.Seconds }), '2023-01-01T10:10:10Z');
      assertEquals(timestamp.toIsoString({ timeUnit: TimeUnit.Minutes }), '2023-01-01T10:10Z');
      assertEquals(timestamp.toIsoString({ timeUnit: TimeUnit.Hours }), '2023-01-01T10Z');
      assertEquals(timestamp.toIsoString({ timeUnit: TimeUnit.Days }), '2023-01-01');
    });

    it('given an unknown time unit, throws an error', () => {
      const timestamp = new Timestamp(new Date('2023-01-01T10:10:10.123Z'));

      assertThrows(
        () => timestamp.toIsoString({ timeUnit: (999 as unknown) as TimeUnit }), // using an invalid time unit
        Error,
        'Unexpected time unit',
      );
    });
  });

  describe('toLocaleDateTimeString()', () => {
    it('should return a formatted date-time string', () => {
      const timestamp = new Timestamp(new Date('2023-01-01T10:10:10.000Z'));
      const expectedDateString = timestamp.toDate().toLocaleDateString();
      const expecteTimeString = timestamp.toDate().toLocaleTimeString();
      const expectedDateTimeString = expectedDateString + ' ' + expecteTimeString;

      const result = timestamp.toLocaleDateTimeString('en-US');

      assertEquals(result, expectedDateTimeString);
    });
  });

  describe('toString()', () => {
    it('returns the ISO string representation', () => {
      const timestamp = new Timestamp(new Date('2023-01-01T10:10:10.123Z'));
      const result = timestamp.toString();

      assertEquals(result, '2023-01-01T10:10:10.123Z');
    });
  });
});
