import { build, emptyDir, join, resolve, z } from '../dev_deps.ts';
import { isValidSemver } from '../../tooling/isValidSemver.ts';

const REPO_URL = 'https://github.com/williamthorsen/toolbelt-deno';

const optionsSchema = z.object({
  inDir: z.string(),
  entryPoints: z.array(
    z.string().or(z.object({
      name: z.string(),
      path: z.string(),
    })),
  ),
  filePaths: z.array(z.string()).default([]),
  outDir: z.string(),

  description: z.string().optional(),
  issueLabel: z.string().optional(),
  packageName: z.string(),
  repoDir: z.string(),

  isPublic: z.boolean().default(false),
  license: z.string().default('UNLICENSED'),

  version: z.string().optional(),
  versionFilePath: z.string().default('./VERSION'),
});

/**
 * Creates a Node module from the entrypoints and saves the output to the specified directory.
 * Entrypoints are resolved relative to inDir. If version number is not passed in, it is read from the VERSION file.
 */
export async function buildNodeModule(options: BuildOptions): Promise<void> {
  const {
    inDir,
    entryPoints,
    filePaths,
    outDir,

    description,
    issueLabel,
    packageName,
    repoDir,

    isPublic,
    license,
    version,
    versionFilePath,
  } = optionsSchema.parse(options);

  const inDirFullPath = resolve(Deno.cwd(), inDir);
  const versionFileFullPath = join(inDirFullPath, versionFilePath);
  const resolvedVersion = (version || Deno.readTextFileSync(versionFileFullPath))
    .trim()
    .replace(/^v/, '');

  if (!isValidSemver(resolvedVersion)) {
    throw new Error(`Invalid version. Expected a semver string, got "${resolvedVersion}"`);
  }

  await emptyDir(outDir);

  const filesToCopy = [
    ...filePaths,
    'README.md',
  ];

  const access = isPublic ? 'public' : 'restricted';
  const gitRepositoryUrl = `git+${REPO_URL}.git`;
  const issuesUrl = issueLabel ? `${REPO_URL}/issues/new?label=${issueLabel}` : `${REPO_URL}/issues`;

  await build({
    packageManager: 'pnpm',
    entryPoints,
    declaration: 'separate',
    outDir,
    scriptModule: false, // Don't generate CommonJS/UMD output
    shims: { // see JS docs for overview and more options
      deno: true,
    },
    skipSourceOutput: true, // Don't include TypeScript source in the output
    package: { // package.json properties
      name: packageName,
      version: resolvedVersion,
      ...(description && { description }),
      bugs: {
        url: issuesUrl,
      },
      repository: {
        ...(repoDir ? { directory: repoDir } : {}),
        type: 'git',
        url: gitRepositoryUrl,
      },
      license,
      publishConfig: {
        access,
        registry: 'https://npm.pkg.github.com',
      },
    },
    postBuild() { // runs after the build is done and before tests are run
      filesToCopy.forEach((filePath) => {
        Deno.copyFileSync(filePath, resolve(outDir, filePath));
      });
    },
  });
}

export type BuildOptions = z.input<typeof optionsSchema>;
