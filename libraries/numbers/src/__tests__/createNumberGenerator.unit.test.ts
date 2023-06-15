import { assert, assertEquals, assertNotEquals, describe, it } from '../../dev_deps.ts';
import { createNumberGenerator } from '../createNumberGenerator.ts';

describe('createNumberGenerator', () => {
  it('returns a function', () => {
    const generator = createNumberGenerator(1);
    assertEquals(typeof generator, 'function');
  });

  it('given the same seed, returns the same series of numbers', () => {
    const generator1 = createNumberGenerator(1);
    const generator2 = createNumberGenerator(1);

    const values1 = [
      generator1({ min: 0, max: 10 }),
      generator1({ min: 0, max: 10 }),
      generator1({ min: 0, max: 10 }),
    ];
    const values2 = [
      generator2({ min: 0, max: 10 }),
      generator2({ min: 0, max: 10 }),
      generator2({ min: 0, max: 10 }),
    ];

    assertNotEquals(generator1, generator2);
    assertEquals(values1, values2);
  });

  it('returns different value for different seed', () => {
    const generator1 = createNumberGenerator(1);
    const generator2 = createNumberGenerator(2);

    assertNotEquals(generator1({ min: 0, max: 10 }), generator2({ min: 0, max: 10 }));
  });

  it('returns values within specified range', () => {
    const generator = createNumberGenerator(1);
    const result = generator({ min: 10, max: 20 });
    assert(result >= 10 && result < 20);
  });

  it('works with a seed close to Math.PI (implementation detail)', () => {
    const seed = 3 * Math.PI - 0.0001;

    const generator = createNumberGenerator(seed);
    const result = generator({ min: 10, max: 20 });

    assert(result >= 10 && result < 20);
  });
});
