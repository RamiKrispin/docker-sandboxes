# Demo 02 — Docker Sandboxes command reference

Use the [complete walkthrough](README.md) for setup, explanations, expected
results, and cleanup. Commands run on the host unless marked otherwise.
Start in `workshops/01_ODSC_AI_WEST_2026/demo/02-getting-started`.

## Prepare once

```bash
sbx version
sbx login
sbx daemon start --detach
sbx diagnose
sbx secret set openai --oauth
```

## Create with resources and workspace permissions

Check that `odsc-basics` is unused before creating it:

```bash
mkdir -p demo-workspace
sbx ls
sbx run --detach \
  --name odsc-basics --cpus 2 --memory 4g \
  codex \
  ./demo-workspace \
  ./reference:ro
```

The sandbox VM receives two CPUs and 4 GiB of memory. The primary workspace
is read-write; the reference folder is read-only. These are creation settings.
Use `shell` instead of `codex` for a model-free version of the demo.

## Inspect and connect

```bash
sbx ls
sbx exec odsc-basics pwd
sbx exec odsc-basics nproc
sbx exec odsc-basics head -n 3 /proc/meminfo
sbx run --name odsc-basics
```

From a second host terminal:

```bash
sbx exec -it odsc-basics bash
```

Run `exit` inside that shell to return to the host.

## Verify workspace access

```bash
sbx exec odsc-basics sh -c 'printf "%s\n" "Written inside the sandbox" > workspace-proof.txt'
cat demo-workspace/workspace-proof.txt
sbx exec odsc-basics cat ../reference/notes.txt
sbx exec odsc-basics sh -c 'printf "%s\n" "Attempted write" > ../reference/attempted-write.txt'
```

The final command is an intentional failure: inspect the actual error for a
read-only mount or denied write. Read-only data remains readable.

## Configure and check network permissions

```bash
sbx policy ls odsc-basics --type network --wide --include-inactive
sbx policy allow network --sandbox odsc-basics example.com:443
sbx policy deny network --sandbox odsc-basics example.org:443
sbx policy ls odsc-basics --type network --wide --include-inactive
sbx policy check network --sandbox odsc-basics --verbose example.com:443
sbx policy check network --sandbox odsc-basics --verbose example.org:443
sbx exec odsc-basics curl -I --max-time 10 https://example.com
printf 'example.com request exit status: %s\n' "$?"
sbx exec odsc-basics curl -I --max-time 10 https://example.org
printf 'example.org request exit status: %s\n' "$?"
sbx policy log odsc-basics --type network --limit 10
```

Record only newly added rule IDs. Existing and organization rules still apply;
these two rules do not restrict all traffic to one allowed destination.

## Stop, restart, and clean up

```bash
sbx stop odsc-basics
sbx ls
sbx run --detach --name odsc-basics
sbx exec odsc-basics cat workspace-proof.txt
```

Remove each newly added rule by replacing `NEW_RULE_ID` with its actual ID:

```bash
sbx policy rm network --sandbox odsc-basics --id NEW_RULE_ID
sbx stop odsc-basics
```

Optional removal, after closing sessions and preserving sandbox-only files:

```bash
sbx rm odsc-basics
```

Stop preserves private state; removal deletes it. Shared host workspace files
remain. Continue with [Demo 03 — Streamlit](../03-agent-streamlit/README.md).
