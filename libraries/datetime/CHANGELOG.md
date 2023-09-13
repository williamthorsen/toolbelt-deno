# @williamthorsen/toolbelt.datetime

## 0.5.0

### Features

Added to the `Timestamp` class: a static `now` method that returns a `Timestamp` instance representing the current time.

## 0.4.3

Fixed the issue that the argument to the `Timestamp.toIsoString` method should have been optional but did not provide a
default argument.

## 0.4.2

### Fixes

`TimestampOptions` was exported from `types.ts`, but that file was not exported from `mod.ts`. Fixed by exporting
`types.ts` from `mod.ts`.

## 0.4.1

### Fixes

The `TimestampOptions` interface was not exported. Fixed by adding it to `types.ts`.

Fixed the issue that `toCompactString` returned an incorrect value when time unit was set to hours.

## 0.4.0

### BREAKING CHANGES

Breaking changes in `Timestamp` class:

- Renamed `granularity` option to `timeUnit` for consistency.
- Replaced `setTimeUnit` with `setOptions`, which optionally sets `format` as well as `timeUnit`.

### Features

Added to `Timestamp` class:

- `setOptions`: Sets the `timeUnit` and `format` options for the instance.
- `toCompactString`: Renders a date-time string in `YYYYMMDD[-HHMM[SS[.sss]]]` format.
- `toNumericString`: Renders a date-time string in `YYYYMMDD[HHMM[SS[sss]]]` format.

The `Timestamp` constructor now accepts a `format` option.

The `toString()` method now uses the `format` option if one was provided to the constructor or set with `setOptions()`

## 0.3.1

### Tests

Set the tolerance of the `Timestamp` constructor test to 5 milliseconds.

## 0.3.0

### Breaking changes

- Removed `TimeUnit.smallestUnit`; comparisons can be made using `TimeUnit.millis`.
- Renamed `TimeUnit.Milliseconds` to `TimeUnit.Millis`.
- Renamed `Timestamp.milliseconds` to `Timestamp.millis`.
- Removed `Timestamp.ms`.

### Features

- Added `Timestamp.toHumaneUtcString`: Renders a human-friendly UTC date or date-time string.

## 0.2.0

### Features

Added classes:

- `Timestamp`: Represents a point in time.
- `TimeUnit`: Represents a unit of time and can convert to other time units.

## 0.1.0

### Tooling

Scaffolded the library.
