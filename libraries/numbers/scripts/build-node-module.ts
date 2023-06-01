import { buildNodeModule } from '../../interop/mod.ts';

buildNodeModule({
  // TODO: Check whether these values can be omitted in the default case
  inDir: '.',
  entryPoints: ['./mod.ts'],
  outDir: 'dist',

  description: 'Utilities for working with numbers',
  issueLabel: 'numbers',
  packageName: '@williamthorsen/toolbelt.numbers',
  repoDir: 'libraries/numbers',

  version: Deno.args[0] || '',
}).catch((error) => {
  console.error(error);
  Deno.exit(1);
})
  .then(() => {
    console.info('Node module built successfully');
  });
