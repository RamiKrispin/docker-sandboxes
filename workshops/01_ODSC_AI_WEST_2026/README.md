# Running AI Agents Safely with Docker Sandboxes

This folder contains the slides and hands-on material for the 60-minute ODSC
AI West 2026 workshop. You will inspect the risk of exposing a Docker socket,
launch and manage a local Docker Sandbox with explicit permissions and resources,
then use Codex inside a sandbox to build a small Streamlit application.

## What you need

You can follow the presentation with only a modern web browser. To run the
exercises on your own computer, prepare the tools listed below before the
workshop.

| Exercise | Required on the host |
| --- | --- |
| 1. Docker socket | A running local Docker Engine and the `docker` CLI |
| 2. Getting started with Docker Sandboxes | Docker Sandboxes (`sbx`), a Docker account, a POSIX-compatible terminal, and OpenAI access for the Codex route (or use `shell` without model credentials) |
| 3. Streamlit app with Codex | Docker Sandboxes (`sbx`), a Docker account, an OpenAI account with Codex access, a terminal, and a browser |
| Optional access-controls extension | Docker Sandboxes (`sbx`), Git, and `curl` |
| Slides | A browser; Node.js and npm are needed only to rebuild or serve the deck |

Basic familiarity with a terminal and project files is helpful. No prior
experience with Docker Sandboxes, microVMs, Streamlit, or security is required.

> **Prepare on a reliable network.** The first sandbox launch downloads the
> Codex sandbox template, and the exercises may download container images and
> Python packages. The workshop folder itself is approximately 9 MB, but the
> exact tool and runtime downloads depend on platform, version, and local
> caches. Plan for multiple gigabytes of network transfer and free disk space
> for a cold setup. Each sandbox keeps its own VM, Docker images, containers,
> and package cache.

## 1. Get the workshop files

Clone this repository, or download and extract its ZIP archive:

```bash
git clone https://github.com/RamiKrispin/docker-sandboxes.git
cd docker-sandboxes/workshops/01_ODSC_AI_WEST_2026
```

If you already have the repository, change to the workshop directory from its
root:

```bash
cd workshops/01_ODSC_AI_WEST_2026
```

The remaining commands assume this workshop directory is your current
directory unless a guide says otherwise.

## 2. Install Docker Sandboxes

Docker Sandboxes runs locally on the following supported hosts:

- macOS 14 (Sonoma) or later on Apple silicon;
- Windows 11 on a 64-bit Intel or AMD processor, with Windows Hypervisor
  Platform enabled; or
- Ubuntu 24.04 or later on a supported 64-bit Intel, AMD, or Arm processor,
  with KVM enabled.

Nested virtualization is required when the local sandbox runs inside another
VM or virtual desktop. Docker does not currently test Ubuntu derivatives such
as Linux Mint or Pop!_OS. See the official [Docker Sandboxes installation
guide](https://docs.docker.com/ai/sandboxes/install/) for current requirements
and manual installation packages.

### macOS

Install Homebrew first if it is not already available, then run:

```bash
brew trust docker/tap
brew install docker/tap/sbx
```

### Windows

Open **PowerShell as Administrator** once and enable Windows Hypervisor
Platform:

```powershell
Enable-WindowsOptionalFeature -Online -FeatureName HypervisorPlatform -All
```

Restart Windows if prompted. Then install `sbx` for your user:

```powershell
winget install -h Docker.sbx
```

Open a new terminal after installation so the updated `PATH` is loaded.

### Ubuntu

Verify that KVM is available:

```bash
lsmod | grep kvm
```

The output should include `kvm_intel`, `kvm_amd`, `kvm_arm64`, or `kvm`. Add
your user to the `kvm` group, then sign out and back in (or run `newgrp kvm`):

```bash
sudo usermod -aG kvm "$USER"
```

Install only Docker Sandboxes:

```bash
curl -fsSL https://get.docker.com | sudo REPO_ONLY=1 sh
sudo apt install docker-sbx
```

If you also need Docker Engine for Exercise 1, install both together instead:

```bash
curl -fsSL https://get.docker.com | sudo SBX=1 sh
```

Docker Desktop or Docker Engine is **not** required by `sbx` itself. It is
required only for the Docker socket exercise, which intentionally uses the
host Docker daemon.

## 3. Sign in and verify the local runtime

Run these commands in a host terminal:

```bash
sbx version
sbx login
sbx daemon start --detach
sbx diagnose
```

`sbx login` opens Docker's browser sign-in. `sbx diagnose` should finish
without a blocking failure. You can inspect existing sandboxes at any time:

```bash
sbx ls
```

If a sandbox is listed as `running (not responding)`, stop and start only that
sandbox:

```bash
sbx stop SANDBOX_NAME
sbx start SANDBOX_NAME
```

If commands cannot reach the sandbox daemon, try `sbx daemon restart`, then run
`sbx diagnose` again. Avoid `sbx reset` during the workshop: it removes all
local sandbox data and cached images.

## 4. Authenticate Codex

The Streamlit exercise uses the built-in Codex agent. Set up OpenAI OAuth on
the host before the workshop:

```bash
sbx secret set openai --oauth
```

The browser-based sign-in stores the resulting credential in the host's secure
credential store. The credential is not written to this repository or exposed
inside the sandbox. You do not need to paste an OpenAI API key for this
workshop. If your organization requires an API key instead, use the alternative
documented in the official [Codex sandbox
guide](https://docs.docker.com/ai/sandboxes/agents/codex/).

Never put a model-provider token in the workshop files, a command line, or
shell history.

## 5. Install Docker for the socket exercise

Exercise 1 is separate from Docker Sandboxes: it demonstrates the authority
granted by mounting a host Docker socket. Install and start [Docker
Desktop](https://docs.docker.com/desktop/) on macOS or Windows, or [Docker
Engine](https://docs.docker.com/engine/install/) on Linux. Verify that the
client can reach the intended local daemon:

```bash
docker context show
docker version
```

Before arriving, pre-download the two small exercise images:

```bash
docker pull docker:cli
docker pull alpine
```

Do not change Docker security settings or mount personal directories for this
exercise. The runbook uses only the harmless fixture supplied with the
workshop.

## 6. Run the preflight checklist

Complete this checklist while you still have reliable internet access:

```bash
sbx version
sbx diagnose
sbx ls
git --version
curl --version
```

For Exercise 1, also confirm:

```bash
docker version
docker image inspect docker:cli alpine
```

For Exercise 2, confirm that the demo inputs exist:

```bash
ls demo/03-agent-streamlit/data/sales.csv \
  demo/03-agent-streamlit/task-prompt.md \
  demo/03-agent-streamlit/expected-output
```

Windows PowerShell users can run:

```powershell
Get-ChildItem `
  demo/03-agent-streamlit/data/sales.csv, `
  demo/03-agent-streamlit/task-prompt.md, `
  demo/03-agent-streamlit/expected-output
```

Live Codex requests still require internet access. Previously downloaded
sandbox templates, images, and packages remain cached, which reduces the
impact of intermittent venue Wi-Fi.

## 7. Run the exercises

Follow the guides in order. Each guide identifies whether a command runs on
the host or inside a sandbox and includes its own cleanup steps.

1. [Docker socket demonstration](demo/01-docker-socket/runbook.md) — observe
   why access to a host Docker daemon is a high-trust capability.
2. [Getting started with Docker Sandboxes](demo/02-getting-started/README.md) —
   launch a named sandbox, allocate CPU and memory, attach to the agent or shell,
   verify writable/read-only access and network rules, and stop/restart it. Keep
   the [command reference](demo/02-getting-started/getting-started.md) alongside it.
3. [Build a Streamlit app with Codex](demo/03-agent-streamlit/README.md) —
   apply the core commands to an app-building task and publish its service port.

The optional [workspace and network extension](demo/extensions/access-controls/README.md)
compares direct and cloned workspaces in more detail.

The complete Streamlit guide includes PowerShell alternatives for host file
operations. Demos 1 and 2 and the optional access-controls extension use POSIX
shell syntax. On Windows, use an appropriate POSIX-compatible terminal or translate the shell
setup commands to PowerShell; rehearse the Docker socket command with Docker
Desktop's Linux-container mode before relying on it live.

Useful commands during the exercises:

```bash
sbx ls                                  # list sandboxes and status
sbx run --name SANDBOX_NAME             # reconnect to its agent
sbx exec -it SANDBOX_NAME bash          # open a shell; SSH is not required
sbx ports SANDBOX_NAME                  # show published ports
sbx policy ls SANDBOX_NAME --wide       # show effective policy rules
sbx stop SANDBOX_NAME                   # stop it and preserve its state
sbx rm SANDBOX_NAME                     # remove its private state
```

Do not reuse or remove a sandbox that belongs to other work. If a workshop
name is already taken, choose a fresh name and use it consistently throughout
the guide.

## Slide deck

The deck already contains local browser assets and can be opened directly at
[slides/index.html](slides/index.html). To rebuild it and use the local server
and speaker notes, install Node.js and npm, then run from the repository root:

```bash
cd workshops/01_ODSC_AI_WEST_2026/slides
npm ci
npm run build
npm start
```

Open <http://127.0.0.1:4173/slides/index.html>. Use Left/Right or Space to
navigate, press **S** for speaker notes, and stop the server with Ctrl+C.

## Workshop resources

- [Interactive slide deck](slides/index.html)
- [Workshop resources and official references](slides/resources.md)
- [Docker Sandboxes installation](https://docs.docker.com/ai/sandboxes/install/)
- [Docker Sandboxes usage](https://docs.docker.com/ai/sandboxes/usage/)
- [Codex in Docker Sandboxes](https://docs.docker.com/ai/sandboxes/agents/codex/)
- [Docker Sandboxes troubleshooting](https://docs.docker.com/ai/sandboxes/troubleshooting/)

The prepared slides and fallback material work without external requests after
setup. Live coding-agent calls and uncached dependency or image downloads still
require connectivity.
