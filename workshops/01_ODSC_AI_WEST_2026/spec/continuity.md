# Workshop Continuity

**Status:** Topics 01–07 are built in one 17-slide deck and have passed independent content, browser, offline, and print checks. Authenticated sandbox demonstrations remain presenter-machine rehearsal tasks.

## Vocabulary and running example

- **Agent:** Software that can use tools to act toward a goal. Do not imply the model itself runs inside a local container.
- **Sandbox:** A controlled execution environment with defined resource access.
- **Container:** An isolated process environment sharing its underlying Linux kernel. Identify Docker Desktop's Linux VM when describing macOS.
- **MicroVM:** A lightweight VM with its own kernel.
- **Host Docker daemon:** The daemon intentionally exposed in the socket demonstration. Keep it distinct from the sandbox engine.
- **Sandbox Docker engine:** The separate engine used by processes inside the sandbox VM.
- **Direct workspace:** Shared host project with writable access.
- **Clone mode:** Separate working copy with readable source repository; avoid implying source secrets become hidden.
- **Running example:** Toy sales CSV with `date`, `region`, `product`, `revenue`; Streamlit dashboard with filters, total revenue, trend, and regional breakdown.
- **Characters:** Same enthusiastic robot and exhausted engineer across approval fatigue, socket request, and microVM boundary scenes.
- **Timing:** Teaching and closing takeaways finish by 50:00. The app segment runs 33:00–42:00 with a two-minute generation limit and prepared fallback. Reserve 50:00–60:00 for Q&A; detailed code views can be revisited there when asked.

## Planned learning state

| Topic | Concepts introduced | State after topic | Build/review status |
| --- | --- | --- | --- |
| 01 | Agent actions, approvals, execution boundaries | Five slides establish why access needs limits | built; QA passed; continued by user request |
| 02 | Kernel, containers, microVMs, configuration | Four mechanisms and two mount configurations compared | built; QA passed; continued by user request |
| 03 | Docker client, socket, daemon, second container | Dummy-file mechanism illustrated and verified locally | built; QA passed; continued by user request |
| 04 | Sandbox VM, own engine, launch arguments | Architecture and launch syntax established; actual launch awaits rehearsal | built; QA passed |
| 05 | CSV, app, image, container/sandbox/host port hops | Prepared dashboard and exact source are available; sandbox publishing remains a labeled rehearsal step | built; prepared app verified locally; QA passed |
| 06 | Direct vs. clone, scoped policy, observed results | Predictions and commands are separated from empty presenter-entered evidence | built; syntax checked; QA passed; live enforcement pending |
| 07 | Environment selection and shared-resource limits | Audience can apply the decision guide; Q&A begins at 50:00 | built; QA passed |

Prepared examples and predictions are labeled explicitly. They are not claims that an authenticated agent, sandbox port publication, or access-control enforcement run has occurred.

## Topic 01 implementation ledger

- **Files:** `slides/index.html`, `slides/styles/`, `slides/scripts/`, local Reveal.js and Inter assets, approval-fatigue poster and recording. Startup/static-export instructions are in `presenter/slides-preview.md`.
- **Established:** Tool actions reach resources; capability choices require access choices; repeated approvals can become reflexive; sandboxing defines an execution boundary with intentionally shared paths.
- **Interactions:** Four action selections, three illustrative task selections, three boundary selections, and a 12-second comic with Start/Pause/Replay. Widget selection changes emphasis only.
- **Verified:** Five live slides; layout at 1920×1080 and 1366×768; forward/back/Space navigation; all ten selectors; comic timing/pause/resume and slide-exit pause; hidden-slide focus protection; reduced-motion final still; presenter notes; offline local-file loading; complete five-page static export. Independent source review passed after static-caption/source expansion.
- **Running example:** Introduced only as an illustrative dashboard task. No CSV/app or live sandbox has been built or run for the workshop yet.
- **Forward bridge:** Slide 05 ends by inviting comparison of isolation implementations. Slides 06–07 now fulfill that promise.

## Topics 02–03 implementation ledger

- **Files:** Slides 06–09 in `slides/index.html`; scoped `slides/styles/isolation.css` and `slides/scripts/isolation.js`; the initialization hook in `presentation.js`; `demo/01-docker-socket/` fixture, runbook, verification and recorded stdout; socket illustration poster/video and separate recorded-result replay/video.
- **Established:** Direct execution retains user permissions; OS restrictions vary by mechanism; containers share an underlying Linux kernel; microVMs have their own kernel. The macOS inset places Linux containers inside Docker Desktop's Linux VM.
- **Daemon mechanism:** Container A receives a socket connection, then its client asks the host-controlled daemon to start sibling B with a deliberately chosen read-only fixture mount. No kernel exploit or unrestricted macOS-root access is implied.
- **Verified demo:** Local context `desktop-linux`, Docker client/server 29.7.2. Canonical command exited 0, printed the fixture, and left the fixture unchanged. The two containers used `--rm`. Image digests and real stdout are recorded in the demo folder. No sandboxed agent/app has run yet.
- **Verified presentation:** Nine slides fit at 1920×1080 and 1366×768. All 21 selection controls across the deck pass. Six stationary code-highlight states match captions and diagram emphasis in both directions; copying returns exactly the tested six-line command. Socket playback, pause/resume, slide-exit pause, reduced-motion final still, and offline code stepping pass. The static export contains nine pages with all explanations and sources. Independent source QA passes for Topics 02 and 03.
- **Forward bridge:** Slide 09 closes by asking how useful Docker work can stay inside a separate VM and engine. Slides 10–12 now fulfill that promise.

## Topic 04 implementation ledger

- **Files:** Slides 10–12 in `slides/index.html`; scoped `slides/styles/sandbox.css` and `slides/scripts/sandbox.js`; initialization in `presentation.js`; `presenter/agent-launch.md`; microVM poster/video fallback; the launch workspace directory.
- **Established:** Sandbox Docker requests use the engine inside its microVM and separate Linux kernel. Writable workspace sharing remains writable; local stdio MCP servers may execute on the host outside the VM. Network access still follows policy.
- **Launch:** The canonical five-line command selects the project, sandbox name, Codex agent, and current-directory workspace. Named sandboxes may reconnect. Checked against sbx v0.48.0 (build `5caf923e0587d376848f6f388eca3e0f5ca00e2d`) on macOS 15.7.3 arm64 and current official documentation. Docker sign-in and agent authentication are separate preparation steps. No live sign-in, credential inspection, agent launch, or app execution occurred in this batch.
- **Verified presentation:** Twelve slides fit at 1920×1080 and 1366×768, with all 25 selection controls checked. The five launch highlights match captions and diagram emphasis forward/backward; copying matches the runbook exactly. MicroVM comic playback, precise pause/resume, slide-exit pause, reduced-motion final still, and offline launch stepping pass. No browser errors, failed requests, or external asset requests. The twelve-page print export includes all alternate explanations and sources. Independent content QA passed.
- **Fallback:** The 11-second comic has a local WebM recording and final poster, labeled as illustration. Authenticated launch/app fallbacks remain part of Topic 05.
- **Forward bridge:** Slide 12 hands off to building the sales app. Slide 13 fulfills that bridge with the toy CSV, prepared source, port path, and shortened live/fallback route.

## Topics 05–07 implementation ledger

- **Files:** Slides 13–17 in `slides/index.html`; `slides/styles/finishing.css`; `slides/scripts/finishing.js`; `demo/02-agent-streamlit/`; `demo/03-access-controls/runbook.md`; `presenter/prepared-dashboard.html`; `presenter/resources.md`; prepared screenshot and recording.
- **Established:** The app walkthrough moves through task/data, Python, Dockerfile/build, and publish/app states. Workspace mode and network policy are independent choices. Clone source remains readable even when its source mount is read-only. Policy checks and real requests provide different evidence. The closing guide begins with the workload and reviews every shared capability.
- **Prepared app verification:** Streamlit AppTest passes $19,000 total, $10,500 West, $4,200 West/Notebook, and the empty result. A host Docker image build and browser run validate the prepared app and container port mapping. The local fallback reproduces the filter change. These checks do not prove a sandbox/model session or sandbox-to-host publishing.
- **Access evidence:** Installed sbx v0.48.0 and official documentation support the displayed command syntax. Slide 15 starts with empty observations and labels expected behavior as predictions. Authenticated workspace and policy enforcement still require rehearsal.
- **Verified presentation:** Exactly 17 live slides fit at 1920×1080 and 1366×768. All new selector combinations, reversible highlight states, exact-source copying, observation memory/editing, keyboard navigation, local-file offline loading, and fallback filtering pass. No browser errors, failed local requests, or external asset requests occur. The 17-page PDF export contains static alternatives and sources. Independent content QA passed.
- **Timing:** Slide notes and visible cues finish teaching at 50:00. Slide 17 reserves 50:00–60:00 for Q&A.

## Promise tracker

| From | Forward bridge | Fulfilled by | Status |
| --- | --- | --- | --- |
| 01 | Compare ways to define the execution boundary | 02 | fulfilled |
| 02 | Observe how a shared daemon capability affects a container | 03 | fulfilled |
| 03 | Keep useful Docker work inside a different boundary | 04 | fulfilled |
| 04 | Use that environment to build the sales app | 05 | fulfilled |
| 05 | Check the resources we deliberately shared | 06 | fulfilled |
| 06 | Apply the observed distinctions to environment selection | 07 | fulfilled |
