#!/usr/bin/env zsh

local thisDir="$( cd "$( dirname "${(%):-%N}" )" && pwd )"
cd "$thisDir"
source "./config.sh"
source "./functions.sh"

# Change to repo root.
cd ..

rm -f deno.lock
deno cache --lock=deno.lock --lock-write --unstable dev_deps.ts
if [[ $? -ne 0 ]]; then
  echo "Failed to rebuild lock file." >&2
  exit 1
else
  echo "Rebuilt lock file."
  exit 0
fi
