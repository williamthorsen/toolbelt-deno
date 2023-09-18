export function evaluate<T>(input: FunctionOrValue<T>): T {
  return input instanceof Function ? input() : input;
}

export type FunctionOrValue<T> = T | (() => T);
