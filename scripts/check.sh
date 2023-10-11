#!/usr/bin/env zsh

# Runs checks for an individual library
# Must be run from the library's root directory

deno task ws typecheck \
  && deno fmt --check --quiet \
  && deno lint --compact \
  && deno task ws test:coverage --quiet
if [[ $? -ne 0 ]]; then
  echo "Checks failed. Please fix the errors and try again." >&2
  exit 1
fi
