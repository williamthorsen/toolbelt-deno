/**
 * Asserts that a condition is true, throwing an error if it is not.
 * Optionally displays a custom message in the error.
 */
export function assert(condition: unknown, message?: string): asserts condition {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

