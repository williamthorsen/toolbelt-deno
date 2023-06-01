const DIST_DIR = 'dist';

async function main() {
  console.log(`Publishing package from ${DIST_DIR}`);

  // deno-lint-ignore no-deprecated-deno-api
  const install = Deno.run({
    cmd: ['pnpm', 'install'],
    cwd: DIST_DIR,
  });
  const installStatus = await install.status();

  if (!installStatus.success) {
    console.error(`Failed to run 'pnpm install' in ${DIST_DIR}`);
    Deno.exit(1);
  }

  // deno-lint-ignore no-deprecated-deno-api
  const publish = Deno.run({
    cmd: ['pnpm', 'publish'],
    cwd: DIST_DIR,
  });

  const publishStatus = await publish.status();

  if (!publishStatus.success) {
    console.error(`Failed to publish package from ${DIST_DIR}`);
    Deno.exit(1);
  }
}

main().then(() => {
  console.log(`Package published successfully from ${DIST_DIR}`);
});
