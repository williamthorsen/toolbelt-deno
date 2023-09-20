# @williamthorsen/toolbelt.numbers

## 2.4.0

### Deprecations

- `deriveMakeSeedFn`, `deriveSpawnSeedFn` & `deriveSeedFns`: Subclass `Seed` instead
- `makeSeedFn`: Use `Seed#seedFn` instead
- `makeIntSeedFn`: Use `IntSeed#seedFn` instead
- `makeInt32SeedFn`: Use `Int32Seed#seedFn` instead
- `spawnSeedFn`: Use `Seed.spawn` instead
- `spawnIntSeedFn`: Use `IntSeed.spawn` instead
- `spawnInt32SeedFn`: Use `Int32Seed.spawn` instead
- `Seed` type: Use `SeedLike` type instead

### Features

Added new `Seed` class, along with child classes `IntSeed` and `Int32Seed`, to simplify the API for creating
deterministic seed functions.

Modified functions to accept `Seed` instances as well as numbers and number-generating functions:

- `createNumberGenerator`
- `deriveSeedFns`
- `makeSeedFn`
- `pickInteger`
- `random`
- `withSeed`

### Refactoring

Eliminated all use of the deprecated seed functions in other functions.

To simplify the code structure (and avoid inadvertent cyclic dependencies),

- Modified `createNumberGenerator` to eliminate the dependence on externally created seed functions.
- Modified `random` to avoid the dependence on `createNumberGenerator`.

## 2.3.0

### Deprecations

- `makeSeededRandom`: Use `makeSeedFn` instead
- `spawnSeedFunction`: Use `spawnSeedFn` instead

### Features

Added seed functions:

- `deriveMakeSeedFn`: Creates a variant of `makeSeedFn` (whose seeds are in the range `[0, 1)`) that produces seeds in a
  custom range.
- `deriveSpawnSeedFn`: Creates a variant of `spawnSeedFn` for use with a variant `makeSeedFn`.

Two premade variants are exported:

- `makeInt32SeedFn` and `spawnInt32SeedFn`: Produce integer seeds in the range `[1, 2^32 - 1]`
- `makeIntSeedFn` and `spawnIntSeedFn`: Produce integer seeds in the range `[1, 2^53 - 1]` (a.k.a.
  `Number.MAX_SAFE_INTEGER`)

Added convenience function: `deriveSeedFns`, that returns the results of `deriveMakeSeedFn` and `deriveSpawnSeedFn` in a
tuple.

Added function `withSeed`: Creates a deterministic version of any function that accepts a `seed` number or
number-returning function as a property of its first object.

Enhanced function:

- `pickInteger`: The `max` property is now optional. If omitted, it defaults to `Number.MAX_SAFE_INTEGER`.

### Internal features

Added function `sumWithWrap`: Wraps a number around to 0 when it exceeds `Number.MAX_SAFE_INTEGER`.

## 2.2.0

### Features

Added functions:

- `makeSeededRandom`: Creates a deterministic pseudo-random number generator
- `spawnSeedFunction`: Creates a deterministic pseudo-random number generator from a seed or seed function

## 2.1.0

### Features

Added function:

- `round`: rounds to a given number of decimal places

## 2.0.0

### BREAKING CHANGES

Renamed function for concision (and consistency with other function names) `pickRandomInt` to `pickInteger`.

## 1.0.1

### Tooling

Fix reference to GitHub repo in generated `package.json`.
