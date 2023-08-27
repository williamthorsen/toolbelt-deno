# @williamthorsen/toolbelt.objects

## 0.7.0

### Features

`hasOwnProperty` now accepts any value as input, just as `Object.prototype.hasOwnProperty` does. It no longer raises a
type error when given input other than an object.

Improved the function signature of `checkIsPlainObject`: It now narrows the type of the input to `satisfies PlainObject`
rather than `PlainObject`.

### Refactoring

Renamed `isPlainObject` to `checkIsPlainObject`. The old name remains available as an alias.

## 0.6.2

### Tooling

Fix reference to GitHub repo in generated `package.json`.
