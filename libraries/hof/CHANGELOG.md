# libraries/hof

## 0.4.1

### Tooling

Enabled `noUncheckedIndexedAccess` in TypeScript settings.

### Refactoring

Wrapped unchecked array-access operations in `itemAt` to satisfy `noUncheckedIndexedAccess`.

## 0.4.0

### Features

Added functions:

- `map`: Functional wrapper for `Array#map`. Creates a function that returns the result of applying the function to each item in the array.

## 0.3.0

### Features

Added function:

- `pipe`: Creates a function that successively invokes a list of functions, passing the result of each invocation to the next function in the list.

### Internal features

Added functions:

- `isPromise` & `isNotPromise`: Checks whether a value looks like a promise.

## 0.2.0

### Features

Added functions:

- `curry`: Creates a function that accepts arguments of `fn` and either invokes `fn` returning its result, if at least `arity` number of arguments have been provided, or returns a function that accepts the remaining `arity` number of arguments, and so on.
- `evaluate`: Resolves a value or function to a value.
- `identity`: Returns the first argument passed to it.
- `noop`: A function that does nothing.

## 0.1.0

### Tooling

Scaffolded the HOF (higher-order functions) library.
