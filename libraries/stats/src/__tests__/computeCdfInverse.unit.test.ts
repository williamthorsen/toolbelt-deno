import { assertAlmostEquals, assertThrows, describe, it } from '../../dev_deps.ts';
import { computeCdfInverse } from '../computeCdfInverse.ts';

describe('computeCdfInverse()', () => {
  const tolerance = 0.0001;
  const KNOWN_PROBABILITIES = {
    firstDecile: -1.2815515655446004,
    lastDecile: 1.2815515655446004,
  };

  it('returns the mean when given a probability of 0.5 for a standard normal distribution', () => {
    const probability = 0.5;
    const options = {
      mean: 0,
      standardDeviation: 1,
    };
    const expected = 0;

    const actual = computeCdfInverse(probability, options);

    assertAlmostEquals(actual, expected, tolerance);
  });

  it('returns a value close to known value when given a probability of 0.1', () => {
    const probability = 0.1;
    const options = {
      mean: 0,
      standardDeviation: 1,
    };
    const expected = KNOWN_PROBABILITIES.firstDecile;

    const actual = computeCdfInverse(probability, options);

    assertAlmostEquals(actual, expected, tolerance);
  });

  it('returns a value close to known value when given a probability of 0.9', () => {
    const probability = 0.9;
    const options = {
      mean: 0,
      standardDeviation: 1,
    };
    const expected = KNOWN_PROBABILITIES.lastDecile;

    const actual = computeCdfInverse(probability, options);

    assertAlmostEquals(actual, expected, tolerance);
  });

  it('if given an invalid standard deviation, should throw an error', () => {
    const probability = 0.5;
    const options = {
      mean: 0,
      standardDeviation: 0,
    };

    const throwingFn = () => computeCdfInverse(probability, options);

    assertThrows(
      throwingFn,
      Error,
      'Standard deviation must be greater than zero.',
    );
  });
});
