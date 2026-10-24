# Previewing the 17-slide deck

The deck covers agent actions, resource access, approval fatigue, isolation mechanisms, container configuration, the Docker socket demonstration, sandbox architecture and launch, a prepared data-app walkthrough, workspace/network controls, evidence checks, and the final decision guide. The closing slide preserves 50:00–60:00 for Q&A.

From the workshop folder, run:

```bash
npm start
```

Open [the local deck](http://127.0.0.1:4173/slides/index.html), or [start at slide 10](http://127.0.0.1:4173/slides/index.html#/sandbox-architecture). Use Left/Right or Space to navigate and **S** to open speaker notes and the presenter timer. Click the labeled action, scenario, resource, isolation, and mount controls to explore each diagram. Start any comic and use Pause or Replay as needed. Tab/Enter/Space operate the controls. The slide background does not advance on a click.

On slide 9, Left/Right or Space step through the six code highlight states. Captions and diagram emphasis follow the active lines; code stays in place. **Copy command** copies the complete six-line command without line numbers. Follow the [socket runbook](../demo/01-docker-socket/runbook.md) to set `DEMO_DIR` in the host terminal before using it. Copying does not execute the command.

On slide 10, select the host engine, sandbox engine, workspace, and network paths to compare their boundaries. Slide 11 provides Play/Pause/Replay for the 11-second microVM scene. Its [video fallback](../recordings/microvm-comic-backup.webm) and [poster](../slides/assets/microvm/poster.png) illustrate the mechanism rather than a live result.

On slide 12, Left/Right or Space move through five launch highlights with synchronized captions and diagram emphasis. Copy command returns all five lines. See the [launch runbook](agent-launch.md) for prerequisites and the validation record. Syntax is checked against installed sbx v0.48.0; authenticated agent launch remains a rehearsal step.

On slide 13, select **Task + data**, **Python**, **Dockerfile + build**, or **Publish + app**. The Docker view has separate Dockerfile and Build/run states. Left/Right or Space moves the line emphasis for the current view, and each view remembers its position. The source and screenshot are labeled prepared examples. The [app runbook](../demo/02-agent-streamlit/runbook.md), [verification record](../demo/02-agent-streamlit/verification.md), and [interactive dashboard fallback](prepared-dashboard.html) support the shortened nine-minute route.

On slide 14, workspace mode and resource emphasis are independent controls. On slide 15, select one of four prepared evidence cases. Predictions are shown separately from the empty presenter observation field; type actual output only after observing it. Arrow and Space keys remain inside that field while it has focus. Use the [access-control runbook](../demo/03-access-controls/runbook.md) before the session. Slide 16 provides three optional decision scenarios. Slide 17 keeps the takeaways and resource link visible throughout Q&A.

Slides use local assets and work without internet access. A local server enables presenter notes; opening `slides/index.html` directly is also available for the audience view. Operating-system reduced-motion preferences select a static comic state.

For a static export, open [the print view](http://127.0.0.1:4173/slides/index.html?print-pdf), then print/save as PDF with background graphics enabled and margins set to none. The 17-page export expands alternate explanations, all code steps, evidence predictions, decision reasons, and source citations rather than hiding them behind interactive controls.

If the comic cannot play, use the [local recording](../recordings/approval-fatigue-backup.webm) or its [final poster frame](../slides/assets/approval-fatigue/poster.png). The recording is a backup of the illustrated scene, not a live agent demonstration.

Slide 8 also has a [socket illustration recording](../recordings/socket-comic-backup.webm) and [poster](../slides/assets/docker-socket/poster.png). For the actual socket demo, use the separate [recorded-result replay](socket-recorded-result.html) or [terminal-result video](../recordings/socket-demo-backup.webm) if necessary. These replay stdout from a verified local run and are labeled accordingly. Verification details and image digests are in [the demo record](../demo/01-docker-socket/verification.md).

To restore bundled assets after a fresh dependency installation:

```bash
npm ci
npm run build
npm start
```

Dependency installation requires connectivity. The bundled files under `slides/vendor/` and `slides/assets/fonts/` let an existing checkout run without downloading packages.
