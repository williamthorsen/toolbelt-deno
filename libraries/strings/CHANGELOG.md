# @williamthorsen/toolbelt.strings

## 1.3.0

### Experimental features

Added to `TextNode` class: `pickWithFingerprint` method, which returns an object containing the picked content, its indices, an encoded version of the indices, the seed, and a "fingerprint" string containing the seed and the encoded indices.

## 1.2.0

### Fixes

Fixed incorrect parsing of nested variants by `pickVariants`.

### Experimental features

Added experimental `TextNode` class (name is not final and may change):

- provides the same functionality as `pickVariants`, creating reproducible results from the same seed
- can return an array of the selected variant indices, which can be used to recreate the selected string
- can encode the array as a string

### Internal features

Added functions, both used by the `TextNode` class:

- `segmentByDelimited`: Splits a string into segments, treating top-level delimited strings as segment boundaries.
- `splitDelimited`: Parses a delimited string and returns an array of its elements.

### Refactoring

Modified `pickVariants` to use the `TextNode` class under the hood.

### Tooling

Refactored the build script to use a separate configuration file, `scripts/buildOptions.ts`.

## 1.1.0

### Features

Added experimental function:

- `isPatternMatch`: Checks a target string against one or strings, regular expressions, or predicate functions.

## 1.0.1

### Refactoring

Updated internal dependency: @williamthorsen/toolbelt.numbers@3.1.1.

## 1.0.0

### BREAKING CHANGES

Removed `interpolate` function: Use `Interpolable.interpolate` instead.

### Refactoring

Adapted to breaking changes introduced by `@williamthorsen/toolbelt.numbers@3.0.0`:

## 0.13.2

### Dependencies

Build and publish to update dependencies from `@williamthorsen/toolbelt.numbers@2.5.1`.

## 0.13.1

### Dependencies

Build and publish to update dependencies from `@williamthorsen/toolbelt.numbers@2.5.0`.

## 0.13.0

### Features

Modified `pickVariants` to accept `Seed` instances as well as numbers and number-generating functions.

### Refactoring

In `pickVariants`: Replaced `spawnSeedFn` with `Seed.spawn`.

## 0.12.1

### Refactoring

Improved the type signature of seed-accepting functions:
The `seed` property is now typed as `seed?: Seed | undefined` to satisfy `exactOptionalPropertyTypes=true`.

## 0.12.0

### Features

Added functions:

- `String.prototype` wrappers: `toLowerCase`, `toUpperCase`, `trim`, `trimEnd`, `trimStart`
- `condenseWhitespace`: Removes extra whitespace from a string while preserving up to one leading and one trailing space
- `removeWhitespace`: Removes all whitespace from a string
- `trimWhitespace`: Same as `condenseWhitespace` but also removes leading and trailing whitespace

Enhanced functions:

- `pickVariants`: Now accepts both numeric and function seeds and, when given a seed, uses new (but deterministic) seeds for each subsequent call.

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
