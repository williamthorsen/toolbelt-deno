# libraries/interop

## 0.2.1

### Tooling

Enabled `noUncheckedIndexedAccess` in TypeScript settings.

## 0.2.0

### Features

Enhanced `buildNodeModules`: It now accepts a `kind` option to pass on to `dnt::build`. When set to `'export'`, `dnt` correctly configures `package.json` to export the module.

### Internal features

Added function:

- `toEntryPoint`: Converts a simple entry-point path such as `./sublibrary.ts` to an `EntryPoint` object that can be passed to `dnt::build`. The result is an entry point in `package.json` that exports `sublibrary.ts` at `./sublibrary`.

## 0.1.0

### Refactoring

Exported the `BuildOptions` interface.
