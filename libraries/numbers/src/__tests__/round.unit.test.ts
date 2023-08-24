import { assertEquals, describe, it } from '../../dev_deps.ts';
import { round } from '../round.ts';

describe('round()', () => {
  it('by default rounds to the nearest integer', () => {
    const input = 1.5;
    const expected = 2;

    const actual = round(input);

    assertEquals(actual, expected);
  });

  it('if given precision=2, rounds to 2 decimal places', () => {
    const input = 1.555;
    const expected = 1.56;

    const actual = round(input, 2);

    assertEquals(actual, expected);
  });

  it('if given precision=-1, rounds to the nearest 10', () => {
    const input = 15;
    const expected = 20;

    const actual = round(input, -1);

    assertEquals(actual, expected);
  });
});
