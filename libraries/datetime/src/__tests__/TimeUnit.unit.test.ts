import { assertEquals, assertThrows, describe, it } from '../../dev_deps.ts';

import { TimeConversionOptions, TimeUnit } from '../TimeUnit.ts';

describe('TimeUnit class', () => {
  describe('convert()', () => {
    it('should return the same amount if from and to units are the same', () => {
      const result = TimeUnit.convert(10, TimeUnit.Hours, TimeUnit.Hours);
      assertEquals(result, 10);
    });

    it('correctly converts seconds to milliseconds', () => {
      const result = TimeUnit.convert(1, TimeUnit.Seconds, TimeUnit.Milliseconds);
      assertEquals(result, 1_000);
    });

    it('rounds to the specified number of decimal places', () => {
      const options = { decimalPlaces: 0 };
      const expected = 0;

      const roundedConversion = TimeUnit.convert(1, TimeUnit.Minutes, TimeUnit.Hours, options);

      assertEquals(roundedConversion, expected);
    });

    it('if throwOnFractional=true and result is fractional, throws an error', () => {
      const options: TimeConversionOptions = { throwOnFractional: true };

      const throwingFn = () => TimeUnit.convert(1, TimeUnit.Minutes, TimeUnit.Hours, options);

      assertThrows(
        throwingFn,
        Error,
        '1 minutes cannot be converted into a whole number of hours.',
      );
    });
  });

  describe('smallestUnit()', () => {
    it('should return the smaller of the two units', () => {
      const result = TimeUnit.smallestUnit(TimeUnit.Minutes, TimeUnit.Hours);
      assertEquals(result, TimeUnit.Minutes);
    });

    it('should return the unit itself if compared with the same unit', () => {
      const result = TimeUnit.smallestUnit(TimeUnit.Days, TimeUnit.Days);
      assertEquals(result, TimeUnit.Days);
    });
  });

  describe('toString()', () => {
    it('should return the label of the unit', () => {
      assertEquals(TimeUnit.Hours.toString(), 'hours');
    });
  });
});
