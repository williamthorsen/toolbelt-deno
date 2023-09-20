#!/usr/bin/env zsh

local LIBRARIES=("arrays" "datetime" "dstructs" "numbers" "objects" "stats" "strings")

for library in "${LIBRARIES[@]}"; do
  echo "Building $library"
  cd libraries/$library
  deno task test:coverage
  cd ../..
done
