# Checking the workshop boundaries

Use slide 14 at 42:00–43:00 and slide 15 at 43:00–49:00. The slide predictions explain documented behavior. Only terminal evidence from this machine establishes the actual outcome; no successful sandbox enforcement run is bundled yet. Syntax was checked against sbx v0.48.0 on October 15, 2026.

## Prepare a standalone, sanitized Git fixture

From this demo directory in the host terminal:

```bash
CONTROL_DIR=$(mktemp -d /tmp/odsc-controls.XXXXXX)
cp fixture/marker.txt fixture/.gitignore "$CONTROL_DIR/"
printf '%s\n' 'Harmless ignored demo data' > "$CONTROL_DIR/ignored-demo.txt"
git -C "$CONTROL_DIR" init
git -C "$CONTROL_DIR" add marker.txt .gitignore
git -C "$CONTROL_DIR" -c user.name='Workshop Fixture' -c user.email='workshop@example.invalid' commit -m 'Create disposable fixture'
cd "$CONTROL_DIR"
```

This is a new main checkout with no remotes or personal files. The ignored file is intentionally harmless. Avoid using the workshop repository itself, a linked Git worktree, credentials, or real home files.

Before creating anything, inspect `sbx ls`. Reserve `odsc-direct` and `odsc-clone` for these fixtures. If either already exists for unrelated work, choose fresh names consistently instead of reconnecting or removing it. Prepare two environments before presenting, using the authenticated Codex kit:

```bash
sbx run --detach --name odsc-direct codex .
sbx run --detach --clone --name odsc-clone codex .
```

No model prompt is needed to perform file checks with `sbx exec`. The slide shows the equivalent foreground commands so the audience can see the mode difference. Clone mode is fixed when created. Direct mode shares the host working tree read-write; clone edits stay in the clone until deliberately fetched/pushed. The host source remains readable at `/run/sandbox/source`, including ignored/untracked material.

## 43:00–46:00 — Workspace evidence

Host context (`CONTROL_DIR` remains the disposable directory):

```bash
sbx exec --workdir "$CONTROL_DIR" odsc-direct sh -c 'printf "%s\n" "Direct edit" > marker.txt'
cat "$CONTROL_DIR/marker.txt"
```

Predict that the host displays the direct edit. Check the clone's workspace with `sbx exec odsc-clone pwd` and `sbx exec odsc-clone git rev-parse --show-toplevel`. Docker-provided kits use `/home/agent/workspace`; verify the actual clone path before using the following command. If different, replace the `--workdir` path with the verified path.

```bash
sbx exec --workdir /home/agent/workspace odsc-clone sh -c 'printf "%s\n" "Clone edit" > marker.txt'
cat "$CONTROL_DIR/marker.txt"
sbx exec odsc-clone cat /run/sandbox/source/ignored-demo.txt
sbx exec odsc-clone sh -c 'printf "%s\n" "Source edit" > /run/sandbox/source/marker.txt'
```

Predict that the host marker stays “Direct edit,” the harmless ignored source file can be read, and the attempted write to the source mount fails. Capture actual output and exit status for each operation. Reading a clone source is permitted; clone mode is not a secrecy boundary. Restore the host marker with its original fixture after demonstrating; inspect clone changes separately before discarding them.

## 46:00–48:00 — Network evidence

Use `odsc-direct` only. These two documentation domains carry no data beyond a HEAD request. Before any change, save `sbx policy ls odsc-direct --wide` and inspect `--include-inactive` if organization governance applies. The model provider remains untouched. Check for existing rules matching the two exact resources; if found, select fresh rehearsed endpoints or reuse the existing policy without changing/removing it.

```bash
sbx policy ls odsc-direct --wide
sbx policy allow network --sandbox odsc-direct example.com:443
sbx policy deny network --sandbox odsc-direct example.org:443
sbx policy ls odsc-direct --wide
```

Compare before/after lists and record the IDs of **only the two newly added demo rules**. Organization governance may prevent a local allow from granting access. Confirm the selected allowed request during rehearsal; do not loosen organization policy or change global presets.

Host policy checks evaluate authorization; they do not send an HTTP request:

```bash
sbx policy check network --sandbox odsc-direct example.com:443
sbx policy check network --sandbox odsc-direct example.org:443
```

Actual requests execute inside the sandbox:

```bash
sbx exec odsc-direct curl -I --max-time 10 https://example.com
sbx exec odsc-direct curl -I --max-time 10 https://example.org
```

Record HTTP result, command exit status, and matching policy/rule. A network failure alone does not establish policy denial: correlate it with the explicit deny decision and sandbox policy log. A policy check can report Denied for unmatched approval-required access without sending a request or creating an approval prompt. This demo's explicit deny is different from that state. Network checks only evaluate host/port; HTTP method/path restrictions can still change actual request results.

## 48:00–49:00 — Restore only demo changes

Remove only the newly added sandbox-local rule IDs from the before/after record, using `sbx policy rm network --sandbox odsc-direct --id RULE_ID` with each real recorded ID. Do not copy the literal placeholder. Inspect rules again and compare with the prior state. Never run a global reset for this demonstration.

Stop the two named workshop sandboxes with `sbx stop odsc-direct odsc-clone`. Fetch/push any wanted clone commits before removing `odsc-clone`; removing it discards its internal clone. `sbx rm odsc-direct odsc-clone` removes those specific environments after preservation. Host edits remain on disk. Leave the final decision guide by 49:30 and begin Q&A at 50:00.

## Fallback route

If actual enforcement has not been rehearsed, use the slide's clearly labeled prediction/explanation view and show the commands without claiming observed results. Retain one workspace case and one network case if time is short. Before the event, capture real paired host/sandbox results and a short video after all operations succeed; no fabricated result is included.

Sources: [workspace isolation](https://docs.docker.com/ai/sandboxes/security/isolation/#workspace-isolation), [Git modes](https://docs.docker.com/ai/sandboxes/usage/#git-workspace-modes), [local policy](https://docs.docker.com/ai/sandboxes/governance/access-controls/local/).
