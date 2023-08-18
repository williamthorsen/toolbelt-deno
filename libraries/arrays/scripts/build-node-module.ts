import { buildNodeModule } from '../../interop/mod.ts';

buildNodeModule({
  // TODO: Check whether these values can be omitted in the default case
  inDir: '.',
  entryPoints: [
    './mod.ts',
    { name: 'weighting', path: './weighting.ts' },
  ],
  outDir: 'dist',

  description: 'Utilities for working with arrays',
  issueLabel: 'arrays',
  packageName: '@williamthorsen/toolbelt.arrays',
  repoDir: 'libraries/arrays',

  version: Deno.args[0] || '',
}).catch((error) => {
  console.error(error);
  Deno.exit(1);
})
  .then(() => {
    console.info('Node module built successfully');
  });
