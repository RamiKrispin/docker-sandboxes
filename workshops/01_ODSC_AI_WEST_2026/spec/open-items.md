# Open Items

**Updated:** October 17, 2026  
**Scope:** Remaining presenter-machine rehearsal tasks. The 17-slide HTML deck is complete and reviewable.

## Planning review

- [x] Implement and review the 17-slide storyboard with 50 minutes of content plus ten minutes of Q&A.
- [ ] Supply any preferred presenter name/title, conference branding assets, and final audience-facing resource URL. The current deck uses no invented logo, URL, or QR destination.

## Demo proof and code excerpts

- [x] Check the local platform and launch syntax: macOS 15.7.3 arm64, sbx v0.48.0. Installed help confirms the named Codex/workspace command; see `presenter/agent-launch.md`.
- [ ] Verify agent version, authentication, effective network preset/governance, and actual sandbox launch before the app demo. Recheck all prerequisites on conference hardware.
- [x] Verify the socket demo locally against Docker Desktop with the workshop fixture mounted read-only. Record actual stdout, versions, image digests, and `--rm` behavior. Recheck on the final conference setup before presenting.
- [x] Create the toy CSV, task prompt, prepared app, AppTest check, host-container validation, screenshot, recording, and interactive local fallback. Freeze exact Python/Dockerfile/build excerpts and highlight ranges for C3.
- [ ] Verify app listening address, container-to-sandbox mapping, sandbox-to-host forwarding, assigned host port, and service lifetime while the agent session is open or detached.
- [ ] Prepare distinct direct/clone sandboxes using a sanitized standalone Git repository. Confirm the host-source path and harmless permitted/denied file operations.
- [ ] Choose the network test destination, exact sandbox-scoped policy commands, allowed/explicitly denied requests, and removal steps. Capture prior state; avoid global resets. Keep model-provider access working.
- [ ] Record final live-sandbox fallback clips after the authenticated commands work on the presenter machine. Prepared app and comic fallbacks already exist.

## HTML production and QA

- [x] Build slides 01–05 with local Reveal.js/Inter, three interactive diagrams, the approval-fatigue scene, presenter notes, reduced-motion state, poster/recording, and a static export with full captions/sources.
- [x] Complete independent content review and browser checks for the first five slides. The user requested continuation with slides 06–09.
- [x] Build slides 06–09 and independently review Topics 02–03. Verify 21 diagram selections across all nine slides, six forward/reverse highlight states, exact source copying, socket scene controls, offline use, and the nine-page static export.
- [x] Continue after slides 06–09 under the user’s request for the next three slides.
- [x] Build slides 10–12 and independently review Topic 04. Verify 25 diagram selections across all twelve slides, all five launch highlights in both directions, exact command copying, microVM pause/resume/exit behavior, reduced motion, offline use, and the twelve-page static export.

- [x] Pin and bundle Reveal.js 6.0.2 (including notes/highlighting) and Inter 5.3.0 for offline use.
- [x] Check Bash syntax treatment and complete-command copying on slide 09.
- [x] Implement forward/reverse highlights and synchronized captions/diagram emphasis on slide 09 with keyboard focus protection.
- [x] Extend reversible RevealHighlight walkthroughs, synchronized captions, remembered positions, and exact-source copying to every app/code view on slide 13.
- [x] Produce consistent robot/engineer assets, three comics, poster frames, reduced-motion states, and video alternatives.
- [x] Review slides 10–12 architecture captions and notes against official sources, including writable sharing and local stdio MCP integrations outside the VM.
- [x] Review readable clone-source caveats and the independent workspace/network controls on slides 14–15.
- [x] Run independent topic QA and browser checks for slides 01–12, including keyboard, contrast, viewport fit, offline/fallback, and static export.
- [x] Complete independent content QA and browser checks for slides 13–17: all interaction states, two target viewports, direct-file offline use, local-only requests, keyboard editing/navigation, and a 17-page print export.
- [ ] Rehearse the nine-minute app segment with a two-minute generation limit and prepared dependencies/images; verify the fallback can take over without overrunning 42:00.
- [ ] Complete a timed rehearsal, validate shortened demo paths, and finish all content by 50:00, preserving 50:00–60:00 for questions.
