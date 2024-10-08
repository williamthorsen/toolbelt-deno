# @williamthorsen/toolbelt.arrays

## 2.10.1

### Internal features

Added function:

- `itemAt`: Provides type-safe access to array elements. Used to avoid the array-access errors revealed when `noUncheckedIndexedAccess` is enabled.

### Tooling

Enabled `noUncheckedIndexedAccess` in TypeScript settings.

### Refactoring

Modified `extractWeights` to create uniform weights equal to 1 / the number of items (instead of 1, as previously).

Wrapped unchecked array-access operations in `itemAt` to satisfy `noUncheckedIndexedAccess`.

## 2.10.0

### Features

Added function:

- `extractWeights`: Extracts weights from array elements.

## 2.9.1

### Fixes

Reversed the change to `pickWeightedItem` that caused it to expect cumulative weights instead of discrete weights, which was a breaking change.

## 2.9.0

### Features

Enhanced function:

- `accumulateWeights`: Given inputs that produce only undefined weights, returns a uniform distribution instead of an unusable all-zero distribution.

## 2.8.1

### Refactoring

Modified the typing of `accumulateWeights` to allow the predicate function to return `undefined`,
because `undefined` is allowed by the wrapped `toCumulativeValues` function.

## 2.8.0

### Deprecations

- `getCumulativeWeights`: Use `toCumulativeValues` instead.

### Features

Added function:

- `accumulateWeights`: Extracts weights from array elements and returns an array of cumulative weights.

### Refactoring

- Renamed `getCumulativeWeights` to `toCumulativeValues`.

## 2.7.0

### Features

Added function:

- `assertFrozenArray`: Asserts that the input array is frozen at runtime.

### Fixes

Fixed the issue that `asNonEmptyArray` wrongly narrowed the type of the output to `never`.

### Refactoring

Simplified array typings.

## 2.6.0

### Features

Added functions:

- `asNonEmptyArray`: If the input array has at least one item, returns an immutable copy; otherwise, throws an error. Narrows the array type to immutable and non-empty.
- `assertNonEmptyArray`: Asserts that the input array has at least one item. Narrows the array type to non-empty.

## 2.5.0

### Features

Enhanced `arraify` function: It now accepts read-only arrays and always returns a new array.

## 2.4.4

### Refactoring

Updated internal dependency: @williamthorsen/toolbelt.numbers@3.1.1.

## 2.4.3

### Refactoring

Adapted to breaking changes introduced by `@williamthorsen/toolbelt.numbers@3.0.0`:

## 2.4.2

### Dependencies

Build and publish to update dependencies from `@williamthorsen/toolbelt.numbers@2.5.1`.

## 2.4.1

### Dependencies

Build and publish to update dependencies from `@williamthorsen/toolbelt.numbers@2.5.0`.

## 2.4.0

### Features

Modified functions to accept `Seed` instances as well as numbers and number-generating functions:

- `pickItem` and `pickItems`
- `pickWeightedIndex`
- `shuffle`
- `toPickWeightedItem`

Modified optional properties to explicitly allow `undefined` to satisfy `exactOptionalPropertyTypes=true`:

- `toPickWeightedItemFromDistribution`

## 2.3.1

### Refactoring

- The `seed` property is now typed as `seed?: Seed | undefined` to satisfy `exactOptionalPropertyTypes=true`.
- Replaced deprecated `spawnSeedFunction` with `spawnSeedFn`.

Adapted `shuffle` to the API change in `numbers`: Replaced deprecated `makeSeededRandom` with `makeSeedFn`.

## 2.3.0

### Features

Enhanced functions to accept a seed function in place of a number:

- `pickItem` and `pickItems`
- `shuffle`
- `toPickWeightedItem`

## 2.2.2

### Refactoring

Centralized imports from siblings in a `sibling_deps.ts` file.

### Tests

Added tests for imports from siblings. (Without these, code coverage of this library is reported to be incomplete.)

## 2.2.1

### Fixes

The `findOrThrow` function was added but not exported. Fixed by adding it to the exports in `mod.ts`.

## 2.2.0

### Features

Added function:

- `findOrThrow`: Returns the first item in an array that satisfies a predicate, or throws an error if no item satisfies
  the predicate.

## 2.1.0

### Features

Added function:

- `arraify`: Wraps a value in an array if it is not already an array.

## 2.0.0

### BREAKING CHANGES

Renamed functions for concision:

- `pickRandomItem` to `pickItem`.
- `pickRandomItems` to `pickItems`

## 1.3.4

### BREAKING CHANGES

Renamed a property of the `options` object accepted by `toPickWeightedItemFromDistribution`: `getName` is now
`getCategory`.

### Refactoring

Added a type parameter to `toPickWeightedItemFromDistribution` describing the keys of the `Distribution` object.

## 1.3.3

### Fixes

As a workaround for the failure to resolve types imported from the `/weighting` entrypoint, moved its exports to the
main entrypoint.

## 1.3.2

### Fixes

Changed entrypoint from erroneous `weighting` to `./weighting`.

## 1.3.1

### Refactoring

Changed the entrypoint for weighting functions from `./weighting.js` to `./weighting`.

## 1.3.0

### Features

Renamed

- `pickRandomWeightedIndex` to `pickWeightedIndex`
- `toPickRandomWeightedItem` to `toPickWeightedItem`

Moved weighting-related functions to separate entrypoint `@williamthorsen/toolbelt.arrays/weighting`:

- `getCumulativeWeights`
- `getWeightedIndex`
- `pickWeightedIndex`
- `toPickWeightedItem`

Add a function, `toPickWeightedItemFromDistribution`, to perform the same task as `toPickWeightedItem` but with a
distribution object instead of an array of weights.

## 1.2.0

### Features

Added functions:

- `getCumulativeWeights`: Builds an array of cumulative weights from an array of weights
- `getWeightedIndex`: Returns the index in an array of cumulative weights that matches a target weight
- `pickRandomWeightedIndex`: Returns a random index in an array of cumulative weights based on the weights
- `toPickRandomWeightedItem`: Returns a function that randomly picks an item from an array based on provided weights

## 1.1.0

Added functions:

- `getDuplicates`
- `getSetItems`

## 1.0.1

### Tooling

Fixed reference to GitHub repo in generated `package.json`.
