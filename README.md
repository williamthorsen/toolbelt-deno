# Deno Toolbelt

## Development

### How to set the Deno runtime version

The Deno runtime version is set in `.tool-versions`.

To list available versions:

  ```shell
  asdf list all deno
  ```

To change the version, edit `.tool-versions` and run:

  ```shell
  asdf install
  ```

Then install dependencies (see below).

### How to install dependencies

Only one dependency is being used at the moment, `version`. It needs to be installed separately for each version of the Deno runtime.

  ```shell
  deno install -n version -r -A https://deno.land/x/version/index.ts
  ```


### How to configure code-quality tools

Formatting, linting, and typechecking are all configured in their respective sections of `deno.jsonc`.

### How to check code

Run from the project root or the directory of the library to be checked:

  ```shell
  deno task check
  ```

The above command does typechecking, runs the linter, checks formatting, and runs tests. See the `check` task in
`deno.jsonc` for the individual checks that can be run.

### How to format code

  ```shell
  deno fmt
  ```

### How to publish a new version

1. Check the code with `deno task check` and `deno task build`.

2. Merge the changes into the `next` branch. Check out `main` and fast-forward it to `next`.

3. Bump the version number in the library to be published.  
   Do not use the `version` command, because it does not work well in this repo, which has a monorepo-like structure.  
   Do not create a tag.

3. Commit the change as "<Library name> library release <version number>". For example:

  ```shell
  git commit -m "Objects library release 0.1.0"
  ```

4. Run from the directory of the library to be published:

  ```shell
  deno task check && deno task build && deno task publish
  ```

TODO: Automate versioning.
TODO: Create a CHANGELOG.md file and update it with the changes made in the commit.
