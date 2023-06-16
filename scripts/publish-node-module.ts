async function publishNodeModule(distDir = 'dist'): Promise<void> {
  console.log(`Publishing package from ${distDir}`);

  // deno-lint-ignore no-deprecated-deno-api
  const install = Deno.run({
    cmd: ['pnpm', 'install'],
    cwd: distDir,
  });
  const installStatus = await install.status();

  if (!installStatus.success) {
    console.error(`Failed to run 'pnpm install' in ${distDir}`);
    Deno.exit(1);
  }

  // deno-lint-ignore no-deprecated-deno-api
  const publish = Deno.run({
    cmd: ['pnpm', 'publish'],
    cwd: distDir,
  });

  const publishStatus = await publish.status();

  if (!publishStatus.success) {
    console.error(`Failed to publish package from ${distDir}`);
    Deno.exit(1);
  }

  console.log(`Package published successfully from ${distDir}`);
}

await publishNodeModule();
