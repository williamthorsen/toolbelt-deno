/**
 * Returns a new function that replaces undefined values in the input array to the original function with a default value.
 */
export function withDefaultItemValue<TItem, TReturn, TDefault extends TItem>(
  fn: (values: ReadonlyArray<TItem>) => TReturn,
  defaultValue: TDefault,
): (values: ReadonlyArray<TItem | undefined>) => TReturn {
  return function withDefault(values: ReadonlyArray<TItem | undefined>): TReturn {
    return fn(values.map((value) => value ?? defaultValue));
  };
}
