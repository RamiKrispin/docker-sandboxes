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
```

## Add and manage secrets

Authenticate Codex with OpenAI on the host, then confirm that the credential
was saved:

```bash
sbx secret set openai --oauth
sbx secret ls
```

The OAuth credential is stored in the host credential store at global scope:

- **macOS:** System Keychain
- **Windows:** Windows Credential Manager
- **Linux:** The desktop Secret Service, such as GNOME Keyring or KDE Wallet
- **Headless Linux without a keyring:** A permission-protected file under
  `$XDG_CONFIG_HOME/com.docker.sandboxes`, or
  `~/.config/com.docker.sandboxes` when `XDG_CONFIG_HOME` is not set

The sandbox uses the credential through the host-side proxy and cannot read
the underlying token. Run the `set` command again to replace or refresh the
saved credential.

To remove the credential after the workshop:

```bash
sbx secret rm openai
```

## Create with resources and workspace permissions

Check that `odsc-basics` is unused before creating it:

```bash
ls folder_1_read_write/editable-notes.md
ls folder_2_read_only/protected-policy.md
sbx ls
sbx run --detach \
  --name odsc-basics --cpus 2 --memory 4g \
  codex \
  ./folder_1_read_write \
  ./folder_2_read_only:ro
```

The sandbox VM receives two CPUs and 4 GiB of memory. The primary workspace
(`folder_1_read_write`) is read-write; `folder_2_read_only` is mounted
read-only. These are creation settings. Use `shell` instead of `codex` for a
model-free version of the demo.

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

## Connect over SSH and test file access

Configure local sandbox SSH access once, then connect using the sandbox name:

```bash
sbx setup ssh
ssh odsc-basics.sbx
```

Run the following commands inside the SSH session:

```bash
pwd
printf '\nSentence added over SSH.\n' >> editable-notes.md
cat editable-notes.md
printf '\nSentence added over SSH.\n' >> ../folder_2_read_only/protected-policy.md
cat ../folder_2_read_only/protected-policy.md
exit
```

The first append succeeds because `editable-notes.md` is in the read-write
workspace. The second append should fail with a read-only-filesystem or
permission error. The final `cat` confirms that the protected file is still
readable and unchanged.

## Verify workspace access

```bash
sbx exec odsc-basics cat editable-notes.md
sbx exec odsc-basics sh -c 'printf "\nStatus: edited inside the sandbox\n" >> editable-notes.md'
cat folder_1_read_write/editable-notes.md
sbx exec odsc-basics cat ../folder_2_read_only/protected-policy.md
sbx exec odsc-basics sh -c 'printf "\nAttempted change\n" >> ../folder_2_read_only/protected-policy.md'
```

The writable file changes on both the sandbox and host because it is in the
shared read-write workspace. The final command is an intentional failure:
inspect the actual error for a read-only mount or denied write. Read-only data
remains readable.

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
sbx exec odsc-basics cat editable-notes.md
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
