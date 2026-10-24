# Workshop Agenda

Timing from the [development brief](../docker_sandboxes_ai_agents_workshop_development_plan.md). The [deck plan](deck-plan.md) specifies each slide and interaction. All sections share `slides/index.html`; slides 01–12 and the socket demo are implemented. The launch syntax is checked; live sandbox/app rehearsal and later sections remain planned.

| Topic | Window | Slides | Learning goal | Depends on | Supporting material |
| --- | --- | --- | --- | --- | --- |
| 01 — Why do AI agents need sandboxes? | 00:00–10:00 | 01–05 | Connect agent actions and approval fatigue to explicit boundaries | — | Comic A, host/boundary diagram |
| 02 — Different levels of isolation | 10:00–18:00 | 06–07 | Compare execution controls and introduce container configuration | 01 | Isolation spectrum, Linux/macOS diagrams |
| 03 — Why aren't containers always enough? | 18:00–26:00 | 08–09 | Explain a socket-enabled client requesting a second container | 02 | Comic B, six-minute socket demo |
| 04 — Docker Sandboxes architecture and setup | 26:00–33:00 | 10–12 | Locate the microVM and separate Docker engine; understand agent launch | 03 | Comic C, architecture comparison, launch excerpt |
| 05 — Autonomous agent builds a data app | 33:00–42:00 | 13 | Observe a CSV dashboard being built and served inside the sandbox | 04 | Nine-minute segment; prepared environment, two-minute generation limit |
| 06 — Control and verify permissions | 42:00–49:00 | 14–15 | Compare direct/clone writes and inspect network access | 05 | `demo/03-access-controls/`, captured evidence |
| 07 — Wrap-up | 49:00–50:00 | 16–17 | Choose a suitable environment and recall shared-resource limits | 01–06 | Decision guide, verified references |
| Q&A | 50:00–60:00 | 17 stays visible | Answer attendee questions | 01–07 | Revisit relevant diagrams/code as needed |

Keep topic bridges within existing slides. Finish all planned content by 50:00 and reserve the full final ten minutes for questions. Use prepared environments and fallback results if demos run long. Topic READMEs remain off by default; the later demo runbooks carry operating instructions.
