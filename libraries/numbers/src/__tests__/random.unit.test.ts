import { afterEach, assert, assertEquals, beforeEach, describe, it } from '../../dev_deps.ts';
import { random } from '../random.ts';

describe('random()', () => {
  it('given the same seed, returns the same output', () => {
    const seed = 1234;
    const random1 = random({ seed });
    const random2 = random({ seed });

    assertEquals(random1, random2);
  });

  it('accepts a function as a seed', () => {
    const seed = 1234;
    const seedFn = () => 1234;

    const random1 = random({ seed });
    const random2 = random({ seed: seedFn });

    assertEquals(random1, random2);
  });
});

describe('random() with mocked Math.random', () => {
  // Backup of the original Math.random
  const originalRandom = Math.random;

  beforeEach(() => {
    // Mock Math.random to return a known value
    Math.random = () => 0.5;
  });

  afterEach(() => {
    // Restore the original Math.random after each test
    Math.random = originalRandom;
  });

  it('returns a number within the default range [0, 1]', () => {
    const result = random();
    assert(result === 0.5, `Expected 0.5, got ${result}`);
  });

  it('returns a number within the specified range', () => {
    const min = 10;
    const max = 20;
    const result = random({ min, max });
    assert(result === 15, `Expected 15, got ${result}`);
  });

  it('returns a number within a negative range', () => {
    const min = -20;
    const max = -10;
    const result = random({ min, max });
    assert(result === -15, `Expected -15, got ${result}`);
  });

  it('works when the min is greater than the max', () => {
    const min = 10;
    const max = 5;
    const result = random({ min, max });
    assert(result === 7.5, `Expected 7.5, got ${result}`);
  });

  it('returns min when min and max are equal', () => {
    const min = 5;
    const max = 5;
    const result = random({ min, max });
    assert(result === min, `Expected ${min}, got ${result}`);
  });
});
