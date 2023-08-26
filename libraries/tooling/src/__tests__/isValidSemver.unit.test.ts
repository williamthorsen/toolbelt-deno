import { assertEquals, describe, it } from '../../dev_deps.ts';
import { isValidSemver } from '../isValidSemver.ts';

describe('isValidSemver()', () => {
  it('if the semver is valid, returns true', () => {
    const semver = '1.0.0-alpha.1';
    const isValid = isValidSemver(semver);

    assertEquals(isValid, true);
  });

  for (const badSemver of ['1.0.', '1.0.0--alpha', '1.0.0-', '1.0.a']) {
    it(`if the semver is malformed like ${badSemver}, returns false`, () => {
      const isValid = isValidSemver(badSemver);

      assertEquals(isValid, false);
    });
  }
});
