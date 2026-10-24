# Running AI Agents Safely with Docker Sandboxes

This folder contains the slides, examples, and presenter materials for the
60-minute ODSC AI West 2026 workshop. The session introduces execution
boundaries for AI coding agents, compares containers and microVMs, demonstrates
Docker socket exposure, and uses Docker Sandboxes to build and inspect a small
Streamlit application.

## Prerequisites

### Workshop participants

- Basic familiarity with a terminal, Python, and project files or Git.
- A modern web browser for viewing the slides and prepared examples.
- Docker familiarity is helpful, but optional.

No prior experience with Docker Sandboxes, microVMs, Streamlit, or security is
required. The workshop is presenter-led; participants do not need to install
the live-demo toolchain to follow the session.

### Presenter and live demos

The full live-demo setup requires:

- Apple silicon with macOS 14 or later for the planned local Docker Sandboxes
  presentation environment.
- The Docker Sandboxes CLI (`sbx`), Docker sign-in, and authentication for the
  selected coding agent. See [Preparing the coding-agent
  launch](presenter/agent-launch.md).
- Docker Desktop with a working local Docker engine for the Docker socket
  demonstration. Docker Desktop is not required by local `sbx` itself.
- Git and `curl` for the workspace and network-policy examples.
- Node.js and npm to serve the deck or restore its pinned local assets.
- Network access for first-time dependency installation, live model calls, and
  any packages or images that have not been cached.

Never store model-provider tokens in this folder, slides, recordings, or shell
history. Configure credentials with the supported `sbx secret` workflow
described in the agent-launch guide.

## Set up the slide deck

From the repository root:

```bash
cd workshops/01_ODSC_AI_WEST_2026
npm ci
npm run build
npm start
```

Then open <http://127.0.0.1:4173/slides/index.html>.

Use Left/Right or Space to navigate. Press **S** to open speaker notes and the
presenter timer. Stop the local server with Ctrl+C.

`npm ci` needs network access and installs the versions pinned in
`package-lock.json`. `npm run build` copies Reveal.js, syntax highlighting, and
the Inter font into `slides/` so the deck can run with local assets. If those
bundled assets are already present, the audience view can also be opened
directly from [slides/index.html](slides/index.html); use the local server for
speaker notes and presentation work.

For navigation, interactions, print-to-PDF settings, and offline fallbacks, see
[Previewing the 17-slide deck](presenter/slides-preview.md).

## Prepare Docker Sandboxes

Complete installation and authentication before the workshop. From the host
terminal, first confirm the installed CLI and supported launch options:

```bash
sbx version
sbx run --help
```

Sign in to Docker with `sbx login`, then configure the selected coding agent's
credentials using the supported secret workflow. For Codex, the preparation
guide documents both OpenAI OAuth and API-key options. Also confirm that the
active network preset and any organization rules allow the model provider and
required package sources.

Do not perform authentication or reset global network policy during the live
workshop. Prepare named sandboxes, dependencies, images, and fallback material
in advance.

## Rehearse the demonstrations

Run each demonstration from this workshop folder and follow its runbook:

1. [Docker socket demonstration](demo/01-docker-socket/runbook.md) — confirm the
   local Docker context, inspect the harmless fixture, and pre-pull the two
   images.
2. [Sales dashboard demonstration](demo/02-agent-streamlit/runbook.md) — prepare
   the `odsc-demo` sandbox, cache dependencies and the image inside its separate
   Docker engine, and verify both port-forwarding hops.
3. [Workspace and network controls](demo/03-access-controls/runbook.md) — create
   the disposable Git fixture, reserve fresh sandbox names, and record only the
   sandbox-local policy rules added for the demo.

Each runbook includes timing, safety boundaries, cleanup steps, and a fallback.
Use prepared or recorded results when a live dependency is unavailable, and
label those results as prepared or recorded rather than live output.

## Workshop materials

- [Workshop agenda](spec/agenda.md)
- [Interactive slide deck](slides/index.html)
- [Presenter resources and official references](presenter/resources.md)
- [Conference submission](submission/conference-submission.md)

The slides and prepared examples can run without external requests after
setup. Live coding-agent calls and uncached dependency or image downloads still
require connectivity.
