// Ignore the warning about `Function`: We do want to exclude all functions and classes!
// deno-lint-ignore ban-types
export type StrictObject<T> = T extends (null | Function | ArrayLike<unknown>) ? never : (T extends object ? T : never);

export type StringIndexedMapping = Map<string, string> | Record<string, string> | string[];

export type StringInterfaceMapping<O> = O extends { [K in keyof O]: string } ? O : never;

export type StringMapping<T> = StringIndexedMapping | StringInterfaceMapping<T>;
