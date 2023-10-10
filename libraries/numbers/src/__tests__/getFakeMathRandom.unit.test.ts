import { assertEquals, describe, it } from '../../dev_deps.ts';

import { getFakeMathRandom } from '../getFakeMathRandom.ts';

// Added to demonstrate that these tests also pass in the distribution bundle after transpilation

describe('getFakeMathRandom()', () => {
  const testCases = [
    { seed: 0.1, output: 0.6317939789182478 },
    { seed: 1, output: 0.0032807332478839595 },
    { seed: 1234, output: 0.06747461346326145 },
    { seed: 1235, output: 0.9604614605011704 },
    { seed: 123456789, output: 0.7337169166345694 },
  ];
  for (const { seed, output } of testCases) {
    it(`given the same seed, always returns the same value (seed ${seed})`, () => {
      assertEquals(getFakeMathRandom(seed), output);
    });
  }
});
