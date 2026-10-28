# Demo 03 — Build a Streamlit app with Codex

In this exercise, Codex creates a Streamlit sales dashboard inside a Docker
Sandbox. The generated project is shared with the host, while its commands,
packages, Docker images, and application container run inside the sandbox.

Run all `sbx` commands from a host terminal. Commands entered into Codex are
identified separately.

After [Demo 02](../02-getting-started/README.md), we apply the same launch,
workspace, and lifecycle commands to an app-building task. This exercise uses
a separate sandbox, `odsc-demo`; `odsc-basics` remains the getting-started sandbox.

## Before you begin

You need:

- Docker Sandboxes installed on a supported macOS, Windows, or Linux host;
- a Docker account and OpenAI account with Codex access;
- a terminal and web browser; and
- network access for authentication, Codex, and uncached downloads.

Docker Desktop is not required for this exercise. The sandbox provides its own
Docker Engine.

## 1. Verify Docker Sandboxes

```bash
sbx version
sbx run --help
```

Both commands should complete successfully.

## 2. Sign in

Sign in to Docker:

```bash
sbx login
```

Configure Codex with OpenAI OAuth:

```bash
sbx secret set openai --oauth
```

The OAuth flow stores the credential on the host. Do not place an API key in
the workshop files.

## 3. Open the demo directory

From the repository root:

```bash
cd workshops/01_ODSC_AI_WEST_2026/demo/03-agent-streamlit
```

Confirm that the source files are present:

```bash
ls data/sales.csv task-prompt.md expected-output
```

PowerShell users can run:

```powershell
Get-ChildItem data/sales.csv, task-prompt.md, expected-output
```

## 4. Check for an existing sandbox

```bash
sbx ls
```

Use the result to choose one path:

- If `odsc-demo` is not listed, continue to Step 5.
- If `odsc-demo` is listed and belongs to this exercise, run the following
  command and compare the full path with this demo directory's
  `demo-workspace` folder:

  ```bash
  sbx exec odsc-demo pwd
  ```

  The full path must point into `demo/03-agent-streamlit/demo-workspace`;
  checking only the last folder name is insufficient. A sandbox created before
  the demo directory move keeps its original mounts. If the path differs,
  choose a fresh sandbox name and use it throughout this guide; reconnecting
  does not update mounts. Preserve any needed sandbox-only files before
  separately removing an older sandbox.

  If the full path matches, prepare the local folder in Step 5 and use the
  reconnect command in Step 6.
- If `odsc-demo` belongs to other work or points to another workspace, do not
  reuse or remove it. Choose a different sandbox name and use that name in all
  subsequent commands.

## 5. Create the writable demo folder

The `demo-workspace` folder contains the task inputs and everything Codex
generates. The stable `expected-output` folder remains outside it.

On macOS or Linux:

```bash
mkdir -p demo-workspace/data
cp data/sales.csv demo-workspace/data/
cp task-prompt.md demo-workspace/
```

On Windows PowerShell:

```powershell
New-Item -ItemType Directory -Force demo-workspace/data
Copy-Item data/sales.csv demo-workspace/data/
Copy-Item task-prompt.md demo-workspace/
```

Confirm the starting files:

```bash
ls demo-workspace demo-workspace/data
```

At this point, the folder should contain only `task-prompt.md` and
`data/sales.csv`. If it also contains `app.py`, `requirements.txt`, or a
`Dockerfile`, it contains output from an earlier run. Preserve anything you
need, then replace the folder before continuing if you want a clean run.

## 6. Create or start the sandbox

### First use

If `odsc-demo` was not listed in Step 4, create it:

```bash
sbx run --detach --name odsc-demo codex ./demo-workspace ./expected-output:ro
```

This command defines:

| Value | Role |
| --- | --- |
| `--detach` | Starts the sandbox in the background |
| `--name odsc-demo` | Assigns a reusable sandbox name |
| `codex` | Selects the built-in Codex agent |
| `./demo-workspace` | Primary read-write workspace |
| `./expected-output:ro` | Additional read-only prepared workspace |

The agent and workspace mounts are saved when the sandbox is created.

### Existing workshop sandbox

If `odsc-demo` already exists with the correct workspace, start or reuse it
without repeating the agent or workspace paths:

```bash
sbx run --detach --name odsc-demo
```

An existing sandbox cannot be given new workspaces. Repeating the paths will
produce an error.

## 7. Verify the sandbox

```bash
sbx ls
sbx exec odsc-demo pwd
sbx exec odsc-demo docker version
```

Check that:

- `odsc-demo` is running;
- `pwd` ends in `demo-workspace`; and
- `docker version` reports the Docker Engine inside the sandbox.

For a combined report of versions, workspace access, policies, ports, the
private Docker Engine, and network listeners, run the host-side inspection
script:

```bash
./inspect-sandbox.sh odsc-demo
```

The script creates and immediately removes a hidden probe file in each known
workspace to verify actual write access. Because it uses `sbx exec`, it starts
a stopped sandbox. It does not print stored credentials. The verbose report
does show local workspace paths and recent network destinations, so review it
before sharing it outside the workshop.

For the full policy tables, recent network decisions, mount details, and Docker
networks, add the optional verbose flag:

```bash
./inspect-sandbox.sh --verbose odsc-demo
```

## 8. Open Codex

Start an interactive Codex session in the existing sandbox:

```bash
sbx run --name odsc-demo
```

The sandbox already remembers the Codex agent and both workspaces, so only its
name is required when reconnecting.

## 9. Run the coding task

Enter the following request in Codex:

```text
Read task-prompt.md and complete every step. Work in the current workspace,
do not modify or copy from ../expected-output/, and tell me when the
application container is running.
```

Codex should:

1. read the synthetic sales data;
2. create `app.py`, `requirements.txt`, and `Dockerfile`;
3. build the `odsc-sales:workshop` image with the sandbox's Docker Engine; and
4. start the `odsc-sales` container on sandbox port 8501.

Keep the Codex terminal open. Use a second host terminal for the remaining
steps.

## 10. Verify the generated files and container

Verify the files:

```bash
sbx exec odsc-demo sh -lc 'ls -l app.py requirements.txt Dockerfile data/sales.csv'
```

Check whether the application container exists:

```bash
sbx exec odsc-demo docker ps -a --filter name=odsc-sales
```

If its status is `Up`, inspect its recent output:

```bash
sbx exec odsc-demo docker logs --tail 20 odsc-sales
```

If no `odsc-sales` container exists, build the image and start it:

```bash
sbx exec odsc-demo docker build -t odsc-sales:workshop .
sbx exec odsc-demo docker run -d --name odsc-sales -p 8501:8501 odsc-sales:workshop
```

If the container exists but is stopped, restart it instead of creating another:

```bash
sbx exec odsc-demo docker start odsc-sales
```

## 11. Publish the application port

The container port is published to the sandbox, but it is not yet available to
the host browser. First inspect existing host mappings:

```bash
sbx ports odsc-demo
```

If sandbox port 8501 is not listed, publish it and inspect the result:

```bash
sbx ports odsc-demo --publish 8501
sbx ports odsc-demo
```

The second command reports the assigned host port. Open the reported loopback
address in the browser:

```text
http://127.0.0.1:HOST_PORT
```

Replace `HOST_PORT` with the actual value shown by `sbx ports`.

The complete connection is:

```text
Host browser -> assigned host port -> sandbox port 8501 -> container port 8501
```

## 12. Test the dashboard

In the browser:

1. Confirm that total revenue is **$19,000** with no filters.
2. Select region **West** and confirm **$10,500**.
3. Add product **Notebook** and confirm **$4,200** across three rows.
4. Select a combination with no matching rows and confirm that the app shows a
   helpful message instead of failing.

## 13. Stop the exercise

First list the published port so you have the exact mapping:

```bash
sbx ports odsc-demo
```

Remove that mapping by replacing `HOST_PORT` with the reported value:

```bash
sbx ports odsc-demo --unpublish HOST_PORT:8501
```

Stop and remove the workshop application container:

```bash
sbx exec odsc-demo docker stop odsc-sales
sbx exec odsc-demo docker rm odsc-sales
```

Stop the sandbox while preserving it for another run:

```bash
sbx stop odsc-demo
```

The generated files remain in `demo-workspace` on the host. Removing the
sandbox is optional and deletes its private images, containers, and state:

```bash
sbx rm odsc-demo
```

Review anything you want to keep before removing the sandbox.

## If Codex cannot complete the build

The read-only `expected-output` folder contains the prepared application. First
confirm that no `odsc-sales` container exists:

```bash
sbx exec odsc-demo docker ps -a --filter name=odsc-sales
```

Then build and run the prepared application inside the sandbox:

```bash
sbx exec odsc-demo sh -lc 'cd ../expected-output && docker build -t odsc-sales:workshop .'
sbx exec odsc-demo docker run -d --name odsc-sales -p 8501:8501 odsc-sales:workshop
```

Continue at Step 11 to publish the port.

## Related files

- [Docker Sandboxes command reference](../02-getting-started/getting-started.md)
- [Codex task](task-prompt.md)
- [Sandbox inspection script](inspect-sandbox.sh)
- [Prepared application](expected-output/app.py)

