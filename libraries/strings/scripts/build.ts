import { build, emptyDir } from 'https://deno.land/x/dnt@0.36.0/mod.ts';
import { join } from 'https://deno.land/std@0.190.0/path/mod.ts';

const DIST_DIR = 'dist';

// Get the version from CLI argument (i.e., in CI workflow) or read it from the VERSION file
const version = (Deno.args[0] || Deno.readTextFileSync('VERSION'))
  .trim()
  .replace(/^v/, '');

await emptyDir(DIST_DIR);

await build({
  packageManager: 'pnpm',
  entryPoints: [
    './mod.ts',
  ],
  declaration: 'separate',
  outDir: DIST_DIR,
  scriptModule: false, // Don't generate CommonJS/UMD output
  shims: {
    // see JS docs for overview and more options
    deno: true,
  },
  package: {
    // package.json properties
    name: '@williamthorsen/toolbelt.strings',
    version,
    description: 'String manipulation utilities.',
    bugs: {
      url:
        'https://github.com/williamthorsen/toolbelt/issues/new?labels=strings',
    },
    repository: {
      directory: 'libraries/strings',
      type: 'git',
      url: 'git+https://github.com/williamthorsen/toolbelt.git',
    },
    license: 'UNLICENSED',
    publishConfig: {
      access: 'public',
      registry: 'https://npm.pkg.github.com',
    },
  },
  postBuild() {
    // steps to run after building and before running the tests
    Deno.copyFileSync('README.md', join(DIST_DIR, 'README.md'));
  },
});
