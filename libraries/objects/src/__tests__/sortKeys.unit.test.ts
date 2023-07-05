import { assertEquals, describe, it } from '../../dev_deps.ts';
import { sortKeys } from '../sortKeys.ts';

describe('sortKeys()', () => {
  it('sorts keys in a flat object', () => {
    const input = { z: 1, a: 2, m: 3 };
    const expectedOutput = { a: 2, m: 3, z: 1 };

    const actualOutput = sortKeys(input);

    assertEquals(actualOutput, expectedOutput);
  });

  it('does not try to sort the keys of objects other than plain objects', () => {
    const input = new Date();
    const expectedOutput = input;

    // deno-lint-ignore no-explicit-any
    const actualOutput = sortKeys(input as any);

    assertEquals(actualOutput, expectedOutput);
  });

  it('sorts with a custom compare function', () => {
    const input = { z: 1, a: 2, m: 3 };
    const expectedOutput = { z: 1, m: 3, a: 2 };
    const compare = (keyA: string, keyB: string) => keyB.localeCompare(keyA);

    const actualOutput = sortKeys(input, compare);

    assertEquals(actualOutput, expectedOutput);
  });
});
