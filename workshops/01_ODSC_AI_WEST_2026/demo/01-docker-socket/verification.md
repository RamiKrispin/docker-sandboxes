# Docker socket demo verification

**Verified:** October 15, 2026  
**Platform:** macOS with Docker Desktop, context `desktop-linux`  
**Docker client/server:** 29.7.2 / 29.7.2

The six-line command in [runbook.md](runbook.md), with `DEMO_DIR` pointing to this demo's `fixture/` folder, completed with exit code 0. Container A was given only the Docker socket mount. Its client asked the host daemon to start B with the fixture folder mounted at `/host-data:ro`.

Actual stdout:

```text
Hello from a deliberately created host test file!
```

Both containers were temporary (`--rm`). The fixture remained unchanged. No host settings or existing workloads were changed. The two downloaded images remain available for rehearsal.

| Image tag used | Resolved registry digest |
| --- | --- |
| `docker:cli` | `docker@sha256:1a4c7cb63513f349bdad01fcc6e0f3f2f67d37b9da86f14dc0d4a0942eecda00` |
| `alpine:latest` | `alpine@sha256:294b683cb724975bec92580e1e685676bd4b50bda910ddb8c51d4cabeaec77e6` |

This records one local verification, not a guarantee for other daemon contexts or policies. Rehearse on the actual conference setup and re-check image versions, Docker Desktop sharing, and socket access before presenting.
