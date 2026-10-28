# Demo 02 — Getting started with Docker Sandboxes

In this demo, we launch a local sandbox, choose its CPU and memory allocation,
run commands, configure access, and stop and restart it. A tiny workspace keeps
this exercise independent of the Streamlit application in Demo 03.

By the end, we can launch a named sandbox locally and verify the resources we
deliberately share with it. The [command reference](getting-started.md) provides
the short version of this walkthrough.

## 1. Prepare the host

Install Docker Sandboxes using the [workshop setup guide](../../README.md).
This exercise needs a supported host, the `sbx` CLI, a Docker account, and
OpenAI access for the Codex session. A host Docker Engine or Docker Desktop
is not required for this demo.

The commands below use Bash or Zsh on the host. On Windows, use a compatible
POSIX terminal for the file operations and shell conditionals. Sandboxes run
Linux, so commands passed to `sbx exec` use Linux syntax on every host.

Complete sign-in and downloads before presenting:

```bash
sbx version
sbx login
sbx daemon start --detach
sbx diagnose
sbx secret set openai --oauth
```

Docker sign-in and OpenAI authentication are separate. OAuth stores the
credential on the host; no credential belongs in the workspace. If credentials
are already configured, we do not need to repeat the OAuth flow.

The first sandbox launch may ask for a global network preset. Select it during
preparation; Balanced is a useful starting point for development. This choice
affects other sandboxes too. We inspect the existing policy rather than reset
it during the demo. Organization governance may impose additional restrictions.

**Without model credentials:** replace `codex` with `shell` in the creation
command below and skip the Codex task in Step 5. The shell environment supports
the same resource, workspace, network, and lifecycle checks without a model
account. The agent choice is saved at creation; reconnecting cannot turn that
shell sandbox into a Codex sandbox.

## 2. Prepare a small workspace

From the repository root:

```bash
cd workshops/01_ODSC_AI_WEST_2026/demo/02-getting-started
mkdir -p demo-workspace
ls reference/notes.txt
sbx ls
```

We use `odsc-basics` for this demo. If that name already exists, confirm it
belongs to this exercise before reconnecting. If it belongs to other work,
choose a fresh name and substitute it throughout this guide. Do not remove or
reconfigure an unrelated sandbox.

The two folders have different roles:

| Folder | Access inside the sandbox | Purpose |
| --- | --- | --- |
| `demo-workspace/` | Read-write | Disposable files created during the demo |
| `reference/` | Read-only | A harmless note we can read but cannot edit |

## 3. Create a named sandbox with explicit resources

For a new name, run:

```bash
sbx run --detach \
  --name odsc-basics --cpus 2 --memory 4g \
  codex \
  ./demo-workspace \
  ./reference:ro
```

| Argument | Meaning |
| --- | --- |
| `--detach` | Keep the sandbox running in the background |
| `--name odsc-basics` | Give it a name we can reuse |
| `--cpus 2` | Allocate two virtual CPUs to the sandbox VM |
| `--memory 4g` | Set the sandbox VM memory allocation to 4 GiB |
| `codex` | Select the coding agent |
| `./demo-workspace` | Share this host folder read-write as the primary workspace |
| `./reference:ro` | Share the additional host folder read-only |

The CPU and memory settings apply to the sandbox VM, which contains the agent,
tools, and its Docker Engine. Containers created inside it share that VM's
available resources. This is a workshop example, not a sizing requirement for
every workload; the host must have enough available resources.

These are creation settings. Reusing a name does not provide a fresh sandbox
or replace its mounts and resource allocation. To try a different size, use a
new name with the desired flags. Preserve needed work before removing an old
sandbox.

## 4. Inspect status and resources

```bash
sbx ls
sbx exec odsc-basics pwd
sbx exec odsc-basics nproc
sbx exec odsc-basics head -n 3 /proc/meminfo
```

The workspace path should end in `demo-workspace`. `nproc` reports the CPUs
available to the process; `/proc/meminfo` reports Linux guest memory. Usable
guest memory can be lower than the requested allocation because the VM and
kernel consume some memory. We inspect the observed values rather than
expecting an exact `4g` string.

`sbx exec` runs a command inside the sandbox and returns to the host terminal.
It can also start a stopped sandbox, so inspect status before using it when
demonstrating the stopped state.

## 5. Attach to the agent or open a shell

Attach to the saved agent:

```bash
sbx run --name odsc-basics
```

For Codex, submit this small task:

```text
Read ../reference/notes.txt. Create hello.txt in the current workspace with
the text "Hello from the sandbox". Do not install packages or change other files.
```

The prompt describes the task. Mounts and policy enforce access; instructions
in a prompt do not create an access boundary. The agent's own approval prompts
are another layer and are separate from sandbox workspace and network policy.

Keep that terminal open. In a second host terminal, open an interactive shell:

```bash
sbx exec -it odsc-basics bash
```

Inside the sandbox shell:

```bash
pwd
ls
cat ../reference/notes.txt
exit
```

`exit` closes this shell and returns to the host. Because the sandbox was
started with `--detach`, it remains running after attached sessions end.

## 6. Verify read-write and read-only access

Run from a host terminal in the demo directory. This deterministic write works
even if we skipped the Codex task:

```bash
sbx exec odsc-basics sh -c 'printf "%s\n" "Written inside the sandbox" > workspace-proof.txt'
cat demo-workspace/workspace-proof.txt
sbx exec odsc-basics cat ../reference/notes.txt
```

The host should display `Written inside the sandbox`: the primary workspace is
the same writable host folder. The reference note should also be readable.

Now attempt to create a file in the read-only reference folder:

```bash
if sbx exec odsc-basics sh -c 'printf "%s\n" "Attempted write" > ../reference/attempted-write.txt'; then
  printf '%s\n' 'Unexpected write success: stop and inspect the workspace configuration.'
else
  printf '%s\n' 'Write failed; compare the error with the read-only mount configuration.'
fi
```

We expect a read-only-filesystem or permission error and a nonzero exit status.
An unrelated execution error also produces a failure, so inspect the actual
message. Read-only access prevents edits; it does not hide the note's contents.

The `sh -c` wrapper makes the redirect execute inside the sandbox. The host
shell must not perform the write itself.

## 7. Configure and verify network access

Workspace access and network access are independent. Inspect current effective
rules, including inactive rules, before changing anything:

```bash
sbx policy ls odsc-basics --type network --wide --include-inactive
```

For this fresh sandbox, add two sandbox-scoped rules:

```bash
sbx policy allow network --sandbox odsc-basics example.com:443
sbx policy deny network --sandbox odsc-basics example.org:443
sbx policy ls odsc-basics --type network --wide --include-inactive
```

Record the new rule IDs shown in the wide listing for cleanup. If either rule
already existed, leave it in place and do not treat it as a new demo rule.
These commands affect `odsc-basics`, rather than every sandbox on the host.
They do not create an exclusive allowlist: other existing permissions remain
effective. Under organization governance, a local allow cannot expand the
organization's permissions; a local deny can restrict access further.

Compare the policy decisions:

```bash
sbx policy check network --sandbox odsc-basics --verbose example.com:443
sbx policy check network --sandbox odsc-basics --verbose example.org:443
```

Then make real requests:

```bash
sbx exec odsc-basics curl -I --max-time 10 https://example.com
printf 'example.com request exit status: %s\n' "$?"
sbx exec odsc-basics curl -I --max-time 10 https://example.org
printf 'example.org request exit status: %s\n' "$?"
sbx policy log odsc-basics --type network --limit 10
```

With effective permission and working connectivity, `example.com` should
succeed. The explicitly denied `example.org` request should fail. Confirm the
deny decision and matching log rather than treating any failed request as
proof of enforcement. DNS, TLS, proxy settings, or an unavailable tool can also
cause failures. A policy check evaluates authorization without sending a
request. No exact terminal output is bundled as evidence of a completed run.

## 8. Stop and restart

```bash
sbx stop odsc-basics
sbx ls
sbx run --detach --name odsc-basics
sbx exec odsc-basics cat workspace-proof.txt
```

Stop preserves the sandbox's private state. Restart uses its saved agent,
mounts, and resource settings; we do not repeat creation arguments. The proof
file is also present on the host because it lives in the shared workspace.

## 9. Clean up

Remove only the local rules added during this demo. Use each recorded rule ID
in place of `NEW_RULE_ID`, running the command once per new rule:

```bash
sbx policy rm network --sandbox odsc-basics --id NEW_RULE_ID
sbx policy ls odsc-basics --type network --wide
sbx stop odsc-basics
```

After closing the interactive agent session and preserving any files needed
from sandbox-only storage, removal is optional:

```bash
sbx rm odsc-basics
```

Removal deletes the sandbox's private filesystem, images, and containers. The
shared `demo-workspace/` folder remains on the host. We can keep it as evidence
or remove only the disposable files created for this exercise.

## Next: build something useful

In [Demo 03 — Streamlit](../03-agent-streamlit/README.md), we use a separate
Codex sandbox to build and serve a sales dashboard. That demo introduces port
publishing when there is a running service to open. The optional
[access-controls extension](../extensions/access-controls/README.md) goes
deeper into direct versus clone workspaces.

## References

- [Docker Sandboxes usage and persistence](https://docs.docker.com/ai/sandboxes/usage/)
- [Launch flags and resource allocation](https://docs.docker.com/reference/cli/sbx/run/)
- [Local network policy](https://docs.docker.com/ai/sandboxes/governance/access-controls/local/)

Command syntax was checked against installed `sbx` v0.49.2 on October 27,
2026. Live launch, agent authentication, resource observations, and access
enforcement still need rehearsal on the presenter machine.
