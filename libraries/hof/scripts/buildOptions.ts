import type { BuildOptions } from '../../interop/types.ts';

export const buildOptions: BuildOptions = {
  // TODO: Check whether these values can be omitted in the default case
  inDir: '.',
  entryPoints: ['./mod.ts'],
  outDir: 'dist',

  description: 'Utilities for working with functions',
  issueLabel: '',
  packageName: '@williamthorsen/toolbelt.hof',
  repoDir: 'libraries/hof',
};
