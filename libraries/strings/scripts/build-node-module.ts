import { buildNodeModule } from '../../interop/mod.ts';
import { toEntryPoint } from '../../interop/src/toEntryPoint.ts';

buildNodeModule({
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

  version: Deno.args[0] || '',
}).catch((error) => {
  console.error(error);
  Deno.exit(1);
})
  .then(() => {
    console.info('Node module built successfully');
  });
