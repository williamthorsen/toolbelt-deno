# @williamthorsen/toolbelt.strings

## 0.6.0

### Features

Enhanced the `interpolate` function so that it now

- checks that brace delimiters are matched and not nested
- accepts a `Map` of substitutions as an alternative to an object literal
- accepts regular expressions (in addition to strings) as match patterns

## 0.5.3

### Dependencies

Updated `pickVariants` to replace obsolete `pickRandomItem` function with `pickItem`.

## 0.5.2

### Fixes

Fixed the signature of the `interpolate` function. The type of the `dictionary` argument was unrelated to the type
parameter, leading to TS errors in calling code.

### Refactoring

Replaced the randomization code in `pickVariants` with a simpler, more declarative call to `pickRandomItem`.

### Tooling

Adjusted test paths to allow correct computation of test coverage, which otherwise reports incomplete coverage of
functions imported from sibling libraries.

## 0.5.1

### Tooling

Fix reference to GitHub repo in generated `package.json`.
