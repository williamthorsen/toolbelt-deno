export const commonScripts: Record<string, string> = {
  'check': '../../scripts/check.sh',
  'test:coverage': '../../scripts/test-coverage.sh',
  'typecheck': '../../scripts/typecheck.sh',
  'view-coverage': chain([
    'deno coverage --lcov cov_profile --output=tracefile.lcov',
    'genhtml --output-directory ./coverage --quiet tracefile.lcov',
    'open coverage/index.html',
  ]),
};

export const optionalScripts: Record<string, Record<string, string>> = {
  publish: {
    build:
      'deno run --allow-env --allow-net --allow-read --allow-run=pnpm --allow-write=dist scripts/build-node-module.ts',
    'prep-and-publish': chain([
      'deno task ws check',
      'deno task ws build',
      'deno task ws publish',
    ]),
    publish:
      'deno run --allow-net --allow-read --allow-run=pnpm --allow-write=dist ../../scripts/publish-node-module.ts',
  },
};

function chain(commands: string[]): string {
  return commands.join(' && ');
}
