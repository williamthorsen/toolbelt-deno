#!/usr/bin/env zsh

# Only libraries with a build step need to have their dependencies updated.
local LIBRARIES=("arrays" "dstructs" "numbers" "objects" "strings")

rm -f deno.lock
deno cache --lock=deno.lock --lock-write --unstable dev_deps.ts

for library in "${LIBRARIES[@]}"; do
  cd libraries/$library
  rm -f deno.lock
  deno task check && deno task build
  cd ../..
done

deno task check
