# @williamthorsen/toolbelt.strings

## 0.11.0

### Features

Added functions:

- `concatenate`: Concatenates a list of strings with custom separators.
- `capitalize`: Capitalizes the first letter of a string.

## 0.10.0

### Features

Added functions:

- `obfuscate`: Replaces characters in a string with fill characters to obfuscate the string.
- `toCamelCase`: Converts a string to camel case, treating spaces, hyphens, underscores, and periods as word separators.

## 0.9.0

### Features

Added a `slugify` function to convert a string to a slug.

## 0.8.0

### Deprecations

The `interpolate` function has been deprecated:

- **Reason**: The function has been replaced by the more capable and robust `Interpolable` class.
- **Migration**: Replace `interpolate` with `Interpolable.interpolate` and replace `fallbackToKey` with `ifMissing='USE_KEY'`.
- **Removal**: The `interpolate` function is expected to be removed in v1.0.0.

### Features

Added new `Interpolable` class as a more capable and robust replacement for the `interpolate` function.

### Internal features

Added `setDifference` and `setIntersection` functions to support the `Interpolable` class. These are not currently exported from the library but will eventually be moved to a new `sets` library and supplemented by other set functions.

### Tooling

Modified `fmt` configuration to preserve long lines in prose files.

## 0.7.1

### Fixes

Fixed an issue in `interpolate` where a dictionary would be rejected if its type defined optional keys that were missing from the dictionary.

## 0.7.0

### Deprecations

The `fallbackToKey` option of the `interpolate` function has been deprecated:

- **Reason**: The option has been replaced by the more flexible `ifMissing` option.
- **Migration**: Replace `fallbackToKey=true` with `ifMissing="USE_KEY"`.
- **Removal**: The `fallbackToKey` option is expected to be removed in v1.0.0.

### Features

Enhanced the `interpolate` function so that it now accepts an `ifMissing` option to control how unmatched placeholders are handled:

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

Fixed the signature of the `interpolate` function. The type of the `dictionary` argument was unrelated to the type parameter, leading to TS errors in calling code.

### Refactoring

Replaced the randomization code in `pickVariants` with a simpler, more declarative call to `pickRandomItem`.

### Tooling

Adjusted test paths to allow correct computation of test coverage, which otherwise reports incomplete coverage of functions imported from sibling libraries.

## 0.5.1

### Tooling

Fix reference to GitHub repo in generated `package.json`.
