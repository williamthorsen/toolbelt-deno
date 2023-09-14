// Ignore the warning about `Function`: We do want to exclude all functions and classes!
// deno-lint-ignore ban-types
export type StrictObject<T> = T extends (null | Function | ArrayLike<unknown>) ? never : (T extends object ? T : never);

export interface ValidationError {
  code: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}
