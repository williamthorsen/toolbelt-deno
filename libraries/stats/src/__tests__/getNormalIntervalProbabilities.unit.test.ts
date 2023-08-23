import { assertAlmostEquals, assertThrows, describe, it } from '../../dev_deps.ts';
import { getNormalIntervalProbabilities } from '../getNormalIntervalProbabilities.ts';

describe('getIntervalWeights()', () => {
  const tolerance = 0.0001;

  it('returns a symmetrical array of probabilities when nIntervals is odd', () => {
    const params = {
      mean: 0,
      standardDeviation: 1,
      nIntervals: 5,
    };

    const { additive } = getNormalIntervalProbabilities(params);

    assertAlmostEquals(additive[0], additive[4], tolerance);
    assertAlmostEquals(additive[1], additive[3], tolerance);
  });

  it('returns a symmetrical array of probabilities when nIntervals is even', () => {
    const params = {
      mean: 0,
      standardDeviation: 1,
      nIntervals: 4,
    };

    const { additive } = getNormalIntervalProbabilities(params);

    assertAlmostEquals(additive[0], additive[3], tolerance);
    assertAlmostEquals(additive[1], additive[2], tolerance);
  });

  it('returns a cumulative probability of approximately 1', () => {
    const params = {
      mean: 0,
      standardDeviation: 0.8968,
      nIntervals: 2,
    };

    const { additive, cumulative } = getNormalIntervalProbabilities(params);

    assertAlmostEquals(cumulative[params.nIntervals - 1], 1, tolerance);
    assertAlmostEquals(sum(additive), 1, tolerance);
  });

  it('if nIntervals=1, returns additive & cumulative probabilities of [1]', () => {
    const params = {
      mean: 0,
      standardDeviation: 1,
      nIntervals: 1,
    };

    const { additive, cumulative } = getNormalIntervalProbabilities(params);

    assertAlmostEquals(additive[0], 1, tolerance);
    assertAlmostEquals(cumulative[0], 1, tolerance);
  });

  it('if nIntervals is not an integer, throws an error', () => {
    const params = {
      mean: 0,
      standardDeviation: 1,
      nIntervals: 1.5,
    };

    const throwingFn = () => getNormalIntervalProbabilities(params);

    assertThrows(
      throwingFn,
      Error,
      'nIntervals must be an integer.',
    );
  });

  it('if nIntervals < 1, throws an error', () => {
    const params = {
      mean: 0,
      standardDeviation: 1,
      nIntervals: 0,
    };

    const throwingFn = () => getNormalIntervalProbabilities(params);

    assertThrows(
      throwingFn,
      Error,
      'nIntervals must be greater than 0.',
    );
  });
});

function sum(array: number[]): number {
  return array.reduce((a, b) => a + b, 0);
}
