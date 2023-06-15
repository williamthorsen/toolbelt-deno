import { assert, assertEquals, describe, it } from '../../dev_deps.ts';
import { scale } from '../scale.ts';

describe('scale()', () => {
  it('scales a number from default range [0, 1] to range [0, 100]', () => {
    const result = scale(0.5, { min: 0, max: 100 });
    assert(result >= 0 && result <= 100, 'Result should be between 0 and 100');
    assertEquals(result, 50);
  });

  it('scales a number from range [0, 10] to range [0, 100]', () => {
    const result = scale(5, { min: 0, max: 100 }, { min: 0, max: 10 });
    assert(result >= 0 && result <= 100, 'Result should be between 0 and 100');
    assertEquals(result, 50);
  });

  it('scales a number from range [-10, 10] to range [0, 1]', () => {
    const result = scale(0, { min: 0, max: 1 }, { min: -10, max: 10 });
    assert(result >= 0 && result <= 1, 'Result should be between 0 and 1');
    assertEquals(result, 0.5);
  });

  it('scales a number from range [0, 1] to range [-10, 10]', () => {
    const result = scale(0.5, { min: -10, max: 10 });
    assert(result >= -10 && result <= 10, 'Result should be between -10 and 10');
    assertEquals(result, 0);
  });

  it('works with negative range', () => {
    const result = scale(0.5, { min: -10, max: 0 }, { min: 0, max: 1 });
    assert(result >= -10 && result <= 0, 'Result should be between -10 and 0');
    assertEquals(result, -5);
  });

  it('works with negative values', () => {
    const result = scale(-5, { min: 0, max: 100 }, { min: -10, max: 10 });
    assert(result >= 0 && result <= 100, 'Result should be between 0 and 100');
    assertEquals(result, 25);
  });

  it('scales a value outside the fromRange to a value outside the toRange', () => {
    const result = scale(15, { min: 0, max: 100 }, { min: 0, max: 10 });
    assert(result >= 100, 'Result should be greater than 100');
    assertEquals(result, 150);
  });
});
