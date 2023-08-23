import { assertAlmostEquals, assertEquals, assertThrows, describe, it } from '../../dev_deps.ts';
import { findDistributionByIntervalProbability } from '../findDistributionByIntervalProbability.ts';
import { getNormalIntervalProbabilities } from '../getNormalIntervalProbabilities.ts';

describe('findNormalDistribution()', () => {
  const tolerance = 0.001;

  const useCases = [
    { nIntervals: 5, probability: 0.01, expectedSd: 1.186 },
    { nIntervals: 5, probability: 0.02, expectedSd: 1.090 },
    { nIntervals: 5, probability: 0.05, expectedSd: 0.93 },
    { nIntervals: 5, probability: 0.10, expectedSd: 0.752 },
    { nIntervals: 7, probability: 0.02, expectedSd: 0.957 },
    { nIntervals: 10, probability: 0.01, expectedSd: 0.9555 },
    { nIntervals: 10, probability: 0.02, expectedSd: 0.858 },
    { nIntervals: 10, probability: 0.05, expectedSd: 0.664 },
  ];

  useCases.forEach(({ nIntervals, probability, expectedSd }) => {
    it(`can find a normal distribution for ${probability} in first of ${nIntervals} intervals`, () => {
      const { intervalProbabilities, standardDeviation } = findDistributionByIntervalProbability({
        nIntervals,
        probability,
      });

      if (expectedSd) {
        assertAlmostEquals(standardDeviation, expectedSd, tolerance);
      } else {
        console.log({
          intervalProbabilities,
          standardDeviation,
        });
      }

      assertAlmostEquals(intervalProbabilities.additive[0], probability, tolerance);
      assertEquals(intervalProbabilities, getNormalIntervalProbabilities({ nIntervals, standardDeviation }));
    });
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
      `No matches found for target probability ${params.probability} within tolerance of 1%`,
    );
  });
});
