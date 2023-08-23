import { assertAlmostEquals, assertThrows, describe, it } from '../../dev_deps.ts';
import { computeCdf } from '../computeCdf.ts';

describe('computeCdf()', () => {
  const tolerance = 0.0001;

  it('returns a number very close to 0.5 when given a standard normal distribution', () => {
    const params = {
      mean: 0,
      standardDeviation: 1,
      value: 0,
    };
    const expected = 0.5;

    const actual = computeCdf(params);

    assertAlmostEquals(actual, expected, tolerance);
  });

  it('should return a number very close to zero when given a large negative value', () => {
    const params = {
      mean: 0,
      standardDeviation: 1,
      value: -10000,
    };
    const expected = 0;

    const actual = computeCdf(params);

    assertAlmostEquals(actual, expected, tolerance);
  });

  it('returns a number very close to 1 when given a large positive value', () => {
    const params = {
      mean: 0,
      standardDeviation: 1,
      value: 10000,
    };
    const expected = 1;

    const actual = computeCdf(params);

    assertAlmostEquals(actual, expected, tolerance);
  });

  it('if given an invalid standard deviation, should throw an error', () => {
    const params = {
      mean: 0,
      standardDeviation: 0,
      value: 0,
    };

    const throwingFn = () => computeCdf(params);

    assertThrows(
      throwingFn,
      Error,
      'Standard deviation must be greater than zero.',
    );
  });
});
