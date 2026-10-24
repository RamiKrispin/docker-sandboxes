# Development Plan: Running AI Agents Safely with Docker Sandboxes

**Subtitle:** Secure Autonomy with Micro VMs  
**Format:** 60-minute, beginner-friendly ODSC workshop: 50 minutes of content and demos, then 10 minutes of Q&A  
**Audience:** Data scientists, data analysts, AI practitioners, and developers new to sandboxing  
**Primary output:** Browser-based HTML slide deck with animated comics, working demonstrations, and presenter notes  
**Status:** Complete 17-slide deck available at `slides/index.html`; socket and prepared app verified locally; authenticated sandbox/access-control rehearsal pending  
**Last reviewed:** October 17, 2026

---

## 1. Workshop goal

Teach why autonomous AI agents need isolated execution environments and how Docker Sandboxes provide a practical way to grant agents useful development capabilities while limiting their access to host resources.

The workshop **must start with the need for sandboxing**, not with Docker installation. The argument should progress from general principles to a memorable container security demonstration, then to a working Docker Sandbox demo.

**Central message:**

> The more autonomy we give AI agents, the more important it becomes to control the environment in which they operate.

**Narrative arc:**

1. **Why sandbox?** Autonomous agents can run code, install packages, modify files, and take unexpected actions.
2. **What is a sandbox?** A controlled execution environment with explicit resource boundaries.
3. **What are the isolation options?** Direct execution, OS-level controls, containers, and microVM-based sandboxes.
4. **Why not just Docker?** A container may be sufficient for many applications, but giving an agent access to the host Docker socket can undermine the intended boundary.
5. **What is Docker Sandboxes?** An `sbx`-managed agent environment with its own microVM and Docker engine.
6. **What can we build?** A coding agent creates, tests, and runs a simple Streamlit data app inside the sandbox.
7. **What remains under our control?** Workspace access, network policy, credentials, and the ability to stop or discard the environment.

**Learning outcomes:** By the end, attendees should be able to explain why sandboxing matters, distinguish container isolation from microVM isolation, describe the host Docker socket risk, start an AI coding agent in Docker Sandboxes, and select a suitable workspace/network access strategy.

---

## 2. Conference-ready title and description

### Title

**Running AI Agents Safely with Docker Sandboxes**

### Short description (submission / event page)

Autonomous AI agents can write code, install packages, run tests, and build containers—but how much access should we give them? In this beginner-friendly, demo-driven workshop, we'll explore why AI agents need sandboxes, where traditional Docker containers can fall short, and how Docker Sandboxes use microVM isolation to balance autonomy with control. We'll run a coding agent inside a sandbox, build a small data application, and demonstrate how workspace and network boundaries affect what the agent can access.

### Optional one-line hook

**Give AI agents freedom to build—not the keys to your computer.**

---

## 3. Sixty-minute agenda

| Time | Segment | Purpose | Visual or live element |
|---|---|---|---|
| 0:00–0:10 | **Why do AI agents need sandboxes?** | Autonomous execution, trust boundaries, approval fatigue; introduce sandboxing concept | Animated “approval zombie” comic; robot roaming the host |
| 0:10–0:18 | **Different levels of isolation** | Contrast process restrictions, containers, and microVMs; explain trade-offs | Animated isolation ladder and nested-box diagram |
| 0:18–0:26 | **Why aren't containers always enough?** | Explain Docker socket exposure and show a controlled proof of concept | Two-minute explanation/animation plus six-minute socket demo |
| 0:26–0:33 | **Docker Sandboxes: architecture and setup** | MicroVM, private Docker engine, filesystem/network/credential boundaries | Side-by-side architecture diagram; `sbx` CLI start |
| 0:33–0:42 | **Autonomous agent builds a data app** | Demonstrate legitimate autonomous work inside a sandbox | Nine-minute segment: brief introduction plus eight-minute app demo |
| 0:42–0:49 | **Control and verify permissions** | Direct mount vs. clone, network rules, published port, cleanup | One-minute introduction plus six-minute access-control demo |
| 0:49–0:50 | **Wrap-up** | When to use a regular container vs. Docker Sandboxes | Decision guide + takeaway slide |
| 0:50–1:00 | **Q&A** | Answer attendee questions | Keep takeaways visible; revisit code/diagrams as needed |

**Timing rule:** Finish all teaching, demonstrations, transitions, and closing takeaways by 0:50. Protect the full final ten minutes for Q&A. Budget 23 minutes of explanation, seven of guided interaction/transitions, and 20 of live demos. Prepare a shortened version of each demo and switch to validated fallback results if needed; do not borrow from Q&A.

---

## 4. Recommended HTML presentation architecture

### Primary implementation

- **Slide engine:** Reveal.js (HTML slide deck with keyboard navigation, speaker notes, slide fragments, and PDF-export-friendly layout).
- **Visual language:** Cartoon/comic treatment for motivations and risks; clean technical architecture diagrams for factual explanations.
- **Animations:** Inline SVG and CSS transitions for reliable short loops; optional GSAP only if timelines become too complex for CSS. Use images/video backups for every complex animation.
- **Diagrams:** Mermaid for early drafts; convert key diagrams to controlled SVG/HTML for consistent animation.
- **Code:** Syntax-highlighted blocks with commands that can be copied to the terminal; display only short commands during live demos.
- **Presenter controls:** Speaker notes, timer/cues, and quick links to demo scripts.
- **Build:** Static site built using npm scripts; pin dependencies and bundle assets locally so slides work without an internet connection.
- **Quality:** 16:9 aspect ratio, readable type from the back of a room, color-blind-friendly contrast, reduced-motion alternative.

### Suggested repository layout

```text
odsc-docker-sandboxes-workshop/
├── README.md
├── package.json
├── slides/
│   ├── index.html
│   ├── styles/
│   │   ├── theme.css
│   │   └── comic.css
│   ├── scripts/
│   │   ├── presentation.js
│   │   └── animations.js
│   └── assets/
│       ├── robot/
│       ├── approval-fatigue/
│       ├── architecture/
│       └── demo-screenshots/
├── demo/
│   ├── 01-docker-socket/
│   │   ├── README.md
│   │   └── run-demo.sh
│   ├── 02-agent-streamlit/
│   │   ├── sample_sales.csv
│   │   ├── agent-prompt.md
│   │   └── expected-output/
│   └── 03-access-controls/
│       └── runbook.md
├── presenter/
│   ├── speaker-notes.md
│   ├── rehearsal-checklist.md
│   ├── fallback-plan.md
│   └── conference-description.md
└── recordings/
    ├── socket-demo-backup.mp4
    ├── agent-demo-backup.mp4
    └── permissions-demo-backup.mp4
```

**Implementation note:** Use the recorded demos only as fallbacks; prefer live terminal sessions for the main presentation.

---

## 5. Slide-by-slide content blueprint

| # | Slide title | Key point / speaker cue | Visual |
|---|---|---|---|
| 1 | Running AI Agents Safely with Docker Sandboxes | Title, promise, expectations | Robot peeking out of a box |
| 2 | AI agents don't just answer questions | They execute code, install dependencies, and act | Robot with coding, file, terminal, and Docker icons |
| 3 | The autonomy problem | Useful agency vs. host risk | Agent with oversized set of keys |
| 4 | Approval, approval, approval... | Repetitive prompts create approval fatigue | Animated exhausted engineer |
| 5 | So, what is a sandbox? | An environment with clear execution and access boundaries | Host and bounded sandbox diagram |
| 6 | Isolation is a spectrum | Direct execution → OS restrictions → containers → microVM | Animated isolation ladder |
| 7 | Aren't Docker containers isolated? | Yes, but configuration and host capabilities matter | Container diagram with boundary labels |
| 8 | The Docker socket trap | Host daemon access can defeat intended restrictions | Comic: robot finds Docker-socket hose |
| 9 | Live demo: unintended host access | Show only a deliberately shared disposable test file | Terminal and side-by-side diagram |
| 10 | Meet Docker Sandboxes | Agent and private Docker engine live inside a microVM | Technical architecture diagram |
| 11 | The robot hits the wall | Stronger isolation, not absolute protection | Comic: microVM “BOING!” |
| 12 | Start your first sandbox | CLI setup and how to launch an agent | Short terminal commands |
| 13 | Live demo: data app from a CSV | Agent builds a Streamlit app + Docker image | Terminal → browser reveal |
| 14 | What can the agent access? | Read-write mounts, private clone, network policies | Permission toggles / boundary animation |
| 15 | Live demo: controlling boundaries | Show one permitted and one denied operation | Split-screen host/sandbox results |
| 16 | Which environment should I use? | Regular container vs. microVM sandbox decision points | Two-column comparison |
| 17 | Three things to remember | Autonomy, isolation, least-privilege sharing | One memorable comic callback |

**Optional slide:** Autonomous-agent incident / industry anecdote (e.g. OpenClaw), but verify project name, dates, and sourced claims before publication. Avoid unsupported statistics or suggesting a sandbox makes an autonomous assistant automatically safe.

---

## 6. Animation production plan

All three animations should share the same recurring characters: **an enthusiastic but mischievous little robot** and **a good-natured, exhausted engineer**. Use simple facial expressions and exaggerated physics; keep technical labels precise and readable.

### Animation A — Approval fatigue / “the approval zombie”

**Purpose:** Motivate the need for well-defined execution boundaries rather than endless interrupt-driven permission prompts.

**Storyboard (about 10–14 seconds, loopable):**

1. Engineer sits alert at a workstation. Dialog: **“Allow agent to run tests?”** Engineer carefully selects **Approve**.
2. New dialogs arrive: **“Install package?”**, **“Modify file?”**, **“Run command?”** Approvals accelerate.
3. Coffee cups pile up, clock hands spin, posture slumps, eyes turn into comic spirals.
4. Engineer mechanically slams a giant **APPROVE** stamp while nearly asleep.
5. Freeze-frame punchline: **“If every click is approval, are we still reviewing?”**

**Transition:** More capable isolation can reduce the need for repetitive approval requests, but **does not replace oversight**.

**Implementation:** SVG characters, animated dialog cards, CSS keyframes or GSAP; add a manual replay button and a static fallback.

### Animation B — The Docker-socket escape

**Purpose:** Visually explain *why granting host-Docker access can undermine a container boundary*.

**Storyboard (about 10–12 seconds):**

1. Robot is contentedly coding in a cheerful container labeled **“AI agent container.”** Nearby: **“Host files”** folder is outside the box.
2. A glowing hose labeled **`/var/run/docker.sock`** connects the container to a **“Host Docker daemon”** outside.
3. Robot grins, sends a command through the hose; a *second* container materializes with a bind mount of a permitted host directory.
4. Robot discovers the demo file in that second container. Comic speech bubble: **“Wait… I can reach that?”**
5. Footer: **“A Docker socket mount can grant broad control of the host Docker daemon.”**

**Accuracy requirement:** Don't depict a robot literally breaking the kernel or reading arbitrary host files by magic. The mechanism is Docker API control leading to a **new container with host bind mounts**, subject to host daemon privileges and Docker Desktop file-sharing boundaries on macOS.

### Animation C — The microVM “BOING!”

**Purpose:** Make the difference between a host-controlled Docker daemon and an isolated in-sandbox daemon memorable.

**Storyboard (about 8–12 seconds):**

1. Same robot is inside a sturdier translucent box labeled **“Docker Sandbox / microVM.”** Its own mini **“Docker engine”** sits nearby.
2. Robot builds a container successfully **inside** the microVM, smiles, then tries to point the Docker hose at the *host* daemon.
3. Hose doesn't connect through the boundary. Robot runs toward the wall, cartoon **“BOING!”**, tumbles backward, little stars swirl around its head.
4. Robot shrugs and gets back to work using its **own** Docker engine.
5. Footer: **“Autonomy inside. Controlled access outside.”**

**Accuracy requirement:** The sandbox can still affect resources intentionally shared into it; direct-mounted workspaces are writable. The illustration represents the default host-Docker isolation boundary, not absolute security.

### Animation delivery checklist

- [ ] Consistent robot/engineer character designs and typography
- [ ] Two loop lengths tested: automatic presentation and manual replay
- [ ] No animation blocks slide navigation or speaker notes
- [ ] Labels remain readable at 1920×1080 projection
- [ ] Static poster frame and `.mp4` backup for each scene
- [ ] `prefers-reduced-motion` path shows a representative still
- [ ] Technical captions reviewed for accuracy

---

## 7. Live-demo engineering plan

### Demo 1 — Why mounting the host Docker socket is risky (6 minutes including narration)

**Objective:** Illustrate that a first container with no explicit project-directory mount can cause the **host daemon** to launch a second container that reads a disposable host test file.

**Preconditions:** Docker daemon running; on macOS, Docker Desktop file sharing must allow the demonstration directory. Run only against a machine and Docker instance you own and control.

**Presenter-only preparatory step, on host, from the workshop folder:**

```bash
export DEMO_DIR="$PWD/demo/01-docker-socket/fixture"
cat "$DEMO_DIR/proof.txt"
```

**Illustrative command:**

```bash
docker run --rm \
  -v /var/run/docker.sock:/var/run/docker.sock \
  docker:cli \
  docker run --rm \
    -v "$DEMO_DIR:/host-data:ro" \
    alpine cat /host-data/proof.txt
```

**Narration:** The initial container was given the Docker socket, not the host test directory. It instructs the host daemon to create a second container with a read-only bind mount. The daemon evaluates the path and performs that mount.

The fixture is supplied with the workshop. `DEMO_DIR` expands in the host shell before the first container starts. See [the runbook](demo/01-docker-socket/runbook.md) and [local verification](demo/01-docker-socket/verification.md) for preparation and recorded versions.

**Safety guardrails:**

- [ ] Use a clearly labeled **non-sensitive dummy file**, never real credentials or user data.
- [ ] Keep the host bind mount **read-only** and restricted to the demo folder.
- [ ] Verify all paths and pre-pull `docker:cli` and `alpine` before presenting.
- [ ] Explain that Docker socket access is **not** part of every container configuration; don't claim ordinary containers can all do this.
- [ ] On Docker Desktop for macOS, clarify that shared file access is mediated by Docker Desktop; don't describe it as unrestricted macOS-root access.

**Success condition:** Attendees can articulate that broad daemon capabilities, not simply the fact of being a container, are the problem.

**Short route:** Prepare the dummy file and pull images beforehand. Spend two minutes explaining the highlighted command/prediction, three running it and inspecting the result, and one mapping the result back to the daemon request. Skip live setup and repeat runs.

### Demo 2 — AI coding agent builds a Streamlit data app (9-minute segment, including a 1-minute introduction)

**Objective:** Demonstrate beneficial autonomous work without giving the agent direct control of the host Docker daemon.

**App scenario:** A toy regional sales CSV with columns `date`, `region`, `product`, and `revenue`. The agent builds a dashboard with a summary KPI, two filters, a time trend, and a regional breakdown.

**Preflight CLI (macOS Apple silicon):**

```bash
brew trust docker/tap
brew install docker/tap/sbx
sbx login
```

**Pre-demo checks:** Confirm supported OS and hardware, agent credentials, network policy/preset, sample data, and the version of the installed `sbx` CLI. The macOS `sbx` local sandbox does not require Docker Desktop.

**Preparation for the shorter demo:** Authenticate and prepare the sandbox before the session; cache dependencies and images. Keep the full dashboard target, but show only selected Python filter and Dockerfile start components with moving highlights. Reserve detailed chart/aggregation walkthroughs for attendee questions.

**Launch:**

```bash
cd demo/02-agent-streamlit
sbx run --name odsc-demo codex .
```

**Agent prompt (starter):**

> You are working in a disposable project directory. Inspect `sample_sales.csv` and build a minimal Streamlit dashboard with region/product filters, total revenue, a time-series chart, and a regional breakdown. Add `requirements.txt`, a `Dockerfile`, and a short README. Build the image, start the app inside this sandbox, test the main flow, and report the exact command and listening port. Do not access files outside the project or use real credentials.

**Suggested demonstration order:**

1. Inspect CSV and explain the target application (30 seconds).
2. Start the coding agent and show its terminal activity.
3. Highlight the generated code and Dockerfile.
4. Show the `docker build`/run steps inside the sandbox.
5. Publish the app's port and open it in a host browser. For a service listening on **sandbox port 8501**, a published port can be configured with `sbx ports odsc-demo --publish 8501` (inspect the assigned host port afterward).
6. Explain that these containers are managed by the sandbox's own Docker engine.

**Timed route:** 0:33–0:34 introduce the data/task; 0:34–0:36 time-box agent generation; 0:36–0:38 inspect selected code and show the build; 0:38–0:40 run/publish/open; 0:40–0:42 test a filter and explain the boundary.

**Fallback:** Maintain a validated app in `expected-output/`, a prepared sandbox/image, and a 60–90 second local screen recording. At 0:36, switch to the validated app/recording if generation is incomplete. Use the prepared image if a build would exceed its slot. Clearly identify prepared or recorded results. Finish this segment by 0:42.

**Important:** The agent's runtime flags and authentication differ by supported agent and CLI version. Confirm the exact behavior in rehearsal, and never show tokens, API keys, or private repositories on screen.

### Demo 3 — Permission boundaries (6 minutes, following a 1-minute introduction)

**Objective:** Demonstrate control over where agent changes go and what network destinations the sandbox can reach.

**Workspace modes:**

- **Direct workspace (default `sbx run`):** Host project files are writable by the agent and edits are immediately visible. Useful for convenience, not for fully isolating project changes.
- **Clone mode:** `sbx run --clone codex .` on a **Git repository**; agent works in a private Git clone, with host repo mounted read-only, and changes are brought back only through an explicit Git workflow. Note: files under the Git root, including untracked or ignored secrets, may still be *readable*. Use a sanitized repository.
- **Mountless mode (optional mention):** Create a sandbox with no host workspace, then copy selected assets inside.

**Network controls (inspect first):**

```bash
sbx policy ls
```

Demonstrate a deliberate allowed vs. denied request using a test destination and a narrowly scoped policy change, rehearsed against your installed version. **Do not mutate the global policy live without a restore plan**, and avoid a denial rule that cuts off the agent's model-provider access.

**Key takeaway:** You control which resources are shared, but a directly mounted writable workspace is still writable; sandboxing does not make every operation reversible or harmless.

---

## 8. Work packages and implementation sequence

| Phase | Deliverables | Est. effort | Exit criterion |
|---|---|---:|---|
| **P0 — Content outline** | Workshop narrative, title/abstract, ~17-slide storyboard, key claims | 0.5–1 day | Flow matches the 60-minute agenda; the first topic is *why sandboxing* |
| **P1 — Demo proof-of-concept** | Three tested demo scripts, sample CSV, agent prompt, preflight/cleanup steps | 1–2 days | All demos work on the actual presenter machine |
| **P2 — HTML slide shell** | Reveal.js scaffold, theme, speaker notes, diagrams and code styles | 0.5–1 day | Deck runs locally and can be navigated offline |
| **P3 — Animated comics** | Three SVG/CSS/JS animations and still/video backups | 1–2 days | Readable, humorous, accurate, reliable on projector |
| **P4 — Integration** | Full deck, terminal cues, handout/reference links, demo transitions | 0.5–1 day | No dead links, mismatched command syntax, or broken animation timing |
| **P5 — QA and rehearsal** | Timed run-through, screenshots/recordings, fallback and room checklist | 0.5–1 day | Content finishes by minute 50; minutes 50–60 remain for questions |

**Suggested approach:** Complete P1 before investing heavily in animation. The most important project risk is an untested live demo, not an unfinished decorative transition.

### Suggested task backlog

**Must-have / P0**

- [ ] Freeze the central learning objective and 60-minute agenda
- [ ] Create toy CSV and Streamlit target specification
- [ ] Verify socket demonstration on presentation hardware
- [ ] Validate `sbx` installation, login, agent authentication, and sandbox launch
- [ ] Confirm ability to build an image and publish an app port from a local sandbox
- [ ] Design the microVM vs. host Docker daemon diagram
- [ ] Author 15–17 slides and brief speaker notes
- [ ] Prepare a working demo backup video and prebuilt project

**Should-have / P1**

- [ ] Animate approval fatigue, Docker socket escape, and microVM bonk
- [ ] Demonstrate both direct workspace and clone mode with sanitized files
- [ ] Show at least one clear network policy observation or block
- [ ] Package a one-page cheat sheet with exact commands and key cautions
- [ ] Add an audience-friendly decision table

**Nice-to-have / P2**

- [ ] Add sound effects (off by default) and manual replay controls
- [ ] Add a QR code pointing to the repository/handout
- [ ] Add a short audience participation prompt (“Should this agent get host Docker access?”)
- [ ] Provide optional follow-along labs after the workshop

---

## 9. Technical and factual review checklist

Before freezing slides, verify these claims against the current Docker documentation and the actual installed CLI:

- [ ] **Container isolation:** Shared-kernel isolation is meaningful and often enough for ordinary workloads; Docker socket exposure is a particular high-risk configuration, not a universal container flaw.
- [ ] **Local Docker Sandbox architecture:** Agent executes in a microVM with its own kernel, filesystem, network boundary, and Docker engine.
- [ ] **Access policies:** Egress rules require explicit configuration; initial network presets and their effects must be checked locally.
- [ ] **Workspace behavior:** Direct mounts are read-write; clone mode creates an independent working copy but still exposes readable files in the source repository, including ignored files.
- [ ] **Host integration nuances:** Special host-integrated tools or local MCP servers may run outside the VM; do not promise that every integration is covered by the same isolation model.
- [ ] **Credentials:** Explain host-side secret handling without implying that arbitrary secrets mounted inside a workspace are protected.
- [ ] **Port exposure:** Publishing an application port is an explicit choice; avoid exposing an app more broadly than necessary.
- [ ] **Platform requirements:** macOS Apple silicon + macOS 14+ for local `sbx`; validate any alternative workshop platform independently.
- [ ] **Version drift:** Re-run `sbx --help`, `sbx run --help`, and policy command help during final rehearsal.
- [ ] **No overclaim:** Prefer “stronger isolation” and “reduced host exposure” over “completely secure” or “impossible to escape.”

### Sources to link in presentation handout

- [Docker Sandboxes overview](https://docs.docker.com/ai/sandboxes/)
- [Installation and prerequisites](https://docs.docker.com/ai/sandboxes/install/)
- [Isolation layers](https://docs.docker.com/ai/sandboxes/security/isolation/)
- [Local sandbox quick start](https://docs.docker.com/ai/sandboxes/get-started/)
- [Usage, clone mode, and published ports](https://docs.docker.com/ai/sandboxes/usage/)
- [Network policies](https://docs.docker.com/ai/sandboxes/security/policy/)
- [Codex agent](https://docs.docker.com/ai/sandboxes/agents/codex/)
- [Docker Engine security guidance](https://docs.docker.com/engine/security/)

---

## 10. Presenter preflight and contingencies

### One week before

- [ ] Freeze slide copy and all animations
- [ ] Verify each demo end-to-end in a clean checkout
- [ ] Pin/record CLI and agent versions used in rehearsal
- [ ] Pre-pull container images and set up sandbox templates where applicable
- [ ] Record 30–90 second clips of the key demo results
- [ ] Remove any personal data, tokens, real secrets, private repository names, and personal paths from screen recordings

### Day before

- [ ] Confirm Wi-Fi needs and whether model-provider endpoints are reachable
- [ ] Authenticate Docker and agent on the demo machine; don't rely on live login
- [ ] Check disk space, sandbox start time, image cache, and expected network policy
- [ ] Re-test application port publishing and browser display
- [ ] Test slides, animations, recording fallbacks, font sizes, and video playback offline

### At the venue

- [ ] Switch off sensitive notifications and browser autocomplete where practical
- [ ] Increase terminal font and browser zoom for projection
- [ ] Open the correct project folder and prepare demo commands in a local script
- [ ] Keep a separate clean shell/window for each demo
- [ ] Have a working backup application, video, and static diagrams ready
- [ ] Start a countdown or presenter timer

### Failure recovery plan

| Problem | Immediate fallback |
|---|---|
| Installation is slow or fails | Show pre-recorded install segment; continue with prepared sandbox |
| Agent auth/model service is unavailable | Replay 60–90 second agent run; inspect prebuilt app and Dockerfile |
| Agent generates broken code | Use the pre-validated project in `expected-output/` and discuss the failure as a real agent risk |
| Image build is slow | Use prebuilt image and show the recorded build log |
| Workspace/network policy behaves differently | Show screenshots and describe the intended policy, without making unverified claims |
| Animation fails on projector | Use the storyboard's static final frame |
| Behind schedule | Switch to short recorded results and skip optional detail; preserve the key microVM comparison, finish content by minute 50, and keep the full ten-minute Q&A |

---

## 11. Acceptance criteria / definition of done

The development project is complete when:

1. **Content:** The presentation opens with the motivation for sandboxing and tells a coherent story suitable for beginners.
2. **Accuracy:** Every architecture and permissions claim has a verified source; no slide implies total security or universally insecure containers.
3. **Demos:** A controlled socket demo, working sandboxed agent run, and access-control example have been rehearsed on the actual hardware.
4. **Application:** The agent demo produces or displays a usable toy Streamlit app, and the app can be reached through an explicitly published port.
5. **Animations:** All three comic scenes are understandable without narration, projection-safe, and have nonanimated fallbacks.
6. **Reliability:** The deck loads locally without network access; live demos have accessible fallback videos or scripts.
7. **Timing:** All planned content, demos, transitions, and closing takeaways finish by minute 50. Reserve minutes 50–60 entirely for Q&A.
8. **Handoff:** Repository includes startup instructions, presenter notes, sample data, commands, troubleshooting, and source links.

---

## 12. Build-agent handoff prompt

> Build a local-first, browser-based Reveal.js slide deck for a beginner-friendly 60-minute ODSC workshop titled **“Running AI Agents Safely with Docker Sandboxes.”** Use this Markdown plan as the source of truth. The narrative must begin with **why autonomous agents need sandboxing**, then introduce isolation tiers, demonstrate the Docker socket security risk, explain Docker Sandboxes' microVM architecture, run an autonomous Codex agent that builds a toy Streamlit sales dashboard, and end with workspace/network access controls. Use a playful, cohesive animated-comic style for three scenes: (1) an exhausted engineer approving endless dialogs, (2) a mischievous robot using a mounted host Docker socket to launch a second container and read a harmless test file, and (3) a robot bouncing off a microVM boundary while still working successfully inside its own Docker engine. Finish all planned content by minute 50 and reserve minutes 50–60 for Q&A. Keep the app segment to nine minutes, time-box live generation to two minutes, and use prepared results when needed. Include speaker notes, reduced-motion fallback, static/video demo backups, and clearly labeled security caveats. Avoid inventing Docker CLI flags; verify commands against the official docs, and make the slide deck usable offline.

---

## 13. Final workshop takeaway

> **Grant agents enough autonomy to do useful work, but grant the outside world only the access they actually need.**

The workshop is not about running an LLM *inside a container*. It is about running an **autonomous coding agent inside a controlled execution boundary**, giving it development capabilities without routinely handing over control of the host.
