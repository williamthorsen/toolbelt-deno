#!/usr/bin/env zsh

# Enable extended globbing, which is needed for the pattern used below.
setopt EXTENDED_GLOB

# Typecheck all .ts files that are not under a `dist/` directory.
deno check (^dist/)#*.ts
