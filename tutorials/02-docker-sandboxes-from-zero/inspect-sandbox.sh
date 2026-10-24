#!/usr/bin/env bash

set -euo pipefail

required_commands=(bash git docker)

for required_command in "${required_commands[@]}"; do
  if ! command -v "${required_command}" >/dev/null 2>&1; then
    printf 'error=required command not found: %s\n' "${required_command}" >&2
    exit 1
  fi
done

if ! docker info >/dev/null 2>&1; then
  printf 'error=Docker client cannot reach a Docker daemon\n' >&2
  exit 1
fi

printf 'user=%s\n' "$(id -un)"
printf 'uid=%s\n' "$(id -u)"
printf 'working_directory=%s\n' "${PWD}"
printf 'kernel=%s\n' "$(uname -srm)"
printf 'bash=%s\n' "${BASH_VERSION}"
printf 'git=%s\n' "$(git --version)"
printf 'docker_client=%s\n' "$(docker version --format '{{.Client.Version}}')"
printf 'docker_server=%s\n' "$(docker version --format '{{.Server.Version}}')"
printf 'status=ok\n'
