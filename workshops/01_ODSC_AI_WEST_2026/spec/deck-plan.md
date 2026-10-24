# Running AI Agents Safely with Docker Sandboxes — Deck Plan

**Subtitle:** Secure Autonomy with Micro VMs  
**Event:** ODSC AI West 2026  
**Duration:** 60 minutes  
**Status:** Complete 17-slide deck built and checked; authenticated sandbox/access-control rehearsal pending  
**Planning date:** October 17, 2026

Source: [workshop development plan](../docker_sandboxes_ai_agents_workshop_development_plan.md). This document turns its 17-slide blueprint into an implementation plan. The brief controls the workshop narrative. This plan adds interaction behavior, code walkthroughs, timing, and implementation acceptance criteria.

## 1. Teaching approach

Start with the agent's ability to act and the need to bound those actions. Introduce isolation before installation. Use the same robot and engineer throughout the three comic scenes, then connect each comic to an architecture diagram or observable demonstration.

The running example is a toy sales dashboard built from `date`, `region`, `product`, and `revenue`. Attendees watch a coding agent inspect the CSV, build a Streamlit app, package it, and run it inside a sandbox. They then see what changes when workspace access and network policy change.

By the end, attendees should be able to:

- Explain why autonomous execution needs explicit resource boundaries.
- Distinguish a container boundary from a microVM boundary.
- Explain how a mounted Docker socket lets a client ask the host daemon to launch another container.
- Recognize the steps for starting a sandboxed coding agent and viewing its application.
- Choose workspace and network access appropriate to the task.

Treat this as a beginner-friendly, presenter-led workshop with audience predictions. Follow-along installation and lab exercises are outside this deck's 60-minute schedule.

## 2. Timing and slide map

Keep all 17 slides in one combined deck. Sections identify the seven agenda topics without adding divider slides. Small interactions happen within existing slides.

| Session window | Topic | Slides | Explanation | Guided interaction / transitions | Live demos | Q&A |
| --- | --- | --- | ---: | ---: | ---: | ---: |
| 00:00–10:00 | Why agents need sandboxes | 01–05 | 8 min | 2 min | — | — |
| 10:00–18:00 | Levels of isolation | 06–07 | 5 min | 3 min | — | — |
| 18:00–26:00 | Docker socket exposure | 08–09 | 2 min | — | 6 min | — |
| 26:00–33:00 | Docker Sandboxes architecture and launch | 10–12 | 5 min | 2 min | — | — |
| 33:00–42:00 | Agent builds a data app | 13 | 1 min | — | 8 min | — |
| 42:00–49:00 | Workspace and network controls | 14–15 | 1 min | — | 6 min | — |
| 49:00–50:00 | Decision guide and takeaways | 16–17 | 1 min | — | — | — |
| 50:00–60:00 | Q&A | 17 stays visible | — | — | — | 10 min |
| **Total** | | **17** | **23 min** | **7 min** | **20 min** | **10 min** |

Demo time includes explanation while executing commands and inspecting results. Content explanation outside demos stays below half the session. The demo slide remains visible when returning from the terminal or browser.

**Hard stop:** Finish all planned content and the closing takeaway by 50:00. Protect the full final ten minutes for Q&A. The app segment is shortened from 15 to 9 minutes and the socket demonstration from 8 to 6 minutes. Use prepared environments, cached dependencies/images, and a two-minute limit on live app generation. If behind schedule, switch to the short recorded result and defer detailed code questions to Q&A.

## 3. Slide-by-slide storyboard

### 01 — Running AI Agents Safely with Docker Sandboxes

**Window:** 00:00–00:30. **Purpose:** Set the promise: useful autonomy within a controlled environment.

- **Canvas:** Workshop title, subtitle, presenter/event line, robot peeking out of a sandbox. Keep the title dominant.
- **Interaction:** Quiet idle motion only. No clicks required to reach the promise.
- **Presenter cue:** We will see the boundary problem, run an agent, and check what it can reach. Bridge to the actions agents take.
- **Fallback:** Static title artwork.

### 02 — AI agents can act on our computers

**Window:** 00:30–02:30. **Purpose:** Distinguish answering a question from executing a tool.

- **Canvas:** One agent with connections to a terminal, project files, package installation, and Docker builds.
- **Interaction:** Selecting an action emphasizes its affected resource and a short example. Keep every resource label visible from the start.
- **Presenter cue:** Define an agent as software that can use tools to act toward a goal. Ask attendees to identify an action they would want reviewed.
- **Fallback:** All actions and resource connections visible together.

### 03 — Autonomy expands access

**Window:** 02:30–04:30. **Purpose:** Connect useful capabilities to access decisions.

- **Canvas:** Robot with oversized keys beside the host's project, home directory, network, and Docker daemon.
- **Interaction:** Three discrete scenarios: suggest code, edit a project, run builds and tools. Each selection emphasizes the resources it needs. This is an illustration, not a risk score or permission configuration tool.
- **Presenter cue:** More capabilities require more deliberate access choices. Bridge to the burden of reviewing every action.
- **Fallback:** Three labeled scenarios in a static comparison.

### 04 — Approval fatigue

**Window:** 04:30–07:30. **Purpose:** Show how repeated prompts can weaken thoughtful review.

- **Canvas:** Comic A, the engineer approving tests, installs, file edits, and commands until the stamp becomes automatic.
- **Interaction:** Presenter starts a 10–14 second sequence. Provide Replay and Pause. After the final frame, a prediction prompt invites a show of hands about what the engineer is actually reviewing.
- **Presenter cue:** Deliberate execution boundaries reduce reliance on repetitive approvals. Oversight still matters.
- **Fallback:** Three storyboard frames showing the progression. Reduced motion starts on the final still.

### 05 — A sandbox defines the execution boundary

**Window:** 07:30–10:00. **Purpose:** Define sandboxing before comparing implementations.

- **Canvas:** Host outside, agent and tools inside, with explicit workspace, network, and credential connections across the boundary.
- **Interaction:** Selecting a connection emphasizes the corresponding access path and explanation. Connections represent intentionally shared resources, not open access to everything outside.
- **Presenter cue:** A sandbox is a controlled execution environment with defined resource access. Next, compare ways to create that boundary.
- **Fallback:** Fully labeled boundary diagram.

### 06 — Levels of isolation

**Window:** 10:00–14:00. **Purpose:** Introduce direct execution, OS restrictions, containers, and microVMs.

- **Canvas:** Four positions on an isolation spectrum with a single expanded explanation. Define a kernel as the OS component managing processes and resources, and a microVM as a lightweight virtual machine with its own kernel.
- **Interaction:** Selecting a position emphasizes where code runs, which kernel it uses, and what the operator configures. Describe OS restrictions as a family of controls with different guarantees.
- **Presenter cue:** Isolation brings trade-offs in setup, resource use, and integration. Avoid ranking every implementation with a single numerical safety score.
- **Fallback:** Static comparison with the same four positions and brief descriptions.

### 07 — Container isolation and configuration

**Window:** 14:00–18:00. **Purpose:** Explain meaningful container isolation and how shared capabilities affect it.

- **Canvas:** Container processes, shared Linux kernel, and intentionally mounted resources. A macOS inset identifies Docker Desktop's Linux VM so the drawing does not imply Linux containers share the macOS kernel.
- **Interaction:** Switch the diagram between a limited project mount and a mounted Docker socket. Emphasize the additional connection in the second configuration.
- **Presenter cue:** Regular containers suit many workloads. A socket mount changes the capabilities available to the client. Ask the audience to predict what that client could request.
- **Fallback:** Both configurations side by side. Bridge to the socket mechanism.

### 08 — Access through the Docker socket

**Window:** 18:00–20:00. **Purpose:** Explain the mechanism before executing the demonstration.

- **Canvas:** Comic B, with labels for container A, host Docker daemon, container B, and the dummy host folder.
- **Interaction:** Manual steps: socket connection, API request, second container, read-only demo mount, returned file contents. Replay can play these steps as a 10–12 second sequence.
- **Presenter cue:** Container A instructs the daemon to create B with a bind mount. The daemon resolves the host path. Label this as daemon control through a deliberately exposed socket.
- **Fallback:** Static numbered mechanism. On macOS, mention Docker Desktop file-sharing limits. Never depict a kernel being broken or arbitrary files appearing by magic.

### 09 — Demo: a deliberately shared host test file

**Window:** 20:00–26:00. **Purpose:** Observe the consequence of handing a container the host socket.

- **Canvas:** Six-line command, compact matching diagram, and a short success criterion: the second container prints the dummy file. Persistent labels identify the host shell, first container, and second container.
- **Interaction:** Advance the highlight through walkthrough C1 below, then switch to the prepared terminal. Returning preserves the current state. The deck displays no fabricated terminal output.
- **Presenter cue:** Use a prepared dummy file and pre-pulled images. Spend two minutes on the prediction and moving highlights, three on execution/results, and the final minute mapping the result back to the daemon request. Do not perform setup or repeat runs live.
- **Fallback:** A short local recording of the same command, then the static annotated command. Use only the disposable test folder and a read-only mount.

### 10 — Docker Sandboxes architecture

**Window:** 26:00–29:00. **Purpose:** Show where agent-issued Docker commands execute.

- **Canvas:** Side-by-side diagrams: socket-enabled container using a host daemon, and agent plus separate Docker engine inside a microVM. Label the separate Linux kernel.
- **Interaction:** Select the agent's Docker request in either diagram to emphasize its destination. Select the workspace or outbound connection to show the intentionally shared path. Keep structure stable while emphasis changes.
- **Presenter cue:** The VM boundary changes where tool execution happens. Host integrations, such as local stdio MCP servers, can run outside that boundary and need separate consideration. Keep that caveat in notes and a short diagram caption.
- **Fallback:** Both request paths labeled. Source: [Docker isolation layers](https://docs.docker.com/ai/sandboxes/security/isolation/).

### 11 — The robot meets the microVM boundary

**Window:** 29:00–30:00. **Purpose:** Make the engine distinction memorable.

- **Canvas:** Comic C. Robot successfully builds inside the sandbox, fails to connect its hose to the host daemon, bounces, and returns to its own engine.
- **Interaction:** Start / Replay / Pause for an 8–12 second scene. The successful in-sandbox build remains part of the story.
- **Presenter cue:** Explain the default Docker Engine boundary. Keep a visible caption that shared writable files remain writable. The cartoon does not establish an absolute protection claim.
- **Fallback:** Three static frames, including the successful internal build.

### 12 — Starting the coding agent

**Window:** 30:00–33:00. **Purpose:** Orient attendees to the launch command without consuming the session on installation.

- **Canvas:** A small prerequisites line and launch walkthrough C2. Label its context as the host shell.
- **Interaction:** Move emphasis from the chosen folder to the sandbox name and finally the agent/workspace arguments. Open a prepared terminal at the launch cue.
- **Presenter cue:** Installation, Docker sign-in, agent authentication, and network selection happen before the session. Briefly distinguish Docker sign-in from agent credentials. Explain that local `sbx` does not require Docker Desktop; the earlier socket demo does require a host Docker daemon.
- **Fallback:** Launch recording and a prepared sandbox. Put install commands and platform details in notes/reference material, not a live installation exercise. Sources: [installation](https://docs.docker.com/ai/sandboxes/install/), [Codex agent setup](https://docs.docker.com/ai/sandboxes/agents/codex/).

### 13 — Demo: a sales dashboard from a CSV

**Window:** 33:00–42:00. **Purpose:** Show beneficial autonomous work inside the boundary in a focused nine-minute segment.

- **Canvas:** One demo hub with four presenter-selectable views: task/data, application code, Dockerfile/build, and published application. Show one view at a time at projection scale. These remain states of slide 13.
- **Interaction:** Highlight CSV columns, then move through relevant application and Dockerfile components using C3. Use C4 to explain port publishing before switching to the host browser. A small diagram distinguishes container port, sandbox port, and assigned host port.
- **Presenter cue / clock:** 33:00–34:00 introduce CSV, task, and success criteria; 34:00–36:00 time-box agent work; 36:00–38:00 inspect the filter expression and Dockerfile start command, then show the build; 38:00–40:00 run, publish, and open the app; 40:00–42:00 test a filter and explain the execution boundary. At 36:00 switch to the validated app/recording if generation is incomplete. Use a prepared image if the build would overrun its slot.
- **Success criteria:** Region/product filters, total revenue, time trend, regional breakdown, Docker image, and app reachable in the host browser. Show the sandbox's own engine managing the container.
- **Preparation and fallback:** Authenticate and start the sandbox beforehand; cache dependencies and images. Keep the complete dashboard target, but limit the live code walkthrough to the filter and container start. Other code views are available during Q&A. Prepare `expected-output/`, an image, and a 60–90 second recording. Label recordings and prebuilt results. Avoid presenting their output as a new live run.

### 14 — Workspace and network access

**Window:** 42:00–43:00. **Purpose:** Establish what the final demo will test.

- **Canvas:** Direct mount and clone mode beside a separate network-policy connection. Direct mount shows edits reaching the host. Clone mode shows edits staying in its working copy and the source remaining readable.
- **Interaction:** Toggle between the two workspace diagrams. Network selection changes emphasis independently so the audience can distinguish file access from egress rules.
- **Presenter cue:** Clone mode limits writes to the source repository; it does not hide ignored or untracked secrets there. Mention mountless mode as an optional extension in notes.
- **Fallback:** Labeled static comparison. Source: [workspace isolation](https://docs.docker.com/ai/sandboxes/security/isolation/#workspace-isolation).

### 15 — Demo: checking the boundaries

**Window:** 43:00–49:00. **Purpose:** Compare permitted work with a blocked action using observable evidence.

- **Canvas:** A prediction area and a result area, with workspace and network cases selected in turn. Each case has a clear Host or Sandbox label. Predictions are illustrative until the terminal result is shown.
- **Interaction:** C5 emphasizes direct and clone launch commands. C6 moves from policy inspection to two destination checks. Return to record the actual observed outcome and matched rule, not a generic success icon.
- **Presenter cue / clock:** 43:00–46:00 compare edits in prepared direct/clone sandboxes, including a denied write to the read-only source; 46:00–48:00 show one allowed and one explicitly denied network request; 48:00–49:00 restore only demo changes and explain stop/remove. Use harmless marker files and a sanitized standalone Git repository. End by 49:00 to preserve the closing minute and the full Q&A slot.
- **Network accuracy:** Separate a policy-check decision from an actual request. Use an explicit sandbox-scoped deny for a rehearsed test endpoint. Unmatched destinations can trigger approval, so do not label every default-deny outcome as an explicit denial. Keep the model-provider endpoint reachable.
- **Fallback:** Paired host/sandbox snapshots and recorded requests. If time is short, retain one workspace result and one network result, then show cleanup from the recording. Source: [local policy](https://docs.docker.com/ai/sandboxes/governance/access-controls/local/).

### 16 — Choosing an execution environment

**Window:** 49:00–49:30. **Purpose:** Apply the workshop's distinctions to a practical choice.

- **Canvas:** A concise comparison: ordinary containerized workloads with deliberate mounts, and autonomous agents that need their own VM and Docker engine.
- **Interaction:** Optional scenario selection emphasizes a recommendation and its reason. Include a case needing access review rather than automatically selecting the strongest-sounding environment. No scoring quiz or extra navigation steps in the timed route.
- **Presenter cue:** Choose based on the code being executed and resources being granted. A microVM still requires deliberate sharing decisions.
- **Fallback:** Static comparison, immediately readable.

### 17 — Autonomy within deliberate boundaries

**Window:** 49:30–50:00 closing; 50:00–60:00 Q&A. **Purpose:** Close the story before the final ten minutes of questions.

- **Canvas:** Robot productively working inside the sandbox, with three short takeaways: agents execute actions; isolation changes their reach; shared resources still matter. Add the verified repository/handout link during integration.
- **Interaction:** Optional callback highlights the corresponding earlier diagram. The default final state already shows every takeaway and remains visible during Q&A.
- **Presenter cue:** Close in 30 seconds and start Q&A at 50:00. Keep the takeaways visible while answering. Revisit code views or diagrams in response to questions, without scheduling extra teaching content in this slot.
- **Fallback:** The final still is also the closing slide. No unverified QR destination or placeholder link in the delivered deck.

## 4. Code presentation and moving highlights

### Common behavior

Use Reveal.js's bundled highlight plugin for syntax colors and its `data-line-numbers` sequence for presenter-controlled line emphasis. For example, `data-line-numbers="1|2-3|4-5"` keeps a block in place while the emphasis advances. This is supported by the [Reveal.js code documentation](https://revealjs.com/code/).

- Set the language explicitly: Bash, Python, Dockerfile, CSV/plain text as supported by the pinned highlighter. Prefer plain text over incorrect CSV highlighting.
- Each block has one learning purpose and generally 3–8 lines. Two-line comparisons are acceptable. Keep complete examples in demo files.
- The presenter advances and reverses emphasis with the presentation controls. Do not automatically advance code during an explanation.
- A short caption changes with each highlight to explain the active component. Diagram emphasis follows the same step where relevant.
- Keep code stationary and readable. Use a border/marker and explanatory caption in addition to color. Dim inactive lines only enough to maintain contrast.
- Keep command and output blocks separate, with their execution context labeled. Copy controls return the complete source command without line numbers, prompts, captions, or highlight markup.
- Widget focus, text selection, copy buttons, and tabs must not accidentally advance a slide. Returning to a demo slide preserves state. A deliberate Reset restores its initial state.
- Reduced motion retains step selection with immediate emphasis changes. Print/PDF output includes the full block and all explanatory captions.
- Record each step's line range, explanation, and diagram target together in the implementation. Remap ranges when the source snippet changes and check them against the final files.

### C1 — Socket demonstration, slides 08–09

Use the brief's command with `DEMO_DIR` set in the host shell to the workshop's disposable fixture folder. The exact preparation is in [the socket runbook](../demo/01-docker-socket/runbook.md).

```bash
docker run --rm \
  -v /var/run/docker.sock:/var/run/docker.sock \
  docker:cli \
  docker run --rm \
    -v "$DEMO_DIR:/host-data:ro" \
    alpine cat /host-data/proof.txt
```

| Step | Lines | Explanation | Diagram emphasis |
| --- | --- | --- | --- |
| 1 | 1,3 | Start container A with a Docker client | Host shell and container A |
| 2 | 2 | Give A access to the host daemon's socket | Socket connection |
| 3 | 4 | Client asks that daemon to start container B | Daemon request and container B |
| 4 | 5 | Daemon mounts the disposable host folder read-only | Host folder and B's mount |
| 5 | 6 | B reads the dummy file through that mount | Read result |
| 6 | 1–6 | Revisit the complete request chain | Entire mechanism |

Planned attribute: `data-line-numbers="1,3|2|4|5|6|1-6"`. Explain that `$DEMO_DIR` expands in the host shell before container A starts. This avoids suggesting that A discovered the host folder. On macOS, the host folder must be available through Docker Desktop file sharing. Source for the mechanism: [Docker daemon attack surface](https://docs.docker.com/engine/security/#docker-daemon-attack-surface).

### C2 — Launching the agent, slide 12

```bash
cd demo/02-agent-streamlit
sbx run \
  --name odsc-demo \
  codex \
  .
```

Planned sequence: `1|2-3|4|5|1-5`. Explain folder selection, sandbox identity, agent choice, and the current-directory workspace. The final dot grants workspace access. This example uses the direct workspace behavior described in the brief. Rehearse authentication separately. Source: [sandbox usage](https://docs.docker.com/ai/sandboxes/usage/).

### C3 — Generated application and Dockerfile, slide 13

These are teaching excerpts from the eventual validated demo files, not invented agent output. Final line ranges depend on those files and are intentionally deferred.

| View | Emphasis sequence | What each step explains |
| --- | --- | --- |
| CSV | Header, then one representative row | Column meanings and toy data |
| Python excerpt A | CSV load, filter inputs, filter expression | How attendee selections change the rows |
| Python excerpt B | Revenue aggregation, trend data, chart calls | How filtered data becomes the dashboard |
| Dockerfile | Base image, dependencies, copied app, start command | How the app becomes a runnable container |
| Build/run command | Image build, sandbox-engine container run, container port mapping | Where Docker operates and where the service listens |

Use separate short code views rather than shrinking one long file. The main agent task prompt appears as readable prose. Highlight its task constraints with text emphasis, not a programming-language lexer. Never imply a prompt instruction enforces a security boundary.

For the nine-minute app segment, show the CSV briefly and demonstrate moving emphasis on the Python filter expression and Dockerfile start command. Keep the fuller load/aggregation/chart walkthrough available for questions rather than stepping through every view on the timed route.

### C4 — Publishing the application, slide 13

```bash
sbx ports odsc-demo --publish 8501
sbx ports odsc-demo
```

Planned sequence: `1|2|1-2`. The first line forwards sandbox port 8501. The second shows the assigned host port to open in the browser. Before this step, the app container must expose its listening service to sandbox port 8501. Verify both hops and the actual host binding during rehearsal. Source: [published ports](https://docs.docker.com/ai/sandboxes/usage/#publish-ports).

### C5 — Workspace comparison, slide 15

```bash
sbx run --name odsc-direct codex .
sbx run --clone --name odsc-clone codex .
```

Planned sequence: `1|2|1-2`. These are alternative prepared environments, not a mode switch on one existing sandbox. The clone example runs from the sanitized Git repository's main checkout. Emphasize `--clone` with a caption and explain the separate working copy. Keep the host source's readable status visible. Source: [Git workspace modes](https://docs.docker.com/ai/sandboxes/usage/#git-workspace-modes).

### C6 — Network inspection and evidence, slide 15

Plan three short views: active rules, an allowed destination check/request, and an explicitly denied destination check/request. Each advances through command, decision, and relevant rule. The baseline inspection is `sbx policy ls`; select the final scoped commands, real test destination, rule removal, and expected outputs during demo rehearsal.

Keep shell commands distinct from CLI output. Label a policy check as a policy check. Show the actual request separately. Explain sandbox scope before a mutation and capture the prior state. No live global reset. Source: [local policy inspection and testing](https://docs.docker.com/ai/sandboxes/governance/access-controls/local/).

## 5. HTML, visual, and interaction requirements

**Engine:** One Reveal.js deck at `slides/index.html`, matching the supplied brief. Use local assets and pinned dependencies, with the notes and highlight plugins. Configure a 16:9 canvas, fade transitions, a slim progress bar, and no persistent slide counter or navigation hints. Bundle fonts locally with a system fallback.

**Design:** Use the workshop skill's design-principles palette and Inter/monospace typography as a starting point. Keep generous whitespace, large labels, and one dominant visual per slide. Comic scenes carry motivation and memorable callbacks. Technical diagrams carry factual relationships. Avoid unexplained abbreviations and tiny caveat text.

**Interaction:** Every interaction has a teaching purpose, a keyboard path, a stable reset state, and an understandable static state. Use selections to change emphasis, compare configurations, predict results, and inspect evidence. Keep hidden content from receiving focus. Native presentation navigation advances code steps before moving to the next slide, and handles reversing them consistently.

**Motion:** Comic playback is manually started and paused/replayed locally. No sound by default. Leave the scene on a useful final frame. Stop animations/media on inactive slides. Honor `prefers-reduced-motion`. Use a still plus numbered captions when motion is disabled. No essential fact depends on timing or motion.

**Offline:** Slides, fonts, code highlighting, diagrams, comics, and fallback recordings run without external requests after setup. Live model calls and uncached package/image downloads still need connectivity. Keep this distinction in presenter preparation.

**Speaker notes:** Brief notes rather than a spoken script. Each slide includes its teaching objective, time window, interaction steps, bridge, claim sources, and fallback cue. Demo notes also name the prepared terminal and the time to abandon a slow path. Presenter view includes elapsed-time cues and local links to runbooks.

**Print/static mode:** Expand alternate states into labeled explanations or companion appendix pages, show code without dimming, use comic poster frames, and include sources. Preserve 17 slides in the live route. An expanded static export can contain more pages without adding live slides.

The brief's Reveal.js engine, comic animation, interactive states, and requested moving highlights take precedence over the generic workshop template's engine and restrictions on click reveals. Use those changes to teach the material while retaining readable, stable layouts.

## 6. Planned assets and paths

Paths below are relative to the workshop folder and describe the full workshop. The implementation status in [workshop-spec.md](workshop-spec.md) distinguishes built slides from pending work.

| Path | Purpose |
| --- | --- |
| `spec/deck-plan.md` | This storyboard and interaction contract |
| `spec/workshop-spec.md` | Scope, defaults, and implementation status |
| `spec/agenda.md` | Topic order, timings, and dependencies |
| `spec/continuity.md` | Terminology, running-example state, and bridges |
| `spec/open-items.md` | Decisions and validation still needed |
| `package.json` and lockfile | Pinned deck tooling and local build/serve commands |
| `slides/index.html` | Combined 17-slide deck |
| `slides/styles/theme.css` and `comic.css` | Projection typography, code emphasis, comic styling |
| `slides/scripts/presentation.js` and `animations.js` | Interaction state, captions, highlights, replay, motion preferences |
| `slides/assets/` | Local character art, diagrams, fonts, posters, demo screenshots |
| `demo/01-docker-socket/` | Disposable-file demonstration and tested commands |
| `demo/02-agent-streamlit/` | Toy CSV, task prompt, validated app in `expected-output/` |
| `demo/03-access-controls/` | Sanitized workspace fixtures and scoped policy runbook |
| `presenter/` | Brief notes, rehearsal checklist, fallbacks, source handout |
| `recordings/` | Local short demo backups and comic video alternatives |

Retain the source brief's demo-oriented layout rather than creating duplicate topic folders. Default topic READMEs are off; demo operation notes/runbooks accompany the corresponding demos. No full narration scripts are planned. The current implementation covers all 17 slides.

## 7. Implementation order

1. Review this 17-slide plan and freeze its narrative/timing before building the deck.
2. Prove the three demonstrations on the actual presentation machine. Record CLI/agent versions, actual outputs, port mappings, and fallback paths. Freeze small canonical code excerpts and their highlight maps.
3. Build the offline HTML shell and representative slides 09 and 13 first. Verify stepping, reversing highlights, captions, copy behavior, notes, and returning from the terminal.
4. Build topic sections in agenda order in the same deck. Review each section before continuing under the default step-by-step workflow. Independent workshop QA checks each built topic, including continuity.
5. Produce the recurring character assets and three comic scenes after the technical mechanisms are proven. Add reduced-motion and poster/video alternatives together.
6. Integrate runbooks, recordings, sources, and notes. Rehearse content through the closing takeaway by 50:00, then reserve 50:00–60:00 for Q&A.

The source brief recommends proving demonstrations before substantial technical animation work. The socket demonstration is verified on the local Docker Desktop engine. The prepared Streamlit application passes AppTest and a host Docker/browser run. All 17 slides now pass independent content review, interaction and layout checks at both target viewports, direct-file offline loading, and a 17-page print export. Authenticated agent launch, sandbox port publishing, and live workspace/network-policy enforcement still require rehearsal on the presentation setup.

## 8. Acceptance criteria for the eventual deck

- Exactly 17 slides in the main route, with the brief's narrative order, seven content topics, and a separate final Q&A block.
- Explanation outside demos stays under 30 minutes; all teaching, 20 minutes of live demos, transitions, and closing takeaways finish by 50:00. Reserve the entire 50:00–60:00 period for Q&A.
- Every code excerpt has correct syntax treatment, meaningful component emphasis, and synchronized captions. Arrow/Space forward and backward produce the intended steps. Copy returns runnable code where the block is presented as a command.
- App/Dockerfile excerpts match the validated demo files. All commands are checked against the installed CLI; no generated or recorded output is presented as a live result.
- Architecture distinguishes the sandbox engine from the host daemon and accurately depicts Docker Desktop on macOS. Workspace, credential, host-integration, and network qualifications remain understandable.
- Every interactive state works with a keyboard and retains sufficient contrast. Reduced-motion and print/static views preserve the explanation.
- At the target 1920×1080 projection size and a 1366×768 laptop viewport, labels and code fit without clipping or internal scrolling. Split content before shrinking it below a readable size.
- Navigation, notes, code highlight stepping, and demo fallbacks work with external networking disabled. Live-demo connectivity requirements are documented separately.
- Each comic has a representative still, replay/pause controls, and a video alternative. All demonstrations have a short route and a local fallback.
- Independent content/continuity review and a timed presenter rehearsal finish before the deck is marked ready.

## 9. Source and verification notes

The development brief supplies the teaching claims and examples. Official pages and installed sbx v0.48.0 confirm the command syntax. The local socket demonstration and prepared application are verified as documented. Authenticated sandbox, port-forwarding, and access-control behavior remain unverified and are labeled as predictions or rehearsal steps.

| Reference | Used for | Final validation still needed |
| --- | --- | --- |
| [Reveal.js code](https://revealjs.com/code/) | Syntax highlighting and multi-step line highlights | Slides 09, 12, 13, and 15 behavior verified |
| [Docker Engine security](https://docs.docker.com/engine/security/) | Daemon control and host bind-mount explanation | Socket path, daemon privileges, Docker Desktop sharing |
| [Sandbox isolation](https://docs.docker.com/ai/sandboxes/security/isolation/) | MicroVM, own engine, workspace modes, host-integration caveats | Actual enabled integrations and shared resources |
| [Sandbox installation](https://docs.docker.com/ai/sandboxes/install/) | Supported presentation platform and installation prerequisites | Conference setup recheck; local macOS 15.7.3 arm64 and sbx v0.48.0 confirmed |
| [Sandbox usage](https://docs.docker.com/ai/sandboxes/usage/) | Launch, clone, published ports, lifecycle | Commands, authentication, bindings, persistence on presenter machine |
| [Local policy](https://docs.docker.com/ai/sandboxes/governance/access-controls/local/) | Scoped rules, inspection, explicit deny vs. approval-required access | Active preset/governance and rehearsed destinations |
| [Codex agent](https://docs.docker.com/ai/sandboxes/agents/codex/) | Agent choice and authentication preparation | Working credentials without exposing secrets |

Scope is local Docker Sandboxes. Cloud sandboxes, detailed organization governance, real-world incident anecdotes, sound effects, QR production, and follow-along labs are outside the main route.
