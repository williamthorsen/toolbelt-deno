/**
 * Returns a new function that replaces undefined input to the original function with a default value.
 */
export function withDefaultInput<TInput, TReturn, TDefault extends TInput>(
  fn: (value: TInput) => TReturn,
  defaultValue: TDefault,
): (value: TInput | undefined) => TReturn {
  if (fn.length === 0) {
    throw new Error('Invalid input. The function must have one parameter.');
  }

  return function withDefault(value: TInput | undefined): TReturn {
    return fn(value ?? defaultValue);
  };
}
