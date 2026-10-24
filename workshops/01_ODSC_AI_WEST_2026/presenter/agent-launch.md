# Preparing the coding-agent launch

Slide 12 explains the launch command. Complete installation, Docker sign-in, agent authentication, and network selection before presenting. The command starts or reconnects to a named sandbox; it is not an application-build prompt.

## Preflight on the presenter machine

The planned local presentation platform is Apple silicon with macOS 14 or later. Local `sbx` does not require Docker Desktop or a host Docker Engine. The earlier Docker socket demonstration separately requires the host daemon.

Check the installed CLI and its supported arguments:

```bash
sbx version
sbx run --help
```

Prepare Docker sign-in with `sbx login` before the session. This sign-in is separate from the coding agent's model-provider authentication. For Codex, Docker documents host-side OpenAI OAuth preparation with `sbx secret set openai --oauth`, or interactive API-key storage with `sbx secret set openai`. Choose the appropriate supported method before presenting; never place a token in a slide, recorded terminal command, or workspace file.

Inspect/select the intended network preset and any organization rules during preparation. The model provider and required package sources must be reachable. Do not reset global policy or perform a live authentication flow during the three-minute launch walkthrough.

## Slide 12 command

Run from the workshop root in the host terminal:

```bash
cd demo/02-agent-streamlit
sbx run \
  --name odsc-demo \
  codex \
  .
```

The project directory exists in this checkout. Its app/CSV materials belong to the next workshop segment and are not yet built. Prepare them before the eventual live app demonstration.

| Highlight step | Lines | Explanation |
| --- | --- | --- |
| 1 | 1 | Choose the workspace folder before launch |
| 2 | 2–3 | Run an agent in a sandbox named `odsc-demo` |
| 3 | 4 | Choose the Codex agent |
| 4 | 5 | Share the current project directory; direct mode grants read-write workspace access |
| 5 | 1–5 | Review the complete command |

If the name already exists, `sbx run --name` can reconnect to it. Do not assume this command always creates a clean environment or switches an existing sandbox's workspace configuration. Confirm the prepared sandbox matches the intended demo before the session.

The browser's Copy command control copies all five lines and does not execute them. The slides show no simulated successful launch or fabricated agent output.

## Timing and fallback

Use 30:00–33:00 to explain the workspace, name, agent, and final dot. Installation and authentication are preparation, not live exercises. If a prepared sandbox is available, switch to its terminal at the handoff. Otherwise use the static annotated command and explain what still needs rehearsal. Do not represent an illustration as an actual launch.

The actual agent launch, Docker builds inside the sandbox, app port publishing, and application fallback are part of the next demo's rehearsal. Preserve its nine-minute segment and the final ten minutes of Q&A.

## Validation record

Checked on October 15, 2026:

- Installed `sbx version`: `v0.48.0`, build `5caf923e0587d376848f6f388eca3e0f5ca00e2d`.
- Presenter platform: macOS 15.7.3 on arm64.
- Local `sbx run --help` lists `codex`, `--name`, and a workspace-path argument. It states that omitting the path shares the current directory and that named sandboxes may be reattached.
- `sbx login --help` and `sbx secret set --help` agree with the documented preparation commands.
- Live sign-in, credential inspection, agent launch, and app execution were not performed for this slide batch.

## Sources

- [Docker Sandboxes installation](https://docs.docker.com/ai/sandboxes/install/)
- [Usage and workspace behavior](https://docs.docker.com/ai/sandboxes/usage/)
- [Codex agent preparation](https://docs.docker.com/ai/sandboxes/agents/codex/)
- [Isolation layers and host integrations](https://docs.docker.com/ai/sandboxes/security/isolation/)
