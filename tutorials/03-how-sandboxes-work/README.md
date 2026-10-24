# How a Docker Sandbox works — supporting files

This folder contains the runnable boundary experiment for the third tutorial
in the Docker Sandboxes series. It creates a small image and stopped container
on the Docker Engine inside a local sandbox, then confirms that neither name
appears on the host Docker daemon.

The result makes the private Docker Engine observable. The tutorial combines
that evidence with Docker's documented architecture to explain the wider
microVM, workspace, network, and credential boundaries.

## Prerequisites

- A working local `sbx` installation and Docker account from Tutorial 2.
- A healthy local sandbox runtime reported by `sbx diagnose`.
- Docker Desktop or Docker Engine running on the host for the comparison.
- The host Docker CLI configured to use your normal local Docker context.
- Network access from the sandbox for the first `busybox:1.37.0` pull.

The host Docker daemon was optional in Tutorial 2. It is required here only so
we can compare its image and container state with the private daemon inside the
sandbox.

## Files

- `Dockerfile` defines a small image based on `busybox:1.37.0`.
- `boundary-message.txt` contains the stable line printed by the container.
- `inspect-sandbox-docker.sh` runs inside the sandbox. It reports the Linux
  environment and Docker server, builds the tutorial image, runs and retains
  the tutorial container, and verifies both objects.
- `check-host-docker.sh` runs on the host. It verifies that the tutorial image
  and container names are absent from the Docker daemon selected by the host
  CLI.

The experiment uses these fixed names:

```text
image:     docker-sandboxes-t03:local
container: docker-sandboxes-t03
sandbox:   sandbox-boundary
```

The scripts only remove the tutorial image and container inside the sandbox.
They do not remove a same-named host object. If the host check finds a naming
collision, it stops and asks you to resolve it deliberately.

## Run the experiment

Run all commands in this section from this directory.

### 1. Verify both local runtimes

Check the sandbox CLI and daemon:

```console
sbx version
sbx diagnose
```

Then confirm that the host Docker CLI targets the local daemon you intend to
use for comparison:

```console
docker context show
docker info
```

`docker info` must succeed before you continue. The displayed context and
server details vary by host.

### 2. Establish the host baseline

Run the host check before creating any Docker objects in the sandbox:

```console
./check-host-docker.sh
```

The stable result is:

```text
host_image=absent
host_container=absent
status=ok
```

This baseline prevents a same-named host object from being mistaken for an
object created by the sandbox experiment.

### 3. Create the sandbox

Create a named shell sandbox with this directory mounted as its workspace:

```console
sbx create --name sandbox-boundary shell .
```

If a sandbox with that name already exists, inspect it with `sbx ls` and either
finish its work or remove it deliberately before continuing.

### 4. Build and run on the sandbox Docker Engine

Execute the sandbox inspection script:

```console
sbx exec sandbox-boundary bash ./inspect-sandbox-docker.sh
```

The first build pulls `busybox:1.37.0`, so it can take longer than later runs.
Build progress, IDs, versions, the user name, and kernel details vary by host
and `sbx` version. The stable result ends with lines like these:

```text
sandbox_image=present
sandbox_container=present
sandbox_container_state=exited
container_output=This container is running on the sandbox Docker Engine.
status=ok
```

The script deliberately leaves the stopped container and image in the sandbox
so you can inspect them before cleanup:

```console
sbx exec sandbox-boundary docker image inspect docker-sandboxes-t03:local
sbx exec sandbox-boundary docker container inspect docker-sandboxes-t03
```

Both commands should return metadata from the sandbox Docker Engine.

### 5. Compare the host again

Repeat the same check from the host:

```console
./check-host-docker.sh
```

It should still report both names as absent and finish with `status=ok`. The
sandbox can inspect the image and container while the independently selected
host daemon cannot. That observation is the direct evidence this experiment
collects: the two Docker clients are using separate daemon state.

The name comparison does not by itself prove every property of the microVM or
hypervisor. Docker's architecture and security documentation establish the
separate-kernel and process boundary; this exercise makes the Docker Engine
part of that model visible.

## Clean up

Remove only the tutorial container and image from the sandbox:

```console
sbx exec sandbox-boundary bash ./inspect-sandbox-docker.sh cleanup
```

The cleanup finishes with:

```text
sandbox_container=removed
sandbox_image=removed
status=ok
```

Then remove the named sandbox:

```console
sbx rm sandbox-boundary
```

Confirm the sandbox no longer appears:

```console
sbx ls
```

## Troubleshooting

- If `check-host-docker.sh` cannot reach the selected daemon, start Docker
  Desktop or Docker Engine and verify the result of `docker context show`.
- If the host check reports an existing tutorial image or container, inspect
  that host object before deciding whether to rename or remove it. The script
  does not delete host Docker resources.
- If the sandbox script cannot reach Docker, run `sbx diagnose`, confirm that
  `sandbox-boundary` exists with `sbx ls`, and retry the command.
- If the BusyBox pull is blocked, inspect the sandbox policy log before
  changing policy. Detailed network-policy diagnosis belongs to Tutorial 6.
- If the build succeeds but a later check fails, rerun the sandbox script. It
  removes only its own prior sandbox image and container before rebuilding.

## References

- [Docker Sandboxes architecture](https://docs.docker.com/ai/sandboxes/architecture/)
- [Docker Sandboxes security model](https://docs.docker.com/ai/sandboxes/security/)
- [Docker Sandboxes isolation layers](https://docs.docker.com/ai/sandboxes/security/isolation/)
- [`sbx exec`](https://docs.docker.com/reference/cli/sbx/exec/)
