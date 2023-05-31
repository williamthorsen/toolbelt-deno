import { build, emptyDir } from "https://deno.land/x/dnt/mod.ts";
import { join } from "https://deno.land/std/path/mod.ts";

const distDir = "../../dist/libraries/strings";

await emptyDir(distDir);

await build({
  packageManager: "pnpm",
  entryPoints: ["./mod.ts"],
  outDir: distDir,
  shims: {
    // see JS docs for overview and more options
    deno: true,
  },
  package: {
    // package.json properties
    name: "@williamthorsen/toolbelt.strings",
    version: Deno.args[0],
    description: "String manipulation utilities.",
    license: "UNLICENSED",
    repository: {
      type: "git",
      url: "git+https://github.com/williamthorsen/toolbelt.git",
      "directory": "libraries/strings",
    },
    bugs: {
      url: "https://github.com/williamthorsen/toolbelt/issues/new?labels=strings",
    },
  },
  postBuild() {
    // steps to run after building and before running the tests
    Deno.copyFileSync("README.md", join(distDir, "README.md"));
  },
});
