#!/usr/bin/env zsh

ansi_escape='\033\[[^m]*m'
ansi_green='\033[32m'
ansi_grey='\033[37m'
ansi_red='\033[31m'
ansi_reset='\033[0m'

assert_exists() {
  for var_name in "$@"; do
    if [[ -z "${(P)var_name+x}" ]]; then
      print_red "Error: Variable $var_name is not set." >&2
      exit 1
    fi
  done
}

display() {
  local quiet=$2
  if ! $quiet; then
    echo "$1"
  fi
}

done_or_failed() {
  local candidate=$1
  local error_code=$2

  if [[ $error_code -eq 0 ]]; then
    print_green " Done"
    return 0
  else
    print_red " Failed"
    print_red " $output"
    return 1
  fi
}

print_green() {
  echo "${ansi_green}$1${ansi_reset}"
}

print_grey() {
  echo "${ansi_grey}$1${ansi_reset}"
}

print_red() {
  echo "${ansi_red}$1${ansi_reset}"
}
