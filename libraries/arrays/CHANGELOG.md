# @williamthorsen/toolbelt.arrays

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
