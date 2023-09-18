import { assert, assertEquals, assertThrows, describe, it } from '../../dev_deps.ts';
import { pickInteger } from '../pickInteger.ts';

describe('pickInteger()', () => {
  it('returns an integer', () => {
    const randomInt = pickInteger({ max: 10 });

    assert(Number.isInteger(randomInt));
  });

  it('if min is less than max, returns a value >= min and <= max', () => {
    const min = 1;
    const max = 1000;

    const randomInt = pickInteger({ min, max });

    assert(randomInt >= min, 'randomInt >= max');
    assert(randomInt <= max, 'randomInt <= max');
  });

  it('if min is one integer smaller than max, returns the truncated value of min or max', () => {
    const min = 1.1;
    const max = 2.1;

    const randomInt = pickInteger({ min, max });

    assert(
      randomInt === Math.trunc(min) ||
        randomInt === Math.trunc(max),
    );
  });

  it('if min > max, throws an error', () => {
    const min = 0;
    const max = -50;

    const throwingFn = () => pickInteger({ min, max });

    assertThrows(
      throwingFn,
      Error,
      'Invalid range: min must be less than or equal to max.',
    );
  });

  it('if min is equal to max, returns their truncated value', () => {
    const min = 1.5;
    const max = 1.5;
    const expected = 1;

    const actual = pickInteger({ min, max });

    assertEquals(actual, expected);
  });

  it('if only max argument is given, sets min=0', () => {
    const max = 10;

    const randomInt = pickInteger({ max });

    assert(randomInt >= 0, 'value >= 0');
    assert(randomInt <= max, 'value <= max');
  });

  it('if a seed is given, always returns the same value for that seed', () => {
    const params = {
      max: 10,
      seed: 1234,
    };

    const randomInt1 = pickInteger(params);
    const randomInt2 = pickInteger(params);

    assertEquals(randomInt1, randomInt2);
  });

  it('accepts a function as a seed', () => {
    const seed = 1234;
    const seedFn = () => 1234;

    const randomInt1 = pickInteger({ max: 10, seed });
    const randomInt2 = pickInteger({ max: 10, seed: seedFn });

    assertEquals(randomInt1, randomInt2);
  });

  it('if min is infinite, throws an error', () => {
    const min = -Infinity;
    const max = 10;

    const throwingFn = () => pickInteger({ min, max });

    assertThrows(
      throwingFn,
      Error,
      'Invalid range: min and max must be finite.',
    );
  });

  it('if max is infinite, throws an error', () => {
    const min = 0;
    const max = Infinity;

    const throwingFn = () => pickInteger({ min, max });

    assertThrows(
      throwingFn,
      Error,
      'Invalid range: min and max must be finite.',
    );
  });
});
