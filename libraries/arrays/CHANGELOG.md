# @williamthorsen/toolbelt.arrays

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
