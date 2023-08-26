/**
 * Returns true if the string is a valid semver string.
 * Prerelease versions such as "1.0.0-alpha.1" are allowed.
 */
export function isValidSemver(version: string): boolean {
  return /^\d+\.\d+\.\d+(-\w+\.\d+)?$/.test(version);
}
