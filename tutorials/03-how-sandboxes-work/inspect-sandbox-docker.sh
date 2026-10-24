#!/usr/bin/env bash

set -euo pipefail

image_ref="docker-sandboxes-t03:local"
container_name="docker-sandboxes-t03"
script_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
action="${1:-run}"

require_docker() {
  if ! command -v docker >/dev/null 2>&1; then
    printf 'error=Docker CLI not found inside the sandbox\n' >&2
    exit 1
  fi

  if ! docker info >/dev/null 2>&1; then
    printf 'error=Docker CLI cannot reach the sandbox Docker Engine\n' >&2
    exit 1
  fi
}

cleanup() {
  docker container rm --force "${container_name}" >/dev/null 2>&1 || true
  docker image rm --force "${image_ref}" >/dev/null 2>&1 || true

  if docker container inspect "${container_name}" >/dev/null 2>&1; then
    printf 'error=failed to remove tutorial container from sandbox\n' >&2
    exit 1
  fi

  if docker image inspect "${image_ref}" >/dev/null 2>&1; then
    printf 'error=failed to remove tutorial image from sandbox\n' >&2
    exit 1
  fi
}

require_docker

if [[ "${action}" == "cleanup" ]]; then
  cleanup
  printf 'sandbox_container=removed\n'
  printf 'sandbox_image=removed\n'
  printf 'status=ok\n'
  exit 0
fi

if [[ "${action}" != "run" ]]; then
  printf 'usage=%s [run|cleanup]\n' "${0}" >&2
  exit 2
fi

if [[ "$(uname -s)" != "Linux" ]]; then
  printf 'error=expected a Linux kernel inside the sandbox\n' >&2
  exit 1
fi

cleanup

printf 'execution=sandbox\n'
printf 'user=%s\n' "$(id -un)"
printf 'uid=%s\n' "$(id -u)"
printf 'kernel=%s\n' "$(uname -srm)"

if command -v sudo >/dev/null 2>&1 && sudo -n true >/dev/null 2>&1; then
  printf 'sudo=available-without-password\n'
else
  printf 'sudo=unavailable-without-password\n'
fi

printf 'docker_context=%s\n' "$(docker context show)"
printf 'docker_server_version=%s\n' "$(docker version --format '{{.Server.Version}}')"
printf 'docker_server_os=%s\n' "$(docker info --format '{{.OperatingSystem}}')"

docker build --tag "${image_ref}" "${script_dir}"
container_output="$(docker run --name "${container_name}" "${image_ref}")"

if ! docker image inspect "${image_ref}" >/dev/null 2>&1; then
  printf 'error=tutorial image is missing from the sandbox Docker Engine\n' >&2
  exit 1
fi

if ! docker container inspect "${container_name}" >/dev/null 2>&1; then
  printf 'error=tutorial container is missing from the sandbox Docker Engine\n' >&2
  exit 1
fi

expected_output="$(<"${script_dir}/boundary-message.txt")"
if [[ "${container_output}" != "${expected_output}" ]]; then
  printf 'error=container output did not match boundary-message.txt\n' >&2
  exit 1
fi

printf 'sandbox_image=present\n'
printf 'sandbox_image_id=%s\n' "$(docker image inspect --format '{{.Id}}' "${image_ref}")"
printf 'sandbox_container=present\n'
printf 'sandbox_container_id=%s\n' "$(docker container inspect --format '{{.Id}}' "${container_name}")"
printf 'sandbox_container_state=%s\n' "$(docker container inspect --format '{{.State.Status}}' "${container_name}")"
printf 'container_output=%s\n' "${container_output}"
printf 'status=ok\n'
