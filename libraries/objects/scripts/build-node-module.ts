import { buildNodeModule } from '../../interop/mod.ts';

buildNodeModule({
  // TODO: Check whether these values can be omitted in the default case
  inDir: '.',
  entryPoints: ['./mod.ts'],
  outDir: 'dist',

  description: 'Utilities for working with objects',
  issueLabel: 'objects',
  packageName: '@williamthorsen/toolbelt.objects',
  repoDir: 'libraries/objects',

  version: Deno.args[0] || '',
}).catch((error) => {
  console.error(error);
  Deno.exit(1);
})
  .then(() => {
    console.info('Node module built successfully');
  });
