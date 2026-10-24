# Docker socket demonstration

This six-minute demonstration supports slides 08–09. Container A receives the host Docker socket. Its Docker client asks the same daemon to create container B, which mounts the workshop's dummy fixture directory read-only and prints `proof.txt`.

The browser deck illustrates and explains this request chain. It never runs Docker commands or displays a fabricated terminal result.

## Preparation in the host shell

Run from `workshops/01_ODSC_AI_WEST_2026/` in a terminal on the presenter machine. Use the local Docker daemon, not a remote context: bind-mount paths are resolved on the daemon host. On macOS this demonstration uses Docker Desktop, whose Linux VM and file-sharing settings mediate access to the Mac folder.

```bash
docker context show
docker version
export DEMO_DIR="$PWD/demo/01-docker-socket/fixture"
test -f "$DEMO_DIR/proof.txt"
cat "$DEMO_DIR/proof.txt"
docker pull docker:cli
docker pull alpine
```

Confirm the selected context is the intended local engine before proceeding. Pre-pull images and inspect the harmless fixture before the session. No personal files, secrets, full home directory, or root filesystem are needed. Do not change daemon or Desktop security settings to make the demonstration work; use the fallback if existing policy blocks socket access.

`DEMO_DIR` is an absolute host path prepared here. The host shell expands it before container A starts; A does not discover the host directory itself. The `:ro` below protects the fixture mount in B. It does not restrict the API authority granted by the Docker socket.

## Slide 09 command

```bash
docker run --rm \
  -v /var/run/docker.sock:/var/run/docker.sock \
  docker:cli \
  docker run --rm \
    -v "$DEMO_DIR:/host-data:ro" \
    alpine cat /host-data/proof.txt
```

Expected result, to compare with the actual terminal run:

```text
Hello from a deliberately created host test file!
```

Both containers use `--rm` and exit after printing the file. The fixture remains in the workshop folder. The downloaded images remain cached; this demo does not prune images or remove unrelated resources.

## What to explain

| Highlight step | Code lines | Observation / explanation |
| --- | --- | --- |
| 1 | 1, 3 | Host shell starts A from an image containing a Docker client |
| 2 | 2 | A receives a client connection to the host daemon |
| 3 | 4 | A's client asks that daemon to start B |
| 4 | 5 | The daemon supplies the deliberately chosen read-only bind mount to B |
| 5 | 6 | B reads the fixture and returns its contents |
| 6 | 1–6 | The file mount belongs to B; the socket connection belongs to A |

The two containers are siblings managed by the same daemon. This is not Docker-in-Docker and does not demonstrate a kernel exploit. Socket exposure is a deliberate configuration, not a feature of every container. Actual daemon privileges, authorization controls, and Desktop file sharing affect the result.

## Six-minute route and fallback

- **Minutes 0–2:** Ask for a prediction and step through the highlighted command.
- **Minutes 2–5:** Show the fixture and run the prepared command once. Inspect the result.
- **Minute 5–6:** Connect the result to the daemon request and the diagram.

If the engine, socket, image registry, or file sharing prevents a run, use the [recorded-result replay](../../presenter/socket-recorded-result.html) or [local fallback video](../../recordings/socket-demo-backup.webm). These show the real stdout captured in [recorded-output.json](recorded-output.json), with a readable playback duration rather than the original subsecond timing. They are labeled as recorded results. [verification.md](verification.md) records the tested versions and image digests.

Slide 08's animation is a separate illustration of the mechanism. Do not present an expected result, replay, or animated comic as a successful new live execution.

Record the final presentation-machine versions and image digests during rehearsal; floating image tags can change. Preserve the full ten-minute Q&A at the end of the workshop.

## Sources

- [Docker daemon attack surface](https://docs.docker.com/engine/security/#docker-daemon-attack-surface)
- [Bind-mount considerations](https://docs.docker.com/engine/storage/bind-mounts/#considerations-and-constraints)
- [Docker Desktop permissions on Mac](https://docs.docker.com/desktop/setup/install/mac-permission-requirements/)
