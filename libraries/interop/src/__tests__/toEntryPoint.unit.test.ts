import { assertEquals, assertThrows, describe, it } from '../../dev_deps.ts';
import { toEntryPoint } from '../toEntryPoint.ts';

describe('toEntryPoint()', () => {
  it('returns the expected object format when given a valid path', () => {
    const path = './validName.ts';

    const result = toEntryPoint(path);

    assertEquals(result, {
      kind: 'export',
      name: './validName.js',
      path: './validName.ts',
    });
  });

  it('throws an error when given an invalid path format', () => {
    const invalidPaths = [
      'invalidName.ts', // Missing "./" at the beginning
      './invalidName.tsx', // Wrong file extension
      './invalid@name.ts', // Invalid characters
      '/invalidName.ts', // Wrong initial character
    ];

    for (const path of invalidPaths) {
      const throwingFn = () => toEntryPoint(path);

      assertThrows(
        throwingFn,
        Error,
        `Invalid path: "${path}". Entry-point path must be in this format: './{entryPointName}.ts'`,
      );
    }
  });

  it('throws an error when given the default path', () => {
    assertThrows(() => toEntryPoint('./mod.ts'), Error, `The default path "./mod.ts" is reserved.`);
  });

  it('converts the ".ts" extension to ".js" in the name property', () => {
    const path = './convertExtension.ts';
    const expectedName = './convertExtension.js';

    const actualName = toEntryPoint(path).name;

    assertEquals(actualName, expectedName);
  });
});
