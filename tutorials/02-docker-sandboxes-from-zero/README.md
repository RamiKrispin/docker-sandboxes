# Docker Sandboxes from zero — supporting files

This folder contains the runnable example for the second tutorial in the
Docker Sandboxes series. It uses the `shell` environment, so the lifecycle can
be explored without installing an AI agent or configuring a model-provider
credential.

## Prerequisites

- A host supported by local Docker Sandboxes with virtualization enabled.
- The `sbx` CLI installed and available on `PATH`.
- A Docker account for `sbx login`.

Use Docker's [installation guide](https://docs.docker.com/ai/sandboxes/install/)
for current operating-system requirements and installation commands. Docker
Desktop or Docker Engine is not required on the host to install and use `sbx`.

## Install `sbx`

Choose the instructions for the host operating system. These commands install
the `sbx` CLI; the local sandbox runtime still requires the virtualization
support listed below.

### macOS

Local sandboxes require macOS Sonoma 14 or later on Apple silicon. Install
`sbx` with Homebrew:

```console
brew trust docker/tap
brew install docker/tap/sbx
```

### Windows

Local sandboxes require Windows 11 on a 64-bit Intel or AMD processor. Open an
elevated PowerShell prompt and enable Windows Hypervisor Platform:

```powershell
Enable-WindowsOptionalFeature -Online -FeatureName HypervisorPlatform -All
```

Install `sbx` for the current user with Windows Package Manager:

```powershell
winget install -h Docker.sbx
```

The per-user installation does not require administrator privileges. Open a
new terminal after installation so the updated `PATH` is available.

### Ubuntu

Local sandboxes require Ubuntu 24.04 or later, a supported 64-bit Intel, AMD,
or Arm processor, and KVM virtualization. Verify that a KVM module is loaded:

```console
lsmod | grep kvm
```

A working host reports `kvm_intel`, `kvm_amd`, `kvm_arm64`, or `kvm`. Add the
current user to the `kvm` group if needed:

```console
sudo usermod -aG kvm "$USER"
```

Sign out and back in after changing group membership, or run `newgrp kvm`.

To install only `sbx`, add Docker's `apt` repository and install the package:

```console
curl -fsSL https://get.docker.com | sudo REPO_ONLY=1 sh
sudo apt install docker-sbx
```

Alternatively, install Docker Engine and `sbx` together:

```console
curl -fsSL https://get.docker.com | sudo SBX=1 sh
```

Docker does not test or support Docker Sandboxes on Ubuntu derivatives such as
Linux Mint or Pop!_OS. Consult the manual release installation instructions
instead of using the convenience script on an unsupported distribution.

### Sign in and verify the installation

After installing the CLI, open a new terminal and run:

```console
sbx version
sbx login
sbx daemon start --detach
sbx diagnose
```

`sbx login` opens a browser for Docker authentication. Starting the daemon with
`--detach` keeps it running in the background and returns control to the
terminal. Continue only after `sbx diagnose` reports a usable local runtime;
warnings may vary by host.

## Files

- `inspect-sandbox.sh` prints a small set of observable facts about the shell
  sandbox and confirms that its Docker client can reach the sandbox's Docker
  daemon.

## Run the lifecycle

Run all host commands from this directory. The example uses the fixed sandbox
name `sandbox-zero`; remove or rename an existing sandbox with that name before
starting.

### 1. Recheck the CLI

```console
sbx version
sbx diagnose
```

`sbx diagnose` should complete without a failed local-runtime check. Warnings
may vary by host configuration.

### 2. Create the shell sandbox

```console
sbx create --name sandbox-zero shell .
sbx ls
```

The `.` mounts this tutorial directory as the sandbox's primary workspace. A
local sandbox created without an attached session normally appears as stopped.

### 3. Run the inspection script

```console
sbx exec sandbox-zero bash ./inspect-sandbox.sh
```

`sbx exec` starts the sandbox if it is stopped. The output contains values that
depend on the installed version and host, followed by:

```text
status=ok
```

### 4. Attach, stop, and restart

Attach to the shell:

```console
sbx run --name sandbox-zero
```

From inside the sandbox, run:

```console
bash ./inspect-sandbox.sh
```

Leave that shell open. In a second host terminal, stop the sandbox:

```console
sbx ls
sbx stop sandbox-zero
sbx ls
```

The attached shell closes when the sandbox stops. Restart and reconnect from
the host:

```console
sbx run --name sandbox-zero
```

Run the inspection script once more, then leave the sandbox shell:

```console
bash ./inspect-sandbox.sh
exit
```

### 5. Remove the sandbox

Back on the host, remove the sandbox and confirm that it is no longer listed:

```console
sbx rm sandbox-zero
sbx ls
```

`sbx rm` asks for confirmation before deleting the sandbox. It removes the
sandbox's VM and sandbox-owned contents. The files in this mounted tutorial
directory remain on the host.

## Expected checks

The lifecycle is complete when:

- `sbx diagnose` reports a usable local runtime.
- `inspect-sandbox.sh` finishes with `status=ok`.
- `sbx ls` shows `sandbox-zero` while it exists and no longer shows it after
  removal.
- This tutorial directory and its files remain after `sbx rm`.

## Troubleshooting

- If `sbx` is not found, complete the installation guide and open a new shell
  so the updated `PATH` is loaded.
- If sign-in fails, retry `sbx login` and complete the browser-based Docker
  authentication flow.
- If `sbx diagnose` reports a virtualization failure, check the platform
  prerequisites before creating the sandbox.
- If `sbx diagnose` reports `Daemon — not reachable` and the daemon socket is
  absent, run `sbx daemon start --detach`, then run `sbx diagnose` again.
- If an existing daemon stops responding, run `sbx daemon restart`, then retry
  the failed command.
- If `sandbox-zero` already exists, inspect it with `sbx ls` and use another
  name or remove the existing sandbox deliberately.
