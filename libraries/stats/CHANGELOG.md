# @williamthorsen/toolbelt.numbers

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
