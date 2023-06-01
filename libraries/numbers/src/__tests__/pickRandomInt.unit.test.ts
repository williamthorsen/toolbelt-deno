import { assert, assertEquals, describe, it } from '../../dev_deps.ts';
import { pickRandomInt } from '../pickRandomInt.ts';

describe('pickRandomInt()', () => {
  it('if bound1 is less than bound2, returns a value >= bound1 and <= bound2', () => {
    const bound1 = 1;
    const bound2 = 1000;

    const randomInt = pickRandomInt(bound1, bound2);

    assert(randomInt >= bound1, 'randomInt >= bound2');
    assert(randomInt <= bound2, 'randomInt <= bound2');
  });

  it('if bound1 is greater than bound2, returns a value less than than bound1 and greater than bound2', () => {
    const bound1 = 1000;
    const bound2 = 1;

    const randomInt = pickRandomInt(bound1, bound2);

    assert(randomInt <= bound1, 'randomInt <= bound2');
    assert(randomInt >= bound2, 'randomInt >= bound2');
  });

  it('if bound1 is one integer larger or smaller than bound2, returns either the truncated value of bound1 or bound2', () => {
    const bound1 = 1.1;
    const bound2 = 2.1;

    const randomInt = pickRandomInt(bound1, bound2);

    assert(
      randomInt === Math.trunc(bound1) ||
        randomInt === Math.trunc(bound2),
    );
  });

  it('works with negative numbers', () => {
    const bound1 = 0;
    const bound2 = -50;

    const randomInt = pickRandomInt(bound1, bound2);

    assert(randomInt <= bound1, 'randomInt <= bound2');
    assert(randomInt >= bound2, 'randomInt >= bound2');
  });

  it('if bound1 is equal to bound2, returns their truncated value', () => {
    const bound1 = 1.5;
    const bound2 = 1.5;
    const expected = 1;

    const actual = pickRandomInt(bound1, bound2);

    assertEquals(actual, expected);
  });

  it('if only one argument is given, treats the other bound as 0', () => {
    const bound = -10;

    const randomInt = pickRandomInt(bound);

    assert(randomInt >= bound, 'value >= bound');
    assert(randomInt <= 0, 'value <= 0');
  });
});
