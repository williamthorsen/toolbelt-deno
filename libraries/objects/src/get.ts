/**
 * Returns a function that returns the value mapped to a key.
 */
export function get<TKey extends string>(prop: TKey) {
  return function <TObj extends Partial<Record<TKey, unknown>>>(
    value: TObj,
  ): TObj[TKey] {
    return value[prop];
  };
}
