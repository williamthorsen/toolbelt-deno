# @williamthorsen/toolbelt.stats

## 0.4.3

### Tooling

Enabled `noUncheckedIndexedAccess` in TypeScript settings.

### Refactoring

Wrapped array-access operations in `itemAt` to satisfy `noUncheckedIndexedAccess`.

## 0.4.2

### Dependencies

Build and publish to update dependencies from `@williamthorsen/toolbelt.numbers@2.5.1`.

## 0.4.1

### Refactoring

Modified optional properties to explicitly allow `undefined` to satisfy `exactOptionalPropertyTypes=true`:

- `findDistributionByIntervalProbability`
- `getNormalIntervalProbabilities`

## 0.4.0

### Featuress

Modified `findDistributionByIntervalProbability` so that when there is a single interval, the function returns a
probability of 1 and a standard deviation of 0.

## 0.3.2

### Refactoring

Centralized imports from siblings in a `sibling_deps.ts` file.

## 0.3.1

### Features

Export the new functions from v0.3.0.

## 0.3.0

### Features

Added functions:

- `computeCdfInverse`: Computes the inverse of the cumulative distribution function of a normal distribution.
- `findDistributionByIntervalProbability`: Given a desired probability, finds the distribution that has that probability
  in the first and last intervals.

### Dependencies

Added `gaussian` module to dependencies for statistical functions.

### Refactoring

Removed custom computation of the cumulative distribution function and replaced it with a call to `gaussian` module.

## 0.2.0

### Features

Modified `getNormalIntervalProbabilities` so that, if given a standard deviation of 0, it returns uniform probabilities.

## 0.1.0

### Features

Added functions:

- `computeCdf`: Computes the cumulative distribution function of a given distribution.
- `getNormalIntervalProbabilities`: Computes probabilities across intervals of a normal distribution.
- `toAddendsFromCumulativeSums`: Converts a list of cumulative sums to a list of addends.
- `toCumulativeSumsFromAddends`: Converts a list of addends to a list of cumulative sums.

### Tooling

Added the scaffolding for the library.
