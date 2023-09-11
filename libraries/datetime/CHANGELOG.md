# @williamthorsen/toolbelt.datetime

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
