import { buildNodeModule } from '../../interop/mod.ts';
import { buildOptions } from './buildOptions.ts';

const options = {
  ...buildOptions,
  version: Deno.args[0] || '',
};

buildNodeModule(options).catch((error) => {
  console.error(error);
  Deno.exit(1);
})
  .then(() => {
    console.info('Node module built successfully');
  });
