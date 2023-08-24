import { assertAlmostEquals, assertEquals, assertThrows, describe, it } from '../../dev_deps.ts';
import { findDistributionByIntervalProbability } from '../findDistributionByIntervalProbability.ts';
import { getNormalIntervalProbabilities } from '../getNormalIntervalProbabilities.ts';
import { round } from '../../../numbers/src/round.ts';

describe('findNormalDistribution()', () => {
  const tolerance = 0.001;

  const useCases = [
    // Test ordinary values
    { nIntervals: 5, probability: 0.001, expectedSd: 1.432 },
    { nIntervals: 5, probability: 0.01, expectedSd: 1.186 },
    { nIntervals: 5, probability: 0.05, expectedSd: 0.930 },
    { nIntervals: 5, probability: 0.1, expectedSd: 0.753 },
    // Test extreme minimums
    { nIntervals: 5, probability: 0.0000001, expectedSd: 3 },
    { nIntervals: 10, probability: 0.000001, expectedSd: 3 },
  ];

  useCases.forEach(({ nIntervals, probability, expectedSd }) => {
    it(`can find a normal distribution for ${probability} in first of ${nIntervals} intervals`, () => {
      const distribution = findDistributionByIntervalProbability({
        nIntervals,
        probability,
      });
      const { divergenceFromTarget, intervalProbabilities, standardDeviation } = distribution;

      if (expectedSd) {
        assertAlmostEquals(standardDeviation, expectedSd, tolerance);
      } else {
        // TODO: Remove this console.log
        console.log({
          ...distribution,
          divergenceFromTarget: `${divergenceFromTarget ? round(divergenceFromTarget * 100, 3) : 0}%`,
        });
      }

      assertAlmostEquals(intervalProbabilities.additive[0], probability, tolerance);
      assertEquals(intervalProbabilities, getNormalIntervalProbabilities({ nIntervals, standardDeviation }));
    });
  });

  it('if probability is within the tolerance of uniform probability, returns uniform probabilities', () => {
    const nIntervals = 5;
    const probability = 0.199995;
    const expectedProbabilities = new Array(5).fill(0.2);

    const actualProbabilities = findDistributionByIntervalProbability({
      nIntervals,
      probability,
    }).intervalProbabilities.additive;

    assertEquals(actualProbabilities, expectedProbabilities);
    assertEquals(actualProbabilities, getNormalIntervalProbabilities({ nIntervals, standardDeviation: 0 }).additive);
  });

  it('if a matching distribution cannot be found, throws an error', () => {
    const params = {
      nIntervals: 3,
      probability: 0.4, // Even if distribution is uniform, this probability is not possible with 3 intervals
    };

    const throwingFn = () => findDistributionByIntervalProbability(params);

    assertThrows(
      throwingFn,
      Error,
      'Probability cannot be greater than a uniform probability',
    );
  });

  it('if given a bad standard-deviation range, throws an error', () => {
    const params = {
      nIntervals: 5,
      probability: 0.1,
      sdMin: 1,
      sdMax: 0.5,
    };

    const throwingFn = () => findDistributionByIntervalProbability(params);

    assertThrows(
      throwingFn,
      Error,
      'Maximum standard deviation (sdMax) must be greater than minimum (sdMin).',
    );
  });

  it('if given a standard-deviation range that does not include the requested probability, throws an error', () => {
    const params = {
      nIntervals: 5,
      probability: 0.1, // matches an SD of 0.753, which the below range does not include
      sdMin: 0.4,
      sdMax: 0.5,
    };

    const throwingFn = () => findDistributionByIntervalProbability(params);

    assertThrows(
      throwingFn,
      Error,
      'Cannot find requested probability with standard deviation in range [0.4, 0.5]',
    );
  });
});
