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
      generator1(),
      generator1(),
      generator1(),
    ];
    const values2 = [
      generator2(),
      generator2(),
      generator2(),
    ];

    assertNotEquals(generator1, generator2);
    assertEquals(values1, values2);
  });

  it('returns different value for different seed', () => {
    const generator1 = createNumberGenerator(1);
    const generator2 = createNumberGenerator(2);

    assertNotEquals(generator1(), generator2());
  });

  it('returns values within the [0, -1)', () => {
    const generator = createNumberGenerator(1);
    const result = generator();
    assert(result >= 0 && result < 1);
  });
});
