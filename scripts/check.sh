#!/usr/bin/env zsh

deno task typecheck && deno fmt --check && deno lint && deno task test:coverage --quiet
