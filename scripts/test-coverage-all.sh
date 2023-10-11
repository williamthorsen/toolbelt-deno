#!/usr/bin/env zsh

local thisDir="$( cd "$( dirname "${(%):-%N}" )" && pwd )"
cd "$thisDir"
source "./config.sh"
source "./functions.sh"
cd ..

assert_exists ALL_LIBRARIES

echo "Checking coverage in all libraries..."

declare -a failedLibraries=()
for library in "${ALL_LIBRARIES[@]}"; do
  echo -n "- $library ..."
  cd libraries/$library
  ../../scripts/test-coverage.sh --quiet
  done_or_failed $library $? || failedLibraries+=($library)
  cd ../..
done

if [[ ${#failedLibraries[@]} -ne 0 ]]; then
  print_red "Coverage check failed in these libraries: ${failedLibraries[@]}" >&2
  exit 1
fi
