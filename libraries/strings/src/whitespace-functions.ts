/**
 * Converts all whitespace characters to a single space.
 */
export function condenseWhitespace(str: string): string {
  console.log({ lines: str.split('\n') });

  return str.split('\n')
    .map(condenseWhitespaceSingleLine)
    .join('\n');
}

/**
 * Removes all whitespace from a string.
 */
export function removeWhitespace(str: string): string {
  return str.replace(/\s+/g, '');
}

/**
 * Converts all whitespace characters to a single space and trims leading & trailing whitespace.
 */
export function trimWhitespace(str: string): string {
  return str.split('\n')
    .map(condenseWhitespaceSingleLine)
    .map((line) => line.trim())
    .join('\n');
}

// region | Helpers
/**
 * Converts all whitespace characters to a single space.
 */
function condenseWhitespaceSingleLine(str: string): string {
  return str.replace(/\s+/g, ' ');
}
// endregion | Helpers
