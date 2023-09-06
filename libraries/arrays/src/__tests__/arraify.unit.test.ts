import { assertEquals, assertStrictEquals, describe, it } from '../../dev_deps.ts';

import { arraify } from '../arraify.ts';

describe('arraify()', () => {
  it('if input is an array, returns the same array', () => {
    const input = [1, 2, 3];
    const expectedOutput = input;

    const output = arraify(input);

    assertStrictEquals(output, expectedOutput);
  });

  it('if input is not an array, returns that value in an array', () => {
    const input = 1;
    const expectedOutput = [input];

    const output = arraify(input);

    assertEquals(output, expectedOutput);
  });

  it('if the input is an array, the return type is the same as the input type', () => {
    // Functions to test that an inferred type is correct, because the input satisfies both `T` and `T[]`.
    const arrayFn = (_value: number[]): void => {};
    const input = [1, 2, 3];

    const arraifiedInput = arraify(input);

    arrayFn(arraifiedInput);
  });
});
