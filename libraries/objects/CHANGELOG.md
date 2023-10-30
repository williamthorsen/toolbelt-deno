# @williamthorsen/toolbelt.objects

## 0.12.0

### Features

Enhanced function:

- `get`: Now allows a default value to be specified.

## 0.11.0

### Features

Added function:

- `get`: Returns a function that gets the value mapped to the given key.

## 0.10.1

### Formatting

Simplified the syntax of `hasOwnProperty`.

### Tooling

Changed line-wrapping behavior of `fmt` to match other libraries.

## 0.10.0

### Features

Added function:

- `objectSize`: Returns the number of keys in an object.

## 0.9.0

### Features

Added functions:

- `isNonNullObject`: Checks whether a value is an object but not `null`
- `isScalar`: Checks whether a value is a scalar
- `preciseTypeOf`: Drop-in replacement for `preciseObjectTypeOf` with better structure and typings

### Refactoring

Deprecated `checkIsPlainObject` in favor of `isPlainObject`.

## Features

### 0.8.0

Added function `mapToObject`: Converts a Map instance to an object while preserving the type of the entries.

## 0.7.2

### Fixes

Fixed an issue caused by the previous release, where `hasOwnProperty` did not correctly infer the type of an object's
key.

## 0.7.1

### Fixes

Fixed an issue caused by the previous release, where `hasOwnProperty` accepted any type of input but no longer preserved
the type of an object's key.

## 0.7.0

### Features

`hasOwnProperty` now accepts any value as input, just as `Object.prototype.hasOwnProperty` does. It no longer raises a
type error when given input other than an object.

Improved the function signature of `checkIsPlainObject`: It now narrows the type of the input to `satisfies PlainObject`
rather than `PlainObject`.

### Refactoring

Renamed `isPlainObject` to `checkIsPlainObject`. The old name remains available as an alias.

## 0.6.2

### Tooling

Fix reference to GitHub repo in generated `package.json`.
