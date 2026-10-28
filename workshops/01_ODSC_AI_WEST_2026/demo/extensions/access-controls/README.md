# Optional extension — Workspace and network controls

## Overview

This demo shows how Docker Sandboxes controls two different kinds of access:

- **Workspace access:** whether changes are written directly to the host project
  or kept in a separate clone inside the sandbox.
- **Network access:** whether a sandbox may connect to a specific destination.

You will create a disposable Git repository and two sandboxes:

- `access-direct` uses **direct mode**. A file changed in the sandbox changes the
  same file on the host.
- `access-clone` uses **clone mode**. It has a separate working copy, so its edits
  do not change the host checkout.

You will also confirm an important limitation of clone mode: the original source
is mounted read-only at `/run/sandbox/source`, but it is still readable. Clone
mode protects the source from writes; it does not hide source files.

Finally, you will add one sandbox-scoped network allow rule and one deny rule,
compare the policy decisions, and make real HTTP requests from the sandbox.

By the end of the demo, you should be able to explain why workspace mode and
network policy are independent controls and why both should be verified with
observed evidence.

## Settings

### Requirements

You need:

- A host supported by Docker Sandboxes.
- The `sbx` CLI installed and signed in to Docker.
- Git and `curl`.
- Network access to `example.com` and `example.org` for the final checks.

The commands below were checked with `sbx` v0.49.2. Confirm your installation:

```bash
sbx version
sbx login
```

This demo uses the built-in `shell` environment, so it does not require an AI
agent or model-provider credentials.

### Open the demo directory

From the root of this repository, run:

```bash
cd workshops/01_ODSC_AI_WEST_2026/demo/extensions/access-controls
```

Keep the same terminal open for the entire demo. Later commands use variables
created during setup.

### Create a disposable Git repository

Do not run the demo against a real project. Create a temporary repository from
the harmless files in `fixture/`:

```bash
CONTROL_DIR=$(mktemp -d /tmp/access-controls.XXXXXX)
cp fixture/marker.txt fixture/.gitignore fixture/ignored-demo.txt "$CONTROL_DIR/"
git -C "$CONTROL_DIR" init -b main
git -C "$CONTROL_DIR" add marker.txt .gitignore
git -C "$CONTROL_DIR" \
  -c user.name='Sandbox Demo' \
  -c user.email='sandbox-demo@example.invalid' \
  commit -m 'Create disposable fixture'
cd "$CONTROL_DIR"
```

The repository contains:

- `marker.txt`, which you will edit from both sandboxes.
- `ignored-demo.txt`, a harmless ignored file used to test read access.
- `.gitignore`, which keeps `ignored-demo.txt` out of the Git commit.

Confirm that the repository has no remotes and that the demo file is ignored:

```bash
git remote -v
git status --short --ignored
```

`git remote -v` should print nothing. The status output should identify
`ignored-demo.txt` as ignored.

### Choose sandbox names

Set the names used throughout the demo:

```bash
DIRECT_SANDBOX=access-direct
CLONE_SANDBOX=access-clone
```

Check existing sandboxes before continuing:

```bash
sbx ls
```

If either name already belongs to another sandbox, choose different names by
updating the two variables. Do not reconnect to or remove an unrelated sandbox.

## Demo

### 1. Create direct and clone sandboxes

Create both sandboxes in the background from the disposable repository:

```bash
sbx run --detach --name "$DIRECT_SANDBOX" shell .
sbx run --detach --clone --name "$CLONE_SANDBOX" shell .
```

The first command uses direct mode, which is the default. The second command
uses `--clone` to create a separate working copy inside the sandbox.

Confirm that both environments are available and inspect their working
directories:

```bash
sbx ls
sbx exec "$DIRECT_SANDBOX" pwd
sbx exec "$CLONE_SANDBOX" pwd
```

The direct workspace appears at the same absolute path as the host repository.
Docker-provided environments normally place the clone at
`/home/agent/workspace`.

### 2. Verify a direct-mode write

First, inspect the marker on the host:

```bash
cat "$CONTROL_DIR/marker.txt"
```

Now overwrite it from the direct sandbox and read it again on the host:

```bash
sbx exec "$DIRECT_SANDBOX" sh -c \
  'printf "%s\n" "Changed by the direct sandbox" > marker.txt'
cat "$CONTROL_DIR/marker.txt"
```

Expected result:

```text
Changed by the direct sandbox
```

The result appears immediately because the sandbox and host are using the same
working tree.

### 3. Verify an isolated clone-mode write

Change the clone's copy of the marker:

```bash
sbx exec "$CLONE_SANDBOX" sh -c \
  'printf "%s\n" "Changed inside the clone" > marker.txt'
```

Compare the clone with the host:

```bash
sbx exec "$CLONE_SANDBOX" cat marker.txt
cat "$CONTROL_DIR/marker.txt"
```

Expected results:

- The clone prints `Changed inside the clone`.
- The host still prints `Changed by the direct sandbox`.

Clone-mode edits remain in the sandbox until you deliberately transfer them
with a Git workflow.

### 4. Verify that the source mount is readable but not writable

The ignored file was not copied through Git, but the clone can still read it
from the original source mount:

```bash
sbx exec "$CLONE_SANDBOX" \
  cat /run/sandbox/source/ignored-demo.txt
```

Now try to overwrite the source marker and print the command's exit status:

```bash
sbx exec "$CLONE_SANDBOX" sh -c \
  'printf "%s\n" "Attempted source edit" > /run/sandbox/source/marker.txt'
SOURCE_WRITE_STATUS=$?
printf 'source write exit status: %s\n' "$SOURCE_WRITE_STATUS"
cat "$CONTROL_DIR/marker.txt"
```

The write should fail with a nonzero exit status, and the host marker should
remain unchanged. This demonstrates that **read-only does not mean hidden**:
clone mode prevents writes to the source, but readable ignored or untracked
files are still visible there.

### 5. Add sandbox-scoped network rules

Inspect the network rules that currently apply to the direct sandbox:

```bash
sbx policy ls "$DIRECT_SANDBOX" --wide --include-inactive
```

Add an allow rule for `example.com:443` and a deny rule for
`example.org:443`. Both rules apply only to this demo sandbox:

```bash
sbx policy allow network --sandbox "$DIRECT_SANDBOX" example.com:443
sbx policy deny network --sandbox "$DIRECT_SANDBOX" example.org:443
sbx policy ls "$DIRECT_SANDBOX" --wide --include-inactive
```

If your organization centrally manages Docker Sandbox policy, the local allow
rule may be inactive and cannot widen the organization's permissions. The local
deny rule can still make access more restrictive.

### 6. Compare policy decisions with real requests

Ask the policy engine how it evaluates each destination:

```bash
sbx policy check network --sandbox "$DIRECT_SANDBOX" \
  --verbose example.com:443
sbx policy check network --sandbox "$DIRECT_SANDBOX" \
  --verbose example.org:443
```

These commands evaluate policy only; they do not make HTTP requests.

Now make the real requests from inside the sandbox:

```bash
sbx exec "$DIRECT_SANDBOX" \
  curl -I --max-time 10 https://example.com
ALLOWED_REQUEST_STATUS=$?
printf 'allowed request exit status: %s\n' "$ALLOWED_REQUEST_STATUS"

sbx exec "$DIRECT_SANDBOX" \
  curl -I --max-time 10 https://example.org
DENIED_REQUEST_STATUS=$?
printf 'denied request exit status: %s\n' "$DENIED_REQUEST_STATUS"
```

Normally, the request to `example.com` succeeds and the explicitly denied
request to `example.org` fails. If the allowed request fails, compare its exit
status with the policy output. DNS, connectivity, proxy configuration, or
organization governance can cause a request to fail even when a local rule
says `allow`.

The evidence is strongest when these three observations agree:

1. The detailed rule list contains the intended sandbox-scoped rule.
2. `sbx policy check network` reports the corresponding decision.
3. The real request's output and exit status match that decision.

### 7. Clean up the demo

Remove only the two network rules created for this demo:

```bash
sbx policy rm network --sandbox "$DIRECT_SANDBOX" \
  --resource example.com:443
sbx policy rm network --sandbox "$DIRECT_SANDBOX" \
  --resource example.org:443
sbx policy ls "$DIRECT_SANDBOX" --wide --include-inactive
```

Stop and remove only the two named demo sandboxes:

```bash
sbx stop "$DIRECT_SANDBOX" "$CLONE_SANDBOX"
sbx rm "$DIRECT_SANDBOX" "$CLONE_SANDBOX"
```

Removing the clone deletes its separate working copy. The disposable host
repository remains at the path printed below:

```bash
printf 'Disposable repository: %s\n' "$CONTROL_DIR"
```

After checking the printed path, you may remove that temporary directory. Do
not use a broad cleanup command or remove a directory you did not create for
this demo.

For more detail, see the Docker documentation for [workspace
modes](https://docs.docker.com/ai/sandboxes/usage/#git-workspace-modes),
[workspace isolation](https://docs.docker.com/ai/sandboxes/security/isolation/#workspace-isolation),
and [local network policy](https://docs.docker.com/ai/sandboxes/governance/access-controls/local/).
