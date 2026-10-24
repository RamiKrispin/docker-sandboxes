#!/usr/bin/env bash

set -euo pipefail

image_ref="docker-sandboxes-t03:local"
container_name="docker-sandboxes-t03"

if ! command -v docker >/dev/null 2>&1; then
  printf 'error=Docker CLI not found on the host\n' >&2
  exit 1
fi

if ! docker info >/dev/null 2>&1; then
  printf 'error=Docker CLI cannot reach the selected host Docker daemon\n' >&2
  exit 1
fi

printf 'execution=host\n'
printf 'docker_context=%s\n' "$(docker context show)"
printf 'docker_host=%s\n' "${DOCKER_HOST:-context-default}"
printf 'docker_server_version=%s\n' "$(docker version --format '{{.Server.Version}}')"
printf 'docker_server_os=%s\n' "$(docker info --format '{{.OperatingSystem}}')"

if docker image inspect "${image_ref}" >/dev/null 2>&1; then
  printf 'error=host image already exists: %s\n' "${image_ref}" >&2
  exit 1
fi

if docker container inspect "${container_name}" >/dev/null 2>&1; then
  printf 'error=host container already exists: %s\n' "${container_name}" >&2
  exit 1
fi

printf 'host_image=absent\n'
printf 'host_container=absent\n'
printf 'status=ok\n'
