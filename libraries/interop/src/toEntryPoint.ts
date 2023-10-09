import type { EntryPoint } from '../dev_deps.ts';

// Must be a path in the format of './{entryPointName}.ts'
const ENTRY_POINT_PATH_REGEX = /^\.\/[A-Za-z0-9-_]+\.ts$/;
const DEFAULT_PATH = './mod.ts';

/**
 * Convenience function to transform a file path to an `EntryPoint` object.
 * @example
 * ```
 * toEntryPoint('./myEntryPoint.ts')
 * // => { kind: 'export', name: './myEntryPoint', path: './myEntryPoint.ts' }
 * ```
 * Given this entry point, `dnt::build` will:
 * 1. create this entry in package.json:
 *   ```json
 *   {
 *     "exports": {
 *       "./myEntryPoint": {
 *         "import": {
 *           "types": "./esm/libraries/{library}/myEntryPoint.d.ts",
 *           "default": "./esm/libraries/{library}/myEntryPoint.ts"
 *          }
 *       }
 *      }
 *   }
 * ```
 * 2. generate these files:
 * ```
 * dist/esm/libraries/{library}/myEntryPoint.js
 * types/libraries/{library}/myEntryPoint.d.ts
 */
export function toEntryPoint(pathToEntryPointFile: string): EntryPoint {
  if (!ENTRY_POINT_PATH_REGEX.test(pathToEntryPointFile)) {
    throw new Error(
      `Invalid path: "${pathToEntryPointFile}". Entry-point path must be in this format: './{entryPointName}.ts'`,
    );
  }
  if (pathToEntryPointFile === DEFAULT_PATH) {
    throw new Error(`The default path "./mod.ts" is reserved.`);
  }
  return {
    kind: 'export',
    name: pathToEntryPointFile.replace(/\.ts$/, '.js'),
    path: pathToEntryPointFile,
  };
}
