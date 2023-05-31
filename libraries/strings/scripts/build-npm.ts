import { build, emptyDir } from "https://deno.land/x/dnt/mod.ts";
import { join } from "https://deno.land/std/path/mod.ts";

const DIST_DIR = "../../dist/libraries/strings";

// Get the version from CLI argument (i.e., in CI workflow) or read it from the VERSION file
const version = (Deno.args[0] || Deno.readTextFileSync("VERSION"))
  .trim()
  .replace(/^v/, "");

if (!isValidSemver(version)) {
  console.error(
    `ERROR: Invalid VERSION file. Expected a semver string, got "${version}"`,
  );
  Deno.exit(1);
}

await emptyDir(DIST_DIR);

await build({
  packageManager: "pnpm",
  entryPoints: [
    "./mod.ts",
  ],
  declaration: "separate",
  outDir: DIST_DIR,
  scriptModule: false, // Don't generate CommonJS/UMD output
  shims: {
    // see JS docs for overview and more options
    deno: true,
  },
  package: {
    // package.json properties
    name: "@williamthorsen/toolbelt.strings",
    version,
    description: "String manipulation utilities.",
    bugs: {
      url:
        "https://github.com/williamthorsen/toolbelt/issues/new?labels=strings",
    },
    repository: {
      directory: "libraries/strings",
      type: "git",
      url: "git+https://github.com/williamthorsen/toolbelt.git",
    },
    license: "UNLICENSED",
    publishConfig: {
      access: "public",
      registry: "https://npm.pkg.github.com",
    },
  },
  postBuild() {
    // steps to run after building and before running the tests
    Deno.copyFileSync("README.md", join(DIST_DIR, "README.md"));
  },
});

/**
 * Returns true if the string is a valid semver string.
 * Prerelease versions such as "1.0.0-alpha.1" are allowed.
 */
function isValidSemver(version: string): boolean {
  return /^\d+\.\d+\.\d+(-.+)?$/.test(version);
}
