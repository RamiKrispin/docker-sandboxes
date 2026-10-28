# Docker socket demo verification

**Verified:** October 28, 2026

**Platform:** macOS with Docker Desktop, context `desktop-linux`

**Docker client/server:** 29.7.2 / 29.7.2

Both commands in [runbook.md](runbook.md) were run with `DEMO_DIR` pointing to this demo's `fixture/` folder. Without a mount or Docker socket, Container A could not read `/host-data/my-secrets.txt` and exited with code 1. With the socket mounted, A asked the host daemon to start B with the fixture folder mounted at `/host-data:ro`; B printed the dummy credentials and exited with code 0.

Actual baseline stderr:

```text
cat: can't open '/host-data/my-secrets.txt': No such file or directory
```

Actual socket-enabled stdout:

```text
# DEMO VALUES ONLY — NOT REAL CREDENTIALS
LLM_API_KEY=demo_llm_7H3K9P2M6R4X
VECTOR_DB_API_KEY=demo_vec_8N5Q1T7V3C9L
OBSERVABILITY_API_KEY=demo_obs_4W8D2J6S0F5A
```

Both containers were temporary (`--rm`). The fixture remained unchanged. No host settings or existing workloads were changed. The two downloaded images remain available for rehearsal.

| Image tag used | Resolved registry digest |
| --- | --- |
| `docker:cli` | `docker@sha256:5e6baf67325a79f64ed3bed6863954d5e05d0f3d4e57cbdb14809346814bbfdb` |
| `alpine:latest` | `alpine@sha256:be2656061b536c1883c4034790e21d0a09c5aaaf51968b89368a3c0371ea2c9a` |

This records one local verification, not a guarantee for other daemon contexts or policies. Rehearse on the actual conference setup and re-check image versions, Docker Desktop sharing, and socket access before presenting.
