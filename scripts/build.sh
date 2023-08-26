#!/usr/bin/env zsh

local LIBRARIES=("arrays" "dstructs" "numbers" "objects" "strings")

for library in "${LIBRARIES[@]}"; do
  echo "Building $library"
  cd libraries/$library
  deno task build
  cd ../..
done
