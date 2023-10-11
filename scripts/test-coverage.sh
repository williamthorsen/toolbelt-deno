#!/usr/bin/env zsh

local curDir=$(pwd)

local thisDir="$( cd "$( dirname "${(%):-%N}" )" && pwd )"
cd "$thisDir"
source "./functions.sh"

cd "$curDir"

# local ansi_escape='\033\[[^m]*m'
local ansi_green='\033[32m'
local ansi_grey='\033[37m'
local ansi_red='\033[31m'
local ansi_reset='\033[0m'

local QUIET=false
# Parse arguments
for arg in "$@"; do
  case $arg in
    --quiet)
      QUIET=true
      ;;
    *)
      # Handle other arguments or ignore
      ;;
  esac
done

local hasError=false

# Clean up previous coverage & run tests with coverage
rm -rf cov_profile coverage tracefile.lcov
if $QUIET; then
  error_output=$(deno test --allow-all --coverage=cov_profile 2>&1 >/dev/null)
else
  # Discard `stdout`; display `stderr` but also capture it so it can be displayed later.
  error_output=$(deno test --allow-all --coverage=cov_profile 2> >(tee /dev/fd/2) > /dev/null)
fi
if [[ $? -ne 0 ]]; then
  hasError=true
fi

# Capture & display the coverage output.
coverage_output=$(deno coverage cov_profile)
display "$coverage_output" $QUIET


# Check each line of the coverage output for less than 100% coverage.
declare -a failedFiles=()
while IFS= read -r line; do
  if [[ "$line" =~ ([0-9]{1,3}\.[0-9]{3})'% ' ]]; then
    coverage_percent="${match[1]}"
    if [[ "$coverage_percent" != "100.000" ]]; then
      failedFiles+=($line)
    fi
  fi
done < <(echo "$coverage_output")


if ! $QUIET; then
  print_grey "------- summary -------"
fi
if [[ "$error_output" ]]; then
  # Display the error information captured earlier, which might have scrolled off the screen.
  print_red "$error_output" >&2
fi
if [[ ${#failedFiles[@]} -ne 0 ]]; then
  print_red "Coverage is incomplete:" >&2
    for file in "${failedFiles[@]}"; do
      echo "  ${file#cover }" >&2
    done
  hasError=true
elif ! $QUIET; then
  print_green "Coverage is 100% for all files."
fi

if $hasError; then
  exit 1
else
  exit 0
fi
