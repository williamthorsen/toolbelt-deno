import { buildNodeModule } from '../../interop/mod.ts';

buildNodeModule({
  // TODO: Check whether these values can be omitted in the default case
  inDir: '.',
  entryPoints: ['./mod.ts'],
  outDir: 'dist',

  description: 'Statistical utilities',
  issueLabel: 'statistics',
  packageName: '@williamthorsen/toolbelt.statistics',
  repoDir: 'libraries/statistics',

  version: Deno.args[0] || '',
}).catch((error) => {
  console.error(error);
  Deno.exit(1);
})
  .then(() => {
    console.info('Node module built successfully');
  });
