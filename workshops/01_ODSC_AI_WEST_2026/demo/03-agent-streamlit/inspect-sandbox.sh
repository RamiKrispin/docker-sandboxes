#!/usr/bin/env bash

# Concise host-side Docker Sandboxes inspection report.
# Usage: ./inspect-sandbox.sh [--verbose] [SANDBOX_NAME]

set -uo pipefail

sandbox_name="odsc-demo"
sandbox_name_set="no"
verbose="no"
warning_count=0

usage() {
  printf 'usage: %s [--verbose] [SANDBOX_NAME]\n' "${0##*/}"
}

section() {
  printf '\n%s\n' "$1"
}

label() {
  printf '  %-18s %s\n' "$1" "$2"
}

warning() {
  printf '  WARNING: %s\n' "$1" >&2
  warning_count=$((warning_count + 1))
}

for argument in "$@"; do
  case "${argument}" in
    -v|--verbose)
      verbose="yes"
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    -*)
      printf 'error: unknown option: %s\n' "${argument}" >&2
      usage >&2
      exit 2
      ;;
    *)
      if [[ "${sandbox_name_set}" == "yes" ]]; then
        printf 'error: provide only one sandbox name\n' >&2
        usage >&2
        exit 2
      fi
      sandbox_name="${argument}"
      sandbox_name_set="yes"
      ;;
  esac
done

for required_command in awk bash grep sbx sed; do
  if ! command -v "${required_command}" >/dev/null 2>&1; then
    printf 'error: required command not found: %s\n' "${required_command}" >&2
    exit 1
  fi
done

if ! sandbox_list="$(sbx ls)"; then
  printf 'error: unable to list sandboxes; check sbx login and the host credential service\n' >&2
  exit 1
fi

sandbox_row="$(
  awk -v name="${sandbox_name}" 'NR > 1 && $1 == name { print; exit }' \
    <<<"${sandbox_list}"
)"

if [[ -z "${sandbox_row}" ]]; then
  printf 'error: sandbox not found: %s\n' "${sandbox_name}" >&2
  exit 1
fi

agent="$(awk '{ print $2 }' <<<"${sandbox_row}")"
if grep -q 'running' <<<"${sandbox_row}"; then
  status="running"
  if grep -q '(detached)' <<<"${sandbox_row}"; then
    status="running (detached)"
  fi
elif grep -q 'stopped' <<<"${sandbox_row}"; then
  status="stopped; inspection will start it"
else
  status="unknown"
fi

sbx_version="$(sbx version 2>&1 | awk 'NR == 1 { print $3 }')"
host_description="$(uname -srm 2>/dev/null || printf 'unavailable')"

printf '\nDocker Sandbox: %s\n' "${sandbox_name}"
printf '%s\n' '========================================'

section 'OVERVIEW'
label 'Status' "${status}"
label 'Agent' "${agent}"
label 'sbx CLI' "${sbx_version:-unavailable}"
label 'Host' "${host_description}"

section 'PORTS'
if ports_output="$(sbx ports "${sandbox_name}")"; then
  port_count="$(awk 'NR > 1 && NF { count++ } END { print count + 0 }' <<<"${ports_output}")"
  if ((port_count == 0)); then
    label 'Published' 'none'
  else
    awk 'NR > 1 && NF {
      printf "  %-18s %s:%s -> %s/%s\n", "Published", $1, $2, $3, $4
    }' <<<"${ports_output}"
  fi
else
  warning 'could not inspect published ports'
fi

filesystem_policy=""
network_policy=""

if ! filesystem_policy="$(
  sbx policy ls "${sandbox_name}" --type filesystem --wide
)"; then
  warning 'could not inspect the filesystem policy'
fi

if ! network_policy="$(
  sbx policy ls "${sandbox_name}" --type network --wide
)"; then
  warning 'could not inspect the network policy'
fi

section 'POLICIES'
if grep -Eq 'filesystem:read.*allow.*\*\*' <<<"${filesystem_policy}" && \
   grep -Eq 'filesystem:write.*allow.*\*\*' <<<"${filesystem_policy}"; then
  label 'Filesystem' 'policy allows; mounts set actual access'
elif [[ -n "${filesystem_policy}" ]]; then
  label 'Filesystem' 'custom rules (use --verbose)'
else
  label 'Filesystem' 'unavailable'
fi

if grep -q 'default-allow-all' <<<"${network_policy}"; then
  label 'Network' 'outbound TCP allowed by default'
elif grep -q 'allow' <<<"${network_policy}"; then
  label 'Network' 'restricted allowlist (use --verbose)'
elif [[ -n "${network_policy}" ]]; then
  label 'Network' 'restricted (use --verbose)'
else
  label 'Network' 'unavailable'
fi

if ! sbx exec -i "${sandbox_name}" bash -s -- "${verbose}" <<'SANDBOX_INSPECT'
set -uo pipefail

verbose="$1"

section() {
  printf '\n%s\n' "$1"
}

label() {
  printf '  %-18s %s\n' "$1" "$2"
}

first_line() {
  "$@" 2>&1 | awk 'NR == 1 { print; exit }'
}

inspect_directory() {
  local display_name="$1"
  local directory="$2"
  local access="unavailable"
  local display_path
  local mount_details
  local probe

  if [[ ! -e "${directory}" ]]; then
    label "${display_name}" "not mounted (${directory})"
    return
  fi

  directory="$(cd -- "${directory}" 2>/dev/null && pwd -P)"
  display_path="${directory}"
  if [[ "${verbose}" != "yes" ]]; then
    display_path="${directory##*/}"
  fi

  if [[ -r "${directory}" && -x "${directory}" ]]; then
    access="read-only"
  fi

  probe="${directory}/.sbx-inspect-write-test.$$"
  if (umask 077 && : >"${probe}") 2>/dev/null; then
    rm -f -- "${probe}"
    access="read/write"
  fi

  label "${display_name}" "${access}  ${display_path}"

  if [[ "${verbose}" == "yes" ]] && command -v findmnt >/dev/null 2>&1; then
    mount_details="$(
      findmnt -n -T "${directory}" -o TARGET,FSTYPE,OPTIONS 2>/dev/null || true
    )"
    label 'Mount details' "${mount_details:-unavailable}"
  fi
}

section 'WORKSPACES'
inspect_directory 'Primary' "${PWD}"
inspect_directory 'Expected output' '../expected-output'

section 'RUNTIME'
label 'User' "$(id -un) (uid $(id -u), gid $(id -g))"
label 'OS' "$(uname -srm)"
label 'Architecture' "$(uname -m)"

if command -v nproc >/dev/null 2>&1; then
  label 'CPU' "$(nproc) cores"
fi

if [[ -r /proc/meminfo ]]; then
  memory="$(
    awk '/^MemTotal:/ { printf "%.1f GiB", $2 / 1024 / 1024 }' /proc/meminfo
  )"
  label 'Memory' "${memory}"
fi

label 'Bash' "${BASH_VERSION}"
if command -v git >/dev/null 2>&1; then
  label 'Git' "$(first_line git --version)"
else
  label 'Git' 'unavailable'
fi

if command -v codex >/dev/null 2>&1; then
  label 'Codex' "$(first_line codex --version)"
else
  label 'Codex' 'unavailable'
fi

section 'DOCKER'
if command -v docker >/dev/null 2>&1 && docker info >/dev/null 2>&1; then
  docker_client="$(docker version --format '{{.Client.Version}}')"
  docker_server="$(docker version --format '{{.Server.Version}}')"
  label 'Engine' "reachable (client ${docker_client}, server ${docker_server})"

  if [[ -n "$(docker ps -a -q)" ]]; then
    docker ps -a --format '{{.Names}}|{{.Status}}|{{.Ports}}' |
      while IFS='|' read -r container_name container_status container_ports; do
        label 'Container' \
          "${container_name} | ${container_status} | ${container_ports:-no ports}"
      done
  else
    label 'Containers' 'none'
  fi

  if [[ "${verbose}" == "yes" ]]; then
    printf '\n  Docker networks\n'
    docker network ls --format '{{.Name}} | {{.Driver}} | {{.Scope}}' |
      sed 's/^/    /'
  fi
else
  label 'Engine' 'unreachable'
fi

if [[ "${verbose}" == "yes" ]]; then
  section 'SANDBOX NETWORK DETAILS'
  if command -v ip >/dev/null 2>&1; then
    ip -brief address 2>/dev/null | sed 's/^/  /' || true
    ip route 2>/dev/null | sed 's/^/  /' || true
  else
    label 'Interfaces' '`ip` command unavailable'
  fi

  if command -v ss >/dev/null 2>&1; then
    ss -lntup 2>/dev/null | sed 's/^/  /' || true
  else
    label 'Listeners' '`ss` command unavailable'
  fi
fi
SANDBOX_INSPECT
then
  warning 'inside-sandbox inspection failed'
fi

if [[ "${verbose}" == "yes" ]]; then
  section 'FULL POLICY DETAILS'
  printf '\n  Filesystem\n'
  sed 's/^/    /' <<<"${filesystem_policy}"
  printf '\n  Network\n'
  sed 's/^/    /' <<<"${network_policy}"
  printf '\n  Recent network decisions\n'
  if network_log="$(
    sbx policy log "${sandbox_name}" --type network --limit 10
  )"; then
    sed 's/^/    /' <<<"${network_log}"
  else
    warning 'could not inspect recent network decisions'
  fi
fi

section 'RESULT'
if ((warning_count == 0)); then
  label 'Status' 'OK'
else
  label 'Status' "PARTIAL (${warning_count} warning(s))"
fi
