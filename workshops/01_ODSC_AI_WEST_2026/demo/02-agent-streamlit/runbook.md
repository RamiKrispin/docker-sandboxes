# Sales dashboard demonstration

Use slide 13 from 33:00 to 42:00. Its default view contains the task and synthetic CSV; the other views explain the canonical prepared example. Generated files may differ. Never describe prepared code or a recording as newly generated output.

## Before presenting

Complete [agent preparation](../../presenter/agent-launch.md), select the intended effective network policy, and prepare `odsc-demo` with this demo directory as its direct workspace. Check `sbx ls` first: a reused name can reconnect to an existing configuration. Start the agent beforehand. Keep its session open while demonstrating the service; a foreground session exit may stop the sandbox. `sbx run --detach --name odsc-demo` is available for an existing sandbox that must stay running without an attached session. Confirm the actual lifecycle and both forwarding hops during rehearsal.

Cache Python dependencies and `odsc-sales:workshop` **inside this sandbox's Docker engine**. A host Docker Desktop image cache is separate. The prepared implementation is in `expected-output/`; the starting project contains `data/sales.csv` and the task prompt. To keep the fallback intact, give the agent the task in [task-prompt.md](task-prompt.md) and have it write in the project root. The prompt is a task description; configured access enforces the boundary.

## Nine-minute route

| Clock | Action |
| --- | --- |
| 33:00–34:00 | Show the CSV, the four required dashboard outputs, and the task prompt. |
| 34:00–36:00 | Submit the task to the already prepared agent. Limit generation to two minutes. |
| 36:00–38:00 | Inspect the generated filter expression and Dockerfile start command. Use the prepared files/image if unfinished. |
| 38:00–40:00 | Show the sandbox engine's container, publish sandbox port 8501, and open the assigned host port. |
| 40:00–42:00 | Select West and Notebook; compare $4,200 with the unfiltered $19,000. Explain the two port hops and writable project. |

The fuller Python aggregation/chart view is for questions. Leave this segment by 42:00. At 36:00, announce “switching to the prepared example” if generation is incomplete. Use the local [dashboard fallback](../../presenter/prepared-dashboard.html) or [recording](../../recordings/sales-app-prepared-backup.webm) if live execution is slow.

## Build and run: inside the sandbox

From the generated project's directory, with `app.py`, `requirements.txt`, `Dockerfile`, and `data/` present:

```bash
docker build -t odsc-sales:workshop .
docker run -d --name odsc-sales -p 8501:8501 odsc-sales:workshop
```

For the fallback, first change to `expected-output/` inside the shared demo workspace and use the same commands. Prebuild before the session. Do not start another container with the same name or port: inspect `docker ps -a --filter name=odsc-sales` and use the prepared workshop container. If replacing that known container, stop it and remove only that container after preserving any needed result.

The server binds `0.0.0.0:8501` **inside the app container**. `-p 8501:8501` exposes it at sandbox port 8501. `EXPOSE` alone does not publish a port.

## Publish: host terminal

```bash
sbx ports odsc-demo --publish 8501
sbx ports odsc-demo
```

Read the actual assigned loopback host port from the second command and open `http://127.0.0.1:PORT` with that value. Do not guess a port from the slide diagram. Verify `sbx exec odsc-demo docker ps` and the service before the presentation. Port publishing can start a stopped sandbox; keeping it alive while the audience uses it still needs rehearsal.

## Expected checks

The 12-row fixture totals $19,000. West totals $10,500. West plus Notebook totals $4,200 across three rows. Clearing a filter gives $0 and guidance without a chart exception. With the prepared dependencies installed, run `python check_app.py` from this demo directory to check these behaviors using Streamlit AppTest.

See [verification.md](verification.md) for what was actually tested. Container validation on the host proves the prepared application; it does not prove a sandbox/model session or sandbox-to-host forwarding.

## End of demonstration

Keep the sandbox for the access explanation if needed. Before removing any sandbox, preserve commits/files needed from clone or internal storage. Stop only the workshop container when finished (`docker stop odsc-sales` from its sandbox), then remove that container (`docker rm odsc-sales`). The forwarding entry can be removed using `sbx ports odsc-demo --unpublish HOST_PORT:8501` with the exact observed host port. Stop the named sandbox when done: `sbx stop odsc-demo`. Removal is a separate destructive step, `sbx rm odsc-demo`; do it only after preserving the work. Host workspace edits survive sandbox removal.

Sources: [Docker Sandboxes usage](https://docs.docker.com/ai/sandboxes/usage/), [Streamlit AppTest](https://docs.streamlit.io/develop/api-reference/app-testing), [Docker publishing](https://docs.docker.com/get-started/docker-concepts/running-containers/publishing-ports/).
