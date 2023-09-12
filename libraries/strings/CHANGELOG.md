# @williamthorsen/toolbelt.strings

## 0.7.1

### Fixes

Fixed an issue in `interpolate` where a dictionary would be rejected if its type defined optional keys that were missing
from the dictionary.

## 0.7.0

### Deprecations

The `fallbackToKey` option of the `interpolate` function has been deprecated.

- **Reason**: The option has been replaced by the more flexible `ifMissing` option.
- **Migration**: Replace `fallbackToKey=true` with `ifMissing="USE_KEY"`.
- **Removal**: The `fallbackToKey` option is expected to be removed in v1.0.0.

### Features

Enhanced the `interpolate` function so that it now accepts an `ifMissing` option to control how unmatched placeholders
are handled:

- `IGNORE`: The default behavior. Unmatched placeholders are left unchanged.
- `THROW`: Throw an error if any placeholders are unmatched.
- `USE_KEY`: Use the placeholder key as the replacement value (same as the now deprecated `fallbackToKey=true` option)
- a predicate function that handles the replacement

### Refactoring

Centralized imports from siblings in a `sibling_deps.ts` file.

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
