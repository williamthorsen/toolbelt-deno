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

  describe('setOptions()', () => {
    it('optionally sets the default format', () => {
      const timestamp = new Timestamp(new Date(1_000));
      const format = 'humane';

      timestamp.setOptions({ format });

      assertEquals(timestamp.format, format);
    });

    it('optionally sets the instance\'s time unit; does not change the stored point in time', () => {
      const timestamp = new Timestamp(new Date(1_000));
      const millis = timestamp.millis;

      timestamp.setOptions({ timeUnit: TimeUnit.Seconds });

      assertEquals(timestamp.timeUnit, TimeUnit.Seconds);
      assertEquals(timestamp.millis, millis);
    });
  });

  describe('toCompactString()', () => {
    const useCases = [
      { timeUnit: TimeUnit.Minutes, expected: '20230102-1345' },
      { timeUnit: TimeUnit.Seconds, expected: '20230102-134501' },
      { timeUnit: TimeUnit.Millis, expected: '20230102-134501.234' },
    ];
    for (const { expected, timeUnit } of useCases) {
      it(`when timeUnit=${timeUnit.plural}, returns a string like ${expected}`, () => {
        const timestamp = new Timestamp('2023-01-02T13:45:01.234Z', { timeUnit });

        const actual = timestamp.toCompactString();

        assertEquals(actual, expected);
      });
    }
  });

  describe('toDate()', () => {
    it('returns a Date object representing point in time stored in the Timestamp', () => {
      const timestamp = new Timestamp(new Date(1_000));

      const actual = timestamp.toDate();

      assertEquals(actual instanceof Date, true);
      assertEquals(actual.getTime(), 1_000);
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
      it(`when timeUnit=${timeUnit.plural}, returns a string like ${expectedUtc}`, () => {
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
    const displayableTimeUnits = [TimeUnit.Millis, TimeUnit.Seconds, TimeUnit.Minutes, TimeUnit.Days];
    const isoDateTime = '2023-01-02T13:45:01.234Z';

    it('returns the default string representation', () => {
      const timestamp = new Timestamp(isoDateTime);
      const expected = isoDateTime;

      const actual = timestamp.toString();

      assertEquals(actual, expected);
    });

    it('if timeUnit has been set, uses that granularity', () => {
      const options = { timeUnit: TimeUnit.Seconds };
      const timestamp = new Timestamp(isoDateTime, options);
      const expected = '2023-01-02T13:45:01Z';

      const actual = timestamp.toString();

      assertEquals(actual, expected);
    });

    it('if timeUnit is specified, uses that granularity', () => {
      const instanceOptions = { timeUnit: TimeUnit.Seconds };
      const callOptions = { timeUnit: TimeUnit.Minutes };
      const timestamp = new Timestamp(isoDateTime, instanceOptions);
      const expected = '2023-01-02T13:45Z';

      const actual = timestamp.toString(callOptions);

      assertEquals(actual, expected);
    });

    it('if format=compact, returns the same result as toCompactString()', () => {
      const timestamp = new Timestamp(isoDateTime);
      for (const timeUnit of displayableTimeUnits) {
        const expected = timestamp.toCompactString({ timeUnit });
        const actual = timestamp.toString({ format: 'compact', timeUnit });
        assertEquals(actual, expected);
      }
    });

    it('if format=humane, returns the same result as toHumaneUtcString()', () => {
      const timestamp = new Timestamp(isoDateTime);
      for (const timeUnit of displayableTimeUnits) {
        const expected = timestamp.toHumaneUtcString({ timeUnit });
        const actual = timestamp.toString({ format: 'humane', timeUnit });
        assertEquals(actual, expected);
      }
    });
  });
});
