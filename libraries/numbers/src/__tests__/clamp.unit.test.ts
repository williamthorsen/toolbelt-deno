import { assertEquals, assertThrows, describe, it } from '../../dev_deps.ts';

import { clamp } from '../clamp.ts';

describe('clamp()', () => {
  const min = 0;
  const max = 10;

  it('returns the value if it is within the range', () => {
    assertEquals(clamp(5, { min, max }), 5);
  });

  it('returns the minimum value if the value is less than the minimum', () => {
    assertEquals(clamp(-5, { min }), min);
  });

  it('returns the maximum value if the value is greater than the maximum', () => {
    assertEquals(clamp(15, { max }), max);
  });

  it('returns the value if no min or max is provided', () => {
    assertEquals(clamp(5, {}), 5);
  });

  it('throws an error if min is greater than max', () => {
    const throwingFn = () => clamp(5, { min: 10, max: 0 });

    assertThrows(
      throwingFn,
      RangeError,
      'Minimum value cannot be greater than maximum value',
    );
  });
});
