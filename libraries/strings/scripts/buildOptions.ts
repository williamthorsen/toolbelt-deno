import type { BuildOptions } from '../../interop/types.ts';
import { toEntryPoint } from '../../interop/src/toEntryPoint.ts';

export const buildOptions: BuildOptions = {
  // TODO: Check whether these values can be omitted in the default case
  inDir: '.',
  entryPoints: [
    './mod.ts',
    toEntryPoint('./experimental.ts'),
  ],
  outDir: 'dist',

  description: 'String manipulation utilities',
  issueLabel: 'strings',
  packageName: '@williamthorsen/toolbelt.strings',
  repoDir: 'libraries/strings',
};
