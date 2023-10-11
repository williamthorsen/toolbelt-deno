#!/usr/bin/env zsh

local thisDir="$( cd "$( dirname "${(%):-%N}" )" && pwd )"
cd "$thisDir"
source "./config.sh"
source "./functions.sh"

# Change to repo root.
cd ..

# Verify that `source ./config.sh` populated the variables.
assert_exists PUBLISHED_LIBRARIES UNPUBLISHED_LIBRARIES

# Declare an array to hold the names of libraries that fail to build.
declare -a failedLibraries=()

# Rebuild the lock files in all libraries by running code checks and (if it exists) a build step.
rebuild() {
  local library=$1
  local build=$2

  echo -n "- $library ..."
  cd libraries/$library
  if [[ $build == "build" ]]; then
    local output=$(deno task ws check 2>/dev/null && deno task ws build 2>/dev/null)
  else
    local output=$(deno task ws check 2>/dev/null)
  fi
  done_or_failed $library $? || failedLibraries+=($library)
  cd ../..
}

rm -f deno.lock
deno cache --lock=deno.lock --lock-write --unstable dev_deps.ts

echo "Rebuilding lock files in all libraries..."
for library in "${PUBLISHED_LIBRARIES[@]}"; do
  rebuild $library "build"
done

for library in "${UNPUBLISHED_LIBRARIES[@]}"; do
  rebuild $library
done

library='root'
echo -n "- $library ..."
deno task check 2>/dev/null
done_or_failed $library $? || failedLibraries+=($library)

if [[ ${#failedLibraries[@]} -ne 0 ]]; then
  print_red "Build failed in these libraries: ${failedLibraries[@]}" >&2
  exit 1
fi
